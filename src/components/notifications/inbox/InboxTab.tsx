"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { AdminNotification } from "@/types/notification";
import { markRead } from "@/lib/notificationStorage";
import { inboxStats, unreadByCategory } from "@/lib/notificationStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TablePagination } from "@/components/ui/TablePagination";
import { useNotificationsStore } from "../shared/useNotificationsStore";
import {
  INBOX_FILTER_KEYS,
  INBOX_PAGE_SIZE,
  applyInboxFilters,
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
  const { inbox } = useNotificationsStore();
  const actions = useInboxActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<AdminNotification[] | null>(null);

  const q = get("q");
  const category = parseInboxCategory(get("category"));
  const status = parseInboxStatus(get("status"));
  const highOnly = get("priority") === "high";
  const listed = useMemo(() => applyInboxFilters(inbox, { q, category, status, highOnly }), [inbox, q, category, status, highOnly]);
  const filters: InboxFilters = { q, category, status, highOnly };
  const byCategory = useMemo(() => unreadByCategory(inbox), [inbox]);
  const unreadTotal = inboxStats(inbox).unread;

  const totalPages = Math.max(1, Math.ceil(listed.length / INBOX_PAGE_SIZE));
  const page = Math.min(getPage(), totalPages);
  const rows = listed.slice((page - 1) * INBOX_PAGE_SIZE, page * INBOX_PAGE_SIZE);
  const rowIds = new Set(rows.map((n) => n.id));
  const selected = rows.filter((n) => selectedIds.includes(n.id));
  const visibleSelectedIds = selectedIds.filter((id) => rowIds.has(id));

  const update = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set({ ...updates, page: "page" in updates ? updates.page : null });
  };
  const reset = () => update({ ...INBOX_FILTER_KEYS });

  const open = (n: AdminNotification) => {
    if (!n.isRead) markRead([n.id]);
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

        {rows.length > 0 ? (
          <>
            <InboxFeed
              items={rows}
              selectedIds={visibleSelectedIds}
              onSelect={(id, checked) => setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)))}
              onSelectAll={(checked) => setSelectedIds(checked ? rows.map((n) => n.id) : [])}
              onOpen={open}
              handlers={handlers}
            />
            {listed.length > INBOX_PAGE_SIZE && (
              <TablePagination
                variant="plain"
                currentPage={page}
                pageSize={INBOX_PAGE_SIZE}
                totalCount={listed.length}
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
