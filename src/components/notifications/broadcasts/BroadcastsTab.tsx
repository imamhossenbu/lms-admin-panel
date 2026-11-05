"use client";

import React, { Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUrlParams } from "@/lib/useUrlParams";
import { TablePagination } from "@/components/ui/TablePagination";
import { useNotificationsReady, useNotificationsStore } from "@/components/notifications/shared/useNotificationsStore";
import { useServerPage } from "@/components/notifications/shared/useServerPage";
import { fetchBroadcastPage } from "@/lib/notificationStorage";
import { BroadcastsOverview } from "./BroadcastsOverview";
import { BroadcastsFiltersBar } from "./BroadcastsFiltersBar";
import { BroadcastsTable } from "./BroadcastsTable";
import { BroadcastsEmptyState } from "./BroadcastsEmptyState";
import { BroadcastConfirmDialogs } from "./BroadcastConfirmDialogs";
import { BroadcastsTabSkeleton } from "./BroadcastSkeletons";
import { useBroadcastActions } from "./useBroadcastActions";
import type { BroadcastRowHandlers } from "./BroadcastRowActions";
import { isBroadcastFiltered, parsePage, toBroadcastRows, type BroadcastFilters } from "./broadcastFormat";

const PAGE_SIZE = 10;
const FILTER_KEYS = { bq: null, bstatus: null, baudience: null, bchannel: null, bpage: null } as const;

/** Overview strip, URL-synced filters (?bq, ?bstatus, ?baudience, ?bchannel, ?bpage) and the broadcast table. */
function BroadcastsTabContent() {
  const router = useRouter();
  const ready = useNotificationsReady(["broadcasts"]);
  const { overview } = useNotificationsStore(["broadcasts"]);
  const { get, set } = useUrlParams();
  const actions = useBroadcastActions();

  const query = get("bq");
  const status = get("bstatus", "All");
  const audience = get("baudience", "All");
  const channel = get("bchannel", "All");
  const filters: BroadcastFilters = useMemo(() => ({ query, status, audience, channel }), [query, status, audience, channel]);

  const currentPage = parsePage(get("bpage"));
  const page = useServerPage(
    {
      page: currentPage,
      limit: PAGE_SIZE,
      q: query,
      status: status !== "All" ? status : undefined,
      audience: audience !== "All" ? audience : undefined,
      channel: channel !== "All" ? channel : undefined,
    },
    fetchBroadcastPage,
    "We couldn't load the broadcasts. Please try again."
  );
  const rows = useMemo(() => toBroadcastRows(page.rows), [page.rows]);

  if (!ready || page.isLoading) return <BroadcastsTabSkeleton />;
  const isFiltered = isBroadcastFiltered(filters);
  const goCompose = () => router.push("/notifications/compose");

  const handlers: BroadcastRowHandlers = {
    busyId: actions.busyId,
    onView: (b) => router.push(`/notifications/broadcasts/${b.id}`),
    onEdit: (b) => router.push(`/notifications/broadcasts/${b.id}/edit`),
    onDuplicate: (b) => void actions.duplicate(b),
    onCancel: actions.openCancel,
    onDelete: actions.openDelete,
  };

  const emptyMessage = isFiltered ? (
    <BroadcastsEmptyState title="No broadcasts match your filters" message="Try a different search, status, audience or channel." isFiltered onReset={() => set({ ...FILTER_KEYS })} />
  ) : (
    <BroadcastsEmptyState title="No broadcasts yet" message="Send an announcement to all students, a course, instructors or inactive learners." onCreate={goCompose} />
  );

  return (
    <div className="space-y-5">
      <BroadcastsOverview overview={overview} />
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <BroadcastsFiltersBar filters={filters} onChange={(u) => set({ ...u, bpage: null })} onReset={() => set({ ...FILTER_KEYS })} />
        <BroadcastsTable
          rows={rows}
          handlers={handlers}
          emptyMessage={emptyMessage}
          footer={
            page.total > 0 ? (
              <TablePagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={page.total}
                itemLabel="broadcasts"
                onPageChange={(next) => set({ bpage: next === 1 ? null : next })}
              />
            ) : undefined
          }
        />
      </section>
      <BroadcastConfirmDialogs actions={actions} />
    </div>
  );
}

/** Broadcasts tab body (rendered by /notifications at ?tab=broadcasts). */
export function BroadcastsTab() {
  return (
    <Suspense fallback={<BroadcastsTabSkeleton />}>
      <BroadcastsTabContent />
    </Suspense>
  );
}

export default BroadcastsTab;
