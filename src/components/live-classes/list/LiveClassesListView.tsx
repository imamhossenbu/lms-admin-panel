"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Ban, Trash2 } from "lucide-react";
import type { LiveClassItem } from "@/types/liveClass";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TablePagination } from "@/components/ui/TablePagination";
import { downloadFile, todayStamp } from "@/components/commerce/exportFile";
import { useLiveClassesData } from "./useLiveClassesData";
import { useLiveClassListActions } from "./useLiveClassListActions";
import { STATUS_PARAM, liveClassesCsv, parseDateSort, toRows, type LiveClassRow } from "./liveListUtils";
import { fetchLiveClassesMatching } from "@/lib/liveClassStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { LiveClassesHeader } from "./LiveClassesHeader";
import { LiveClassStatsRow } from "./LiveClassStatsRow";
import { LiveClassFiltersBar } from "./LiveClassFiltersBar";
import { LiveClassBulkBar } from "./LiveClassBulkBar";
import { LiveClassesTable } from "./LiveClassesTable";
import { LiveClassesEmptyState } from "./LiveClassesEmptyState";
import { LiveClassesListSkeleton } from "./LiveClassesListSkeleton";
import { LiveClassesLoadError } from "./LiveClassesLoadError";
import type { LiveClassRowHandlers } from "./LiveClassRowActions";

const PAGE_SIZES = [10, 20, 50];
const FILTER_KEYS = { q: null, status: null, instructor: null, course: null, from: null, to: null, page: null } as const;

