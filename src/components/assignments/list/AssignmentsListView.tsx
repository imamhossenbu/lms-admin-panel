"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import { useUrlParams } from "@/lib/useUrlParams";
import { getLessonEditorContext } from "@/lib/lessonEditorStorage";
import { isKnownCourse } from "@/data/mockCourseCatalog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TablePagination } from "@/components/ui/TablePagination";
import { AssignmentsLoadError } from "./AssignmentsLoadError";
import {
  countSubmissions,
  countsFor,
  matchesTab,
  moduleFilterOptions,
  moduleLessonLabels,
  nextDueSort,
  parseDueSort,
  parseListTab,
  sortByDue,
  type AssignmentListTab,
} from "./assignmentListUtils";
import { useAssignmentsData } from "./useAssignmentsData";
import { useAssignmentListActions } from "./useAssignmentListActions";
import { AssignmentsHeader } from "./AssignmentsHeader";
import { AssignmentStatsRow } from "./AssignmentStatsRow";
import { AssignmentTabsBar } from "./AssignmentTabsBar";
import { AssignmentFiltersBar, type AssignmentListView } from "./AssignmentFiltersBar";
import { AssignmentBulkBar } from "./AssignmentBulkBar";
import { AssignmentsTable, type AssignmentRow } from "./AssignmentsTable";
import { AssignmentsGrid } from "./AssignmentsGrid";
import { AssignmentsEmptyState } from "./AssignmentsEmptyState";
import { AssignmentsListSkeleton } from "./AssignmentsListSkeleton";
import type { AssignmentRowHandlers } from "./AssignmentRowActions";

const TABLE_PAGE_SIZES = [10, 20, 50];
const GRID_PAGE_SIZES = [6, 12, 24];
const FILTER_KEYS = { q: null, course: null, module: null, status: null, type: null, page: null } as const;

/**
 * Assignments list page: stats, tabs, filters, table / grid, bulk actions. All state lives in the URL.
 * `?course=<id>` scopes everything to one course; without it (or with an unknown id) all courses are listed.
 */
