"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { TablePagination } from "@/components/ui/TablePagination";
import { downloadSubmissionsCsv } from "../../submissionsCsv";
import { filterSubmissions } from "./submissionFilters";
import { SUBMISSION_PAGE_SIZES, useSubmissionsFilters } from "./useSubmissionsFilters";
import { SubmissionsFilterBar } from "./SubmissionsFilterBar";
import { SubmissionsTable } from "./SubmissionsTable";
import { SubmissionsGrid } from "./SubmissionsGrid";
import { SubmissionViewModal } from "./SubmissionViewModal";
import { GradeSubmissionModal } from "./GradeSubmissionModal";

export interface SubmissionsListCardProps {
  assignment: AssignmentItem;
  submissions: AssignmentSubmission[];
  onSubmissionsChange: (next: AssignmentSubmission[]) => void;
}

/** Filter bar + table/grid + pagination + view/grade modals. */
export function SubmissionsListCard({ assignment, submissions, onSubmissionsChange }: SubmissionsListCardProps) {
  const f = useSubmissionsFilters();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewing, setViewing] = useState<AssignmentSubmission | null>(null);
  const [grading, setGrading] = useState<AssignmentSubmission | null>(null);

  const groups = useMemo(() => [...new Set(submissions.map((s) => s.student.group))].filter(Boolean).sort(), [submissions]);
  const filtered = useMemo(() => filterSubmissions(submissions, f.filters), [submissions, f.filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / f.pageSize));
  const page = Math.min(f.page, totalPages);
  const offset = (page - 1) * f.pageSize;
  const rows = filtered.slice(offset, offset + f.pageSize);

  const exportRows = (list: AssignmentSubmission[], suffix: string) => {
    if (!list.length) return toast.error("Nothing to export", { description: "No submissions match the current selection." });
    const name = downloadSubmissionsCsv(assignment, list, suffix);
    toast.success("Export ready", { description: `${list.length} submission${list.length === 1 ? "" : "s"} saved to ${name}.` });
  };

  const download = (s: AssignmentSubmission) => {
    if (!s.fileName) return toast.error("No file to download", { description: "This is a text submission." });
    toast.success("Download started", { description: `${s.fileName} from ${s.student.name}.` });
  };

  const openGrade = (s: AssignmentSubmission) => {
    setViewing(null);
    setGrading(s);
  };

  return (
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <SubmissionsFilterBar
        search={f.search}
        onSearchChange={f.setSearch}
        status={f.filters.status}
        onStatusChange={f.setStatus}
        group={f.filters.group}
        groups={groups}
        onGroupChange={f.setGroup}
        sort={f.filters.sort}
        onSortChange={f.setSort}
        selectedCount={selectedIds.length}
        onExportAll={() => exportRows(filtered, "submissions")}
        onExportSelected={() => exportRows(submissions.filter((s) => selectedIds.includes(s.id)), "selected-submissions")}
        view={f.view}
        onViewChange={f.setView}
      />

      {f.view === "list" ? (
        <SubmissionsTable
          rows={rows}
          offset={offset}
          totalPoints={assignment.totalPoints}
          selectedIds={selectedIds.filter((id) => rows.some((r) => r.id === id))}
          onSelectRow={(id, checked) => setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))}
          onSelectAll={(checked) =>
            setSelectedIds((prev) => (checked ? [...new Set([...prev, ...rows.map((r) => r.id)])] : prev.filter((id) => !rows.some((r) => r.id === id))))
          }
          onView={setViewing}
          onGrade={openGrade}
          onDownload={download}
        />
      ) : (
        <SubmissionsGrid rows={rows} totalPoints={assignment.totalPoints} onView={setViewing} onGrade={openGrade} onDownload={download} />
      )}

      <TablePagination
        currentPage={page}
        totalCount={filtered.length}
        pageSize={f.pageSize}
        itemLabel="submissions"
        onPageChange={f.setPage}
        onPageSizeChange={f.setPageSize}
        pageSizeOptions={SUBMISSION_PAGE_SIZES}
        variant="plain"
      />

      <SubmissionViewModal submission={viewing} assignment={assignment} onClose={() => setViewing(null)} onGrade={openGrade} />
      <GradeSubmissionModal
        submission={grading}
        assignment={assignment}
        onClose={() => setGrading(null)}
        onGraded={(updated) => onSubmissionsChange(submissions.map((s) => (s.id === updated.id ? updated : s)))}
      />
    </section>
  );
}

export default SubmissionsListCard;
