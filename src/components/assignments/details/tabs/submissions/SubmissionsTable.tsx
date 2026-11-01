"use client";

import React from "react";
import type { AssignmentSubmission } from "@/types/assignment";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { timeAgo } from "@/lib/assignmentStats";
import { formatDateTime, formatDuration } from "../../assignmentFormat";
import { StudentCell } from "./StudentCell";
import { SubmissionStatusBadges } from "./SubmissionStatusBadges";
import { SubmissionRowActions } from "./SubmissionRowActions";

export interface SubmissionsTableProps {
  rows: AssignmentSubmission[];
  /** Index of the first row on this page (for the # column). */
  offset: number;
  totalPoints: number;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (s: AssignmentSubmission) => void;
  onGrade: (s: AssignmentSubmission) => void;
  onDownload: (s: AssignmentSubmission) => void;
}

/** Submissions DataTable: checkbox, #, student, date, status, score, time taken, actions. */
export function SubmissionsTable({ rows, offset, totalPoints, selectedIds, onSelectRow, onSelectAll, onView, onGrade, onDownload }: SubmissionsTableProps) {
  const columns: ColumnDef<AssignmentSubmission>[] = [
    { key: "index", header: "#", width: "w-12", align: "center", render: (_, i) => <span className="body-sm-medium">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (s) => <StudentCell student={s.student} /> },
    {
      key: "submittedAt",
      header: "Submission Date",
      render: (s) => (
        <div className="whitespace-nowrap">
          <p className="body-sm-regular text-primary-500">{formatDateTime(s.submittedAt)}</p>
          <p className="body-xsm-regular text-primary-300">{timeAgo(s.submittedAt)}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (s) => <SubmissionStatusBadges submission={s} /> },
    {
      key: "score",
      header: "Score",
      render: (s) => <span className="whitespace-nowrap body-sm-medium">{s.score === null ? "-" : `${s.score} / ${totalPoints}`}</span>,
    },
    { key: "time", header: "Time Taken", render: (s) => <span className="whitespace-nowrap">{formatDuration(s.timeTakenMinutes)}</span> },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (s) => <SubmissionRowActions onView={() => onView(s)} onGrade={() => onGrade(s)} onDownload={() => onDownload(s)} canDownload={Boolean(s.fileName)} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      rowKey={(s) => s.id}
      selectable
      selectedRowKeys={selectedIds}
      onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
      onSelectAll={onSelectAll}
      minWidth="min-w-240"
      emptyMessage="No submissions match your filters."
    />
  );
}

export default SubmissionsTable;
