"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { CommunityThread } from "@/types/community";
import { categoryCounts, communityStats, medianResponseHours, threadViews, topContributors, trendingTags } from "@/lib/communityStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PillTabs } from "@/components/ui/PillTabs";
import { TablePagination } from "@/components/ui/TablePagination";
import { downloadFile, todayStamp } from "@/components/commerce/exportFile";
import { cn } from "@/lib/cn";
import { useCommunityData } from "./useCommunityData";
import { useCommunityListActions, type ThreadFlag } from "./useCommunityListActions";
import {
  COMMUNITY_TABS,
  applyFilters,
  communityCsv,
  isFilteredBy,
  parseSort,
  parseTab,
  tabAndSort,
  tabCounts,
  type CommunityFilters,
  type CommunityListView as ListViewMode,
  type CommunityTab,
} from "./communityListUtils";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityStatsRow } from "./CommunityStatsRow";
import { CommunityHealthStrip } from "./CommunityHealthStrip";
import { CommunityFiltersBar } from "./CommunityFiltersBar";
import { CommunityBulkBar } from "./CommunityBulkBar";
import { ThreadList } from "./ThreadList";
import { CommunityTable } from "./CommunityTable";
import { CommunityEmptyState } from "./CommunityEmptyState";
import { CommunitySidebar } from "./CommunitySidebar";
import { CommunityListSkeleton } from "./CommunityListSkeleton";
import { CommunityLoadError } from "./CommunityLoadError";
import type { ThreadRowHandlers } from "./ThreadRowActions";

const PAGE_SIZES = [10, 20, 50];
const FILTER_KEYS = { q: null, course: null, category: null, from: null, to: null, page: null } as const;