export function AssignmentsListView() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const courseParam = get("course");
  const courseId = isKnownCourse(courseParam) ? courseParam : null;
  const { assignments, submissions, isLoading, loadError, retry } = useAssignmentsData(courseId ?? undefined);
  const actions = useAssignmentListActions();

  /** Module / lesson labels come from each assignment's OWN course — one context per course id. */
  const contexts = useMemo(() => {
    const ids = new Set(assignments.map((a) => a.courseId));
    if (courseId) ids.add(courseId);
    return new Map(Array.from(ids, (id) => [id, getLessonEditorContext(id)] as const));
  }, [assignments, courseId]);
  const courseContext = courseId ? (contexts.get(courseId) ?? null) : null;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<AssignmentItem | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const tab = parseListTab(get("tab"));
  const query = get("q");
  const moduleId = courseId ? get("module", "All") : "All";
  const status = get("status", "All");
  const type = get("type", "All");
  const dueSort = parseDueSort(get("sort"));
  const view: AssignmentListView = get("view") === "grid" ? "grid" : "table";
  const pageSizes = view === "grid" ? GRID_PAGE_SIZES : TABLE_PAGE_SIZES;
  const perPageParam = Number(get("perPage"));
  const perPage = pageSizes.includes(perPageParam) ? perPageParam : pageSizes[0];
  const page = getPage();
  const isFiltered = !!courseId || !!query || moduleId !== "All" || status !== "All" || type !== "All";

  const counts = useMemo(() => countSubmissions(submissions), [submissions]);

  const filtered = useMemo<AssignmentRow[]>(() => {
    const q = query.toLowerCase().trim();
    const list = assignments.filter((a) => {
      if (!matchesTab(a, tab, countsFor(counts, a.id))) return false;
      if (moduleId !== "All" && a.moduleId !== moduleId) return false;
      if (status !== "All" && a.status !== status) return false;
      if (type !== "All" && a.type !== type) return false;
      if (!q) return true;
      const ctx = contexts.get(a.courseId) ?? getLessonEditorContext(a.courseId);
      const labels = moduleLessonLabels(a, ctx);
      return [a.title, ctx.course.title, labels.module, labels.lesson ?? ""].some((s) => s.toLowerCase().includes(q));
    });
    return sortByDue(list, dueSort).map((a, i) => {
      const ctx = contexts.get(a.courseId) ?? getLessonEditorContext(a.courseId);
      const labels = moduleLessonLabels(a, ctx);
      // All-courses view: prefix the course so rows from different courses are distinguishable.
      const courseLabel = courseId ? null : ctx.course.title;
      return {
        id: a.id,
        number: i + 1,
        assignment: a,
        courseLabel,
        moduleLabel: labels.module,
        lessonLabel: labels.lesson,
        metaLabel: courseLabel ? `${courseLabel} · ${labels.short}` : labels.short,
        submitted: countsFor(counts, a.id).submitted,
      };
    });
  }, [assignments, counts, contexts, courseId, tab, query, moduleId, status, type, dueSort]);

  if (isLoading) return <AssignmentsListSkeleton view={view} withBanner={!!courseId} />;
  if (loadError) return <AssignmentsLoadError message={loadError} onRetry={retry} />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageIds = new Set(rows.map((r) => r.id));
  const visibleSelected = selectedIds.filter((id) => pageIds.has(id));
  const selectedItems = assignments.filter((a) => visibleSelected.includes(a.id));

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set(updates);
  };
  const resetFilters = () => updateParams({ ...FILTER_KEYS });
  const goCreate = () => router.push(courseId ? `/assignments/create?course=${encodeURIComponent(courseId)}` : "/assignments/create");

  const handlers: AssignmentRowHandlers = {
    busyId: actions.busyId,
    onView: (a) => router.push(`/assignments/${a.id}`),
    onEdit: (a) => router.push(`/assignments/${a.id}/edit`),
    onDuplicate: (a) => void actions.duplicate(a),
    onToggleStatus: (a) => void actions.setStatus(a, a.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"),
    onDelete: setDeleting,
  };

  const onSelectRow = (id: string, checked: boolean) =>
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  const onSelectAll = (checked: boolean) => setSelectedIds(checked ? rows.map((r) => r.id) : []);

  const emptyState = (
    <AssignmentsEmptyState tab={tab} isFiltered={isFiltered} onReset={resetFilters} onCreate={goCreate} />
  );

  const pagination = (
    <TablePagination
      variant={view === "grid" ? "plain" : "attached"}
      currentPage={currentPage}
      pageSize={perPage}
      totalCount={filtered.length}
      itemLabel="assignments"
      onPageChange={(next) => updateParams({ page: next })}
      onPageSizeChange={(size) => updateParams({ perPage: size === pageSizes[0] ? null : size, page: null })}
      pageSizeOptions={pageSizes}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <AssignmentsHeader course={courseContext?.course ?? null} />
      <AssignmentStatsRow assignments={assignments} submissions={submissions} />
      <AssignmentTabsBar
        active={tab}
        onChange={(next: AssignmentListTab) => updateParams({ tab: next === "all" ? null : next, page: null })}
        onCreate={goCreate}
      />

      <div className="dashboard-card shadow-2xs p-5 space-y-4">
        <AssignmentFiltersBar
          query={query}
          courseId={courseId ?? "All"}
          moduleId={moduleId}
          status={status}
          type={type}
          view={view}
          moduleOptions={courseContext ? moduleFilterOptions(courseContext) : []}
          isFiltered={isFiltered}
          onChange={(updates) => updateParams({ ...updates, page: null })}
          onCourseChange={(next) => updateParams({ course: next, module: null, page: null })}
          onReset={resetFilters}
          onViewChange={(next) => updateParams({ view: next === "table" ? null : next, perPage: null, page: null })}
        />

        <AssignmentBulkBar
          count={visibleSelected.length}
          busy={actions.isBulkBusy}
          onPublish={() => void actions.bulkSetStatus(selectedItems, "PUBLISHED").then(() => setSelectedIds([]))}
          onDraft={() => void actions.bulkSetStatus(selectedItems, "DRAFT").then(() => setSelectedIds([]))}
          onDelete={() => setBulkDeleteOpen(true)}
          onClear={() => setSelectedIds([])}
        />

        {view === "table" ? (
          <AssignmentsTable
            rows={rows}
            handlers={handlers}
            dueSort={dueSort}
            onDueSortClick={() => updateParams({ sort: nextDueSort(dueSort), page: null })}
            selectedIds={visibleSelected}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
            emptyMessage={emptyState}
            footer={filtered.length > 0 ? pagination : undefined}
          />
        ) : rows.length > 0 ? (
          <>
            <AssignmentsGrid rows={rows} handlers={handlers} selectedIds={visibleSelected} onSelectRow={onSelectRow} />
            {pagination}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-dash">{emptyState}</div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Assignment"
        subtitle={deleting ? `"${deleting.title}"` : undefined}
        message="This removes the assignment together with all of its submissions and grades. This action cannot be undone."
        confirmLabel="Delete Assignment"
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
        isOpen={bulkDeleteOpen}
        title="Delete Selected Assignments"
        subtitle={`${selectedItems.length} assignment${selectedItems.length === 1 ? "" : "s"} selected`}
        message="The selected assignments and all of their submissions and grades will be removed. This action cannot be undone."
        confirmLabel="Delete All"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={async () => {
          await actions.bulkRemove(selectedItems);
          setSelectedIds([]);
        }}
      />
    </motion.div>
  );
}

export default AssignmentsListView;
