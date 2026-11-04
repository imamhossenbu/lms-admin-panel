"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { QuizItem, QuizStatus } from "@/types/quiz";
import { useQuizCourses } from "@/lib/quizStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TablePagination } from "@/components/ui/TablePagination";
import { filterRows, parseUpdatedSort, toQuizRow, type QuizListFilters } from "./quizListUtils";
import { useQuizzesData } from "./useQuizzesData";
import { useQuizListActions } from "./useQuizListActions";
import { QuizzesHeader } from "./QuizzesHeader";
import { QuizStatsRow } from "./QuizStatsRow";
import { QuizFiltersBar, type QuizListView } from "./QuizFiltersBar";
import { QuizBulkBar } from "./QuizBulkBar";
import { QuizzesTable } from "./QuizzesTable";
import { QuizzesGrid } from "./QuizzesGrid";
import { QuizzesEmptyState } from "./QuizzesEmptyState";
import { QuizzesListSkeleton } from "./QuizzesListSkeleton";
import { QuizzesLoadError } from "./QuizzesLoadError";
import type { QuizRowHandlers } from "./QuizRowActions";

const TABLE_PAGE_SIZES = [10, 20, 50];
const GRID_PAGE_SIZES = [6, 12, 24];
const FILTER_KEYS = { q: null, course: null, module: null, status: null, difficulty: null, page: null } as const;

/** Quizzes list: stats, filters, table / grid, bulk actions. All list state lives in the URL. */
export function QuizzesListView() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const loadedCourses = useQuizCourses();
  const courses = useMemo(() => loadedCourses ?? [], [loadedCourses]);
  const { quizzes, isLoading, loadError, retry } = useQuizzesData();
  const actions = useQuizListActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<QuizItem | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const courseId = get("course", "All");
  const moduleParam = get("module", "All");
  const filters: QuizListFilters = {
    query: get("q"),
    courseId,
    // A module only applies inside its own course.
    moduleId: courseId !== "All" && courses.find((c) => c.id === courseId)?.modules.some((m) => m.id === moduleParam) ? moduleParam : "All",
    status: get("status", "All"),
    difficulty: get("difficulty", "All"),
  };
  const sort = parseUpdatedSort(get("sort"));
  const view: QuizListView = get("view") === "grid" ? "grid" : "table";
  const pageSizes = view === "grid" ? GRID_PAGE_SIZES : TABLE_PAGE_SIZES;
  const perPageParam = Number(get("perPage"));
  const perPage = pageSizes.includes(perPageParam) ? perPageParam : pageSizes[0];
  const page = getPage();
  const isFiltered = !!filters.query || filters.courseId !== "All" || filters.moduleId !== "All" || filters.status !== "All" || filters.difficulty !== "All";

  const allRows = useMemo(() => {
    const counts = Object.fromEntries(quizzes.map((q) => [q.id, q.attemptSummary.total]));
    return quizzes.map((q) => toQuizRow(q, courses, counts));
  }, [quizzes, courses]);

  const { query, moduleId, status, difficulty } = filters;
  const filtered = useMemo(
    () => filterRows(allRows, { query, courseId, moduleId, status, difficulty }, sort),
    [allRows, query, courseId, moduleId, status, difficulty, sort]
  );

  if (isLoading) return <QuizzesListSkeleton view={view} />;
  if (loadError) return <QuizzesLoadError message={loadError} onRetry={retry} />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageIds = new Set(rows.map((r) => r.id));
  const visibleSelected = selectedIds.filter((id) => pageIds.has(id));
  const selectedItems = quizzes.filter((q) => visibleSelected.includes(q.id));

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set(updates);
  };
  const resetFilters = () => updateParams({ ...FILTER_KEYS });
  const goCreate = () => router.push("/quizzes/create");
  const bulkStatus = (next: QuizStatus) => void actions.bulkSetStatus(selectedItems, next).then(() => setSelectedIds([]));

  const handlers: QuizRowHandlers = {
    busyId: actions.busyId,
    onView: (q) => router.push(`/quizzes/${q.id}`),
    onEdit: (q) => router.push(`/quizzes/${q.id}/edit`),
    onDuplicate: (q) => void actions.duplicate(q),
    onPublish: (q) => void actions.setStatus(q, "PUBLISHED"),
    onUnpublish: (q) => void actions.setStatus(q, "DRAFT"),
    onArchive: (q) => void actions.setStatus(q, "ARCHIVED"),
    onDelete: setDeleting,
  };

  const onSelectRow = (id: string, checked: boolean) => setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  const onSelectAll = (checked: boolean) => setSelectedIds(checked ? rows.map((r) => r.id) : []);

  const emptyState = <QuizzesEmptyState isFiltered={isFiltered} onReset={resetFilters} onCreate={goCreate} />;
  const pagination = (
    <TablePagination
      variant={view === "grid" ? "plain" : "attached"}
      currentPage={currentPage}
      pageSize={perPage}
      totalCount={filtered.length}
      itemLabel="quizzes"
      onPageChange={(next) => updateParams({ page: next })}
      onPageSizeChange={(size) => updateParams({ perPage: size === pageSizes[0] ? null : size, page: null })}
      pageSizeOptions={pageSizes}
    />
  );

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <QuizzesHeader onCreate={goCreate} />
      <QuizStatsRow quizzes={quizzes} />

      <div className="dashboard-card shadow-2xs space-y-4 p-5">
        <QuizFiltersBar
          filters={filters}
          courses={courses}
          view={view}
          isFiltered={isFiltered}
          onChange={(updates) => updateParams({ ...updates, page: null })}
          onReset={resetFilters}
          onViewChange={(next) => updateParams({ view: next === "table" ? null : next, perPage: null, page: null })}
        />

        <QuizBulkBar
          count={visibleSelected.length}
          busy={actions.isBulkBusy}
          onPublish={() => bulkStatus("PUBLISHED")}
          onDraft={() => bulkStatus("DRAFT")}
          onArchive={() => bulkStatus("ARCHIVED")}
          onDelete={() => setBulkDeleteOpen(true)}
          onClear={() => setSelectedIds([])}
        />

        {view === "table" ? (
          <QuizzesTable
            rows={rows}
            handlers={handlers}
            updatedSort={sort}
            onUpdatedSortClick={() => updateParams({ sort: sort === "desc" ? "updated_asc" : null, page: null })}
            selectedIds={visibleSelected}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
            emptyMessage={emptyState}
            footer={filtered.length > 0 ? pagination : undefined}
          />
        ) : rows.length > 0 ? (
          <>
            <QuizzesGrid rows={rows} handlers={handlers} selectedIds={visibleSelected} onSelectRow={onSelectRow} />
            {pagination}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-dash">{emptyState}</div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Quiz"
        subtitle={deleting ? `"${deleting.title}"` : undefined}
        message="This removes the quiz together with all of its questions and student attempts. This action cannot be undone."
        confirmLabel="Delete Quiz"
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
        title="Delete Selected Quizzes"
        subtitle={`${selectedItems.length} quiz${selectedItems.length === 1 ? "" : "zes"} selected`}
        message="The selected quizzes and all of their questions and attempts will be removed. This action cannot be undone."
        confirmLabel="Delete All"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={async () => {
          await actions.bulkRemove(selectedItems);
          setSelectedIds([]);
        }}
      />
    </motion.div>
  );
}

export default QuizzesListView;