/** Live Classes list: KPI cards, filters, bulk actions, sortable table. All view state lives in the URL. */
export function LiveClassesListView() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const actions = useLiveClassListActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<LiveClassItem | null>(null);
  const [cancelling, setCancelling] = useState<LiveClassItem | null>(null);
  const [bulkMode, setBulkMode] = useState<"cancel" | "delete" | null>(null);

  const filters = {
    q: get("q"),
    status: get("status", "All"),
    instructor: get("instructor", "All"),
    course: get("course", "All"),
    from: get("from"),
    to: get("to"),
    sort: parseDateSort(get("sort")),
  };
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];
  const page = getPage();
  const apiFilters = {
    q: filters.q,
    status: STATUS_PARAM[filters.status],
    instructorId: filters.instructor !== "All" ? filters.instructor : undefined,
    courseId: filters.course !== "All" ? filters.course : undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    sortOrder: filters.sort,
  };
  const { classes, total, stats, now, isLoading, loadError, retry } = useLiveClassesData({ ...apiFilters, page, limit: perPage });
  const isFiltered =
    !!filters.q || filters.status !== "All" || filters.instructor !== "All" || filters.course !== "All" || !!filters.from || !!filters.to;

  // The API already searched, filtered, sorted and paged.
  const rows = useMemo<LiveClassRow[]>(() => toRows(classes, now), [classes, now]);
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  useEffect(() => {
    if (!isLoading && page > lastPage) set({ page: lastPage === 1 ? null : lastPage });
  }, [isLoading, page, lastPage, set]);

  if (isLoading || !stats) return <LiveClassesListSkeleton />;
  if (loadError) return <LiveClassesLoadError message={loadError} onRetry={retry} />;

  const currentPage = Math.min(page, lastPage);
  const pageIds = new Set(rows.map((r) => r.id));
  const visibleSelected = selectedIds.filter((id) => pageIds.has(id));
  const selectedItems = classes.filter((c) => visibleSelected.includes(c.id));

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set(updates);
  };
  const resetFilters = () => updateParams({ ...FILTER_KEYS });
  const goSchedule = () => router.push("/live-classes/schedule");

  const exportRows = (list: LiveClassRow[], label: string) => {
    if (!list.length) return;
    downloadFile(liveClassesCsv(list), `live-classes-${label}-${todayStamp()}.csv`, "text/csv");
    toast.success("Export ready", { description: `${list.length} live class${list.length === 1 ? "" : "es"} exported to CSV.` });
  };
  /** Export every class matching the filters (all pages), read from the API. */
  const exportFiltered = async () => {
    const id = toast.loading("Preparing export...", { description: "Reading every matching live class." });
    try {
      const all = toRows(await fetchLiveClassesMatching(apiFilters), now);
      toast.dismiss(id);
      exportRows(all, isFiltered ? "filtered" : "all");
    } catch (err) {
      toast.error("Couldn't export live classes", { id, description: apiErrorMessage(err, "Please try again.") });
    }
  };

  const handlers: LiveClassRowHandlers = {
    busyId: actions.busyId,
    onView: (c) => router.push(`/live-classes/${c.id}`),
    onEdit: (c) => router.push(`/live-classes/${c.id}/edit`),
    onCopyLink: (c) => void actions.copyLink(c),
    onDuplicate: (c) => void actions.duplicate(c),
    onCancel: setCancelling,
    onRestore: (c) => void actions.restore(c),
    onDelete: setDeleting,
  };

  const onSelectRow = (id: string, checked: boolean) =>
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  const onSelectAll = (checked: boolean) => setSelectedIds(checked ? rows.map((r) => r.id) : []);
  const cancellable = selectedItems.filter((c) => c.status !== "CANCELLED");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <LiveClassesHeader
        filteredCount={total}
        selectedCount={visibleSelected.length}
        onExportFiltered={() => void exportFiltered()}
        onExportSelected={() => exportRows(rows.filter((r) => visibleSelected.includes(r.id)), "selected")}
        onSchedule={goSchedule}
      />
      <LiveClassStatsRow stats={stats} />

      <div className="dashboard-card shadow-2xs p-5 space-y-4">
        <LiveClassFiltersBar
          query={filters.q}
          status={filters.status}
          instructor={filters.instructor}
          course={filters.course}
          from={filters.from}
          to={filters.to}
          isFiltered={isFiltered}
          onChange={(updates) => updateParams({ ...updates, page: null })}
          onReset={resetFilters}
        />

        <LiveClassBulkBar
          count={visibleSelected.length}
          busy={actions.isBulkBusy}
          onCancel={() => setBulkMode("cancel")}
          onDelete={() => setBulkMode("delete")}
          onClear={() => setSelectedIds([])}
        />

        <LiveClassesTable
          rows={rows}
          handlers={handlers}
          dateSort={filters.sort}
          onDateSortClick={() => updateParams({ sort: filters.sort === "desc" ? "asc" : null, page: null })}
          selectedIds={visibleSelected}
          onSelectRow={onSelectRow}
          onSelectAll={onSelectAll}
          emptyMessage={<LiveClassesEmptyState isFiltered={isFiltered} onReset={resetFilters} onSchedule={goSchedule} />}
          footer={
            total > 0 ? (
              <TablePagination
                currentPage={currentPage}
                pageSize={perPage}
                totalCount={total}
                itemLabel="live classes"
                onPageChange={(next) => updateParams({ page: next })}
                onPageSizeChange={(size) => updateParams({ perPage: size === PAGE_SIZES[0] ? null : size, page: null })}
                pageSizeOptions={PAGE_SIZES}
              />
            ) : undefined
          }
        />
      </div>

      <ConfirmModal
        isOpen={!!cancelling}
        title="Cancel Live Class"
        subtitle={cancelling ? `"${cancelling.title}"` : undefined}
        message="Enrolled students will be notified that this class is cancelled. You can restore it later."
        confirmLabel="Cancel Class"
        pendingLabel="Cancelling..."
        confirmIcon={<Ban className="w-4 h-4" />}
        onClose={() => setCancelling(null)}
        onConfirm={async () => {
          if (cancelling) await actions.cancel(cancelling);
        }}
      />

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Live Class"
        subtitle={deleting ? `"${deleting.title}"` : undefined}
        message="This removes the class together with its attendance, Q&A, resources and activity. This action cannot be undone."
        confirmLabel="Delete Class"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await actions.remove(deleting);
          setSelectedIds((prev) => prev.filter((id) => id !== deleting.id));
        }}
      />

      <ConfirmModal
        isOpen={bulkMode !== null}
        title={bulkMode === "delete" ? "Delete Selected Classes" : "Cancel Selected Classes"}
        subtitle={`${(bulkMode === "delete" ? selectedItems : cancellable).length} class${
          (bulkMode === "delete" ? selectedItems : cancellable).length === 1 ? "" : "es"
        } ${bulkMode === "delete" ? "selected" : "will be cancelled"}`}
        message={
          bulkMode === "delete"
            ? "The selected classes and all of their attendance, Q&A and resources will be removed. This action cannot be undone."
            : cancellable.length
              ? "Enrolled students will be notified. Already-cancelled classes are skipped."
              : "All selected classes are already cancelled."
        }
        confirmLabel={bulkMode === "delete" ? "Delete All" : "Cancel Classes"}
        pendingLabel={bulkMode === "delete" ? "Deleting..." : "Cancelling..."}
        confirmIcon={bulkMode === "delete" ? <Trash2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
        onClose={() => setBulkMode(null)}
        onConfirm={async () => {
          if (bulkMode === "delete") await actions.bulkRemove(selectedItems);
          else await actions.bulkCancel(selectedItems);
          setSelectedIds([]);
        }}
      />
    </motion.div>
  );
}

export default LiveClassesListView;
