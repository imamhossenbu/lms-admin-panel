"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { AdminNotification } from "@/types/notification";
import { fetchInboxPage, markRead } from "@/lib/notificationStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TablePagination } from "@/components/ui/TablePagination";
import { useNotificationsStore } from "../shared/useNotificationsStore";
import { useServerPage } from "../shared/useServerPage";
import { InboxSkeleton } from "./InboxSkeleton";
import {
  INBOX_FILTER_KEYS,
  INBOX_PAGE_SIZE,
  categoryParam,
  isInboxFiltered,
  parseInboxCategory,
  parseInboxStatus,
  type InboxFilters,
} from "./inboxUtils";
import { InboxFilterRail } from "./InboxFilterRail";
import { InboxToolbar } from "./InboxToolbar";
import { InboxBulkBar } from "./InboxBulkBar";
import { InboxFeed } from "./InboxFeed";
import { InboxEmptyState } from "./InboxEmptyState";
import { useInboxActions } from "./useInboxActions";
import type { InboxRowHandlers } from "./InboxRowActions";

/** Inbox tab: category rail, filters (?q, ?category, ?status, ?priority, ?page), day-grouped feed, bulk actions. */
export function InboxTab() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  // Counters for the category rail come from the server (the feed itself is paged below).
  const { inboxCounters } = useNotificationsStore(["inbox"]);
  const actions = useInboxActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<AdminNotification[] | null>(null);

  const q = get("q");
  const category = parseInboxCategory(get("category"));
  const status = parseInboxStatus(get("status"));
  const highOnly = get("priority") === "high";
  const filters: InboxFilters = { q, category, status, highOnly };
  const byCategory = inboxCounters.unreadByCategory as Parameters<typeof InboxFilterRail>[0]["unreadByCategory"];
  const unreadTotal = inboxCounters.unread;

  const page = getPage();
  const { rows, total, isLoading } = useServerPage(
    { page, limit: INBOX_PAGE_SIZE, status, category: category === "ALL" ? undefined : category, highOnly, q },
    fetchInboxPage,
    "We couldn't load your inbox. Please try again."
  );
  const rowIds = new Set(rows.map((n) => n.id));
  const selected = rows.filter((n) => selectedIds.includes(n.id));
  const visibleSelectedIds = selectedIds.filter((id) => rowIds.has(id));

  const update = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set({ ...updates, page: "page" in updates ? updates.page : null });
  };
  const reset = () => update({ ...INBOX_FILTER_KEYS });

  const open = (n: AdminNotification) => {
    if (!n.isRead) void markRead([n.id]).catch(() => {});
    router.push(n.href);
  };

  const handlers: InboxRowHandlers = {
    onToggleRead: (n) => actions.setRead([n.id], !n.isRead, { silent: true }),
    onToggleArchive: (n) => {
      actions.setArchived([n.id], !n.isArchived);
      setSelectedIds((prev) => prev.filter((id) => id !== n.id));
    },
    onDelete: (n) => setDeleting([n]),
  };

  const allRead = selected.length > 0 && selected.every((n) => n.isRead);
  const archivedView = status === "archived";

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      <aside className="min-w-0 xl:col-span-3">
        <InboxFilterRail active={category} unreadTotal={unreadTotal} unreadByCategory={byCategory} onChange={(c) => update({ category: categoryParam(c) })} />
      </aside>

      <section className="dashboard-card shadow-2xs min-w-0 space-y-4 p-5 xl:col-span-9">
        <InboxToolbar
          filters={filters}
          isFiltered={isInboxFiltered(filters)}
          onQueryChange={(value) => update({ q: value || null })}
          onStatusChange={(next) => update({ status: next === "all" ? null : next })}
          onHighOnlyChange={(on) => update({ priority: on ? "high" : null })}
          onReset={reset}
        />

        <InboxBulkBar
          count={visibleSelectedIds.length}
          busy={actions.busy}
          allRead={allRead}
          archivedView={archivedView}
          onToggleRead={() => {
            actions.setRead(visibleSelectedIds, !allRead);
            setSelectedIds([]);
          }}
          onToggleArchive={() => {
            actions.setArchived(visibleSelectedIds, !archivedView);
            setSelectedIds([]);
          }}
          onDelete={() => setDeleting(selected)}
          onClear={() => setSelectedIds([])}
        />

        {isLoading ? (
          <InboxSkeleton />
        ) : rows.length > 0 ? (
          <>
            <InboxFeed
              items={rows}
              selectedIds={visibleSelectedIds}
              onSelect={(id, checked) => setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)))}
              onSelectAll={(checked) => setSelectedIds(checked ? rows.map((n) => n.id) : [])}
              onOpen={open}
              handlers={handlers}
            />
            {total > INBOX_PAGE_SIZE && (
              <TablePagination
                variant="plain"
                currentPage={page}
                pageSize={INBOX_PAGE_SIZE}
                totalCount={total}
                itemLabel="notifications"
                onPageChange={(next) => update({ page: next })}
              />
            )}
          </>
        ) : (
          <InboxEmptyState status={status} isNarrowed={!!q.trim() || category !== "ALL" || highOnly} onReset={reset} />
        )}
      </section>

      <ConfirmModal
        isOpen={!!deleting}
        title={deleting && deleting.length > 1 ? "Delete Notifications" : "Delete Notification"}
        subtitle={deleting ? (deleting.length === 1 ? `"${deleting[0].title}"` : `${deleting.length} notifications selected`) : undefined}
        message="Deleted notifications are removed from your inbox permanently. Archive them instead if you may need them later."
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          const ids = deleting.map((n) => n.id);
          await actions.remove(ids);
          setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        }}
      />
    </div>
  );
}

export default InboxTab;