/** Community list: stats, health strip, tabs, filters, list / table view, moderation sidebar. All list state lives in the URL. */
export function CommunityListView() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const { threads, replies, reports, isLoading, loadError, retry } = useCommunityData();
  const actions = useCommunityListActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<CommunityThread | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const tab = parseTab(get("tab"));
  const sort = parseSort(get("sort"));
  const view: ListViewMode = get("view") === "table" ? "table" : "list";
  const filters: CommunityFilters = { q: get("q"), course: get("course", "All"), category: get("category", "All"), from: get("from"), to: get("to") };
  const isFiltered = isFilteredBy(filters);
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];
  const page = getPage();

  const views = useMemo(() => threadViews(threads, replies, reports), [threads, replies, reports]);
  const derived = useMemo(
    () => ({
      stats: communityStats(views, replies),
      median: medianResponseHours(views, replies),
      contributors: topContributors(replies, 5),
      tags: trendingTags(views, 10),
      categories: categoryCounts(views),
    }),
    [views, replies]
  );

  const { q, course, category, from, to } = filters;
  const filtered = useMemo(() => applyFilters(views, { q, course, category, from, to }), [views, q, course, category, from, to]);
  const counts = useMemo(() => tabCounts(filtered), [filtered]);
  const listed = useMemo(() => tabAndSort(filtered, tab, sort), [filtered, tab, sort]);

  if (isLoading) return <CommunityListSkeleton view={view} />;
  if (loadError) return <CommunityLoadError message={loadError} onRetry={retry} />;

  const totalPages = Math.max(1, Math.ceil(listed.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = listed.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageIds = new Set(rows.map((r) => r.thread.id));
  const visibleSelected = view === "table" ? selectedIds.filter((id) => pageIds.has(id)) : [];
  const selectedThreads = threads.filter((t) => visibleSelected.includes(t.id));

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set(updates);
  };
  const resetFilters = () => updateParams({ ...FILTER_KEYS });
  const goCreate = () => router.push(course !== "All" ? `/community/new?course=${encodeURIComponent(course)}` : "/community/new");

  const exportCsv = () => {
    if (!listed.length) return;
    const toastId = toast.loading("Preparing export...", { description: `${listed.length} discussion${listed.length === 1 ? "" : "s"}` });
    try {
      downloadFile(communityCsv(listed), `community-${tab}-${todayStamp()}.csv`, "text/csv");
      toast.success("Export ready", { id: toastId, description: `${listed.length} discussion${listed.length === 1 ? "" : "s"} exported to CSV.` });
    } catch {
      toast.error("Could not export discussions", { id: toastId, description: "Your browser blocked the download. Please try again." });
    }
  };

  const handlers: ThreadRowHandlers = {
    busyId: actions.busyId,
    onView: (t) => router.push(`/community/${t.id}`),
    onEdit: (t) => router.push(`/community/${t.id}/edit`),
    onToggle: (t, flag) => void actions.setFlag(t, flag, !t[flag]),
    onDelete: setDeleting,
  };

  const allHave = (flag: ThreadFlag) => selectedThreads.length > 0 && selectedThreads.every((t) => t[flag]);
  const bulkToggle = (flag: ThreadFlag) => void actions.bulkSetFlag(selectedThreads, flag, !allHave(flag)).then(() => setSelectedIds([]));
  const onSelectRow = (id: string, checked: boolean) => setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  const onSelectAll = (checked: boolean) => setSelectedIds(checked ? rows.map((r) => r.thread.id) : []);

  const emptyState = <CommunityEmptyState tab={tab} isFiltered={isFiltered} onReset={resetFilters} onCreate={goCreate} />;
  const pagination = (
    <TablePagination
      variant={view === "table" ? "attached" : "plain"}
      currentPage={currentPage}
      pageSize={perPage}
      totalCount={listed.length}
      itemLabel="discussions"
      onPageChange={(next) => updateParams({ page: next })}
      onPageSizeChange={(size) => updateParams({ perPage: size === PAGE_SIZES[0] ? null : size, page: null })}
      pageSizeOptions={PAGE_SIZES}
    />
  );

  const isTable = view === "table";

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <CommunityHeader exportCount={listed.length} onExport={exportCsv} onCreate={goCreate} />
      <CommunityStatsRow stats={derived.stats} />
      <CommunityHealthStrip answerRate={derived.stats.answerRate} medianHours={derived.median} openReports={derived.stats.openReports} />

      <div className={cn(isTable ? "space-y-5" : "grid grid-cols-1 items-start gap-5 xl:grid-cols-12")}>
        <section className={cn("dashboard-card shadow-2xs min-w-0 space-y-4 p-5", !isTable && "xl:col-span-8")}>
          <PillTabs<CommunityTab>
            ariaLabel="Discussion status"
            tabs={COMMUNITY_TABS.map((t) => ({ ...t, count: counts[t.id] }))}
            activeId={tab}
            onChange={(next) => updateParams({ tab: next === "all" ? null : next, page: null })}
          />

          <CommunityFiltersBar
            filters={filters}
            sort={sort}
            view={view}
            isFiltered={isFiltered}
            onChange={(updates) => updateParams({ ...updates, page: null })}
            onReset={resetFilters}
            onViewChange={(next) => updateParams({ view: next === "list" ? null : next, page: null })}
          />

          {isTable ? (
            <>
              <CommunityBulkBar
                count={visibleSelected.length}
                busy={actions.isBulkBusy}
                allPinned={allHave("isPinned")}
                allLocked={allHave("isLocked")}
                allHidden={allHave("isHidden")}
                onPin={() => bulkToggle("isPinned")}
                onLock={() => bulkToggle("isLocked")}
                onHide={() => bulkToggle("isHidden")}
                onDelete={() => setBulkDeleteOpen(true)}
                onClear={() => setSelectedIds([])}
              />
              <CommunityTable
                views={rows}
                handlers={handlers}
                selectedIds={visibleSelected}
                onSelectRow={onSelectRow}
                onSelectAll={onSelectAll}
                emptyMessage={emptyState}
                footer={listed.length > 0 ? pagination : undefined}
              />
            </>
          ) : rows.length > 0 ? (
            <>
              <ThreadList views={rows} handlers={handlers} />
              {pagination}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-dash">{emptyState}</div>
          )}
        </section>

        <div className={cn("min-w-0", !isTable && "xl:col-span-4 xl:self-stretch")}>
          <CommunitySidebar
            layout={isTable ? "grid" : "column"}
            views={views}
            reports={reports}
            contributors={derived.contributors}
            tags={derived.tags}
            categoryCounts={derived.categories}
            query={q}
            category={category}
            onReview={(id) => router.push(`/community/${id}?tab=reports`)}
            onTag={(tag) => updateParams({ q: tag || null, page: null })}
            onCategory={(c) => updateParams({ category: c, page: null })}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Discussion"
        subtitle={deleting ? `"${deleting.title}"` : undefined}
        message="This removes the discussion together with all of its replies and reports. This action cannot be undone."
        confirmLabel="Delete Discussion"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await actions.remove(deleting);
          setSelectedIds((prev) => prev.filter((id) => id !== deleting.id));
        }}
      />

      <ConfirmModal
        isOpen={bulkDeleteOpen}
        title="Delete Selected Discussions"
        subtitle={`${selectedThreads.length} discussion${selectedThreads.length === 1 ? "" : "s"} selected`}
        message="The selected discussions and all of their replies and reports will be removed. This action cannot be undone."
        confirmLabel="Delete All"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={async () => {
          await actions.bulkRemove(selectedThreads);
          setSelectedIds([]);
        }}
      />
    </motion.div>
  );
}

export default CommunityListView;
