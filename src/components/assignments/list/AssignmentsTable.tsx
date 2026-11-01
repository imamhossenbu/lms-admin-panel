"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { AssignmentItem } from "@/types/assignment";
import { ASSIGNMENT_STATUS_VIEW, ASSIGNMENT_TYPE_VIEW, type DueSort } from "./assignmentListUtils";
import { DueDateCell, ModuleLessonCell, SubmissionsProgress } from "./AssignmentCells";
import { AssignmentRowActions, type AssignmentRowHandlers } from "./AssignmentRowActions";

/** One table/grid row: the assignment plus everything derived for display. */
export interface AssignmentRow {
  id: string;
  /** 1-based position in the filtered list ("#"). */
  number: number;
  assignment: AssignmentItem;
  moduleLabel: string;
  lessonLabel: string | null;
  submitted: number;
}

export interface AssignmentsTableProps {
  rows: AssignmentRow[];
  handlers: AssignmentRowHandlers;
  dueSort: DueSort;
  onDueSortClick: () => void;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: React.ReactNode;
  /** Pagination footer, rendered inside the bordered card. */
  footer?: React.ReactNode;
}

export function AssignmentsTable({
  rows,
  handlers,
  dueSort,
  onDueSortClick,
  selectedIds,
  onSelectRow,
  onSelectAll,
  emptyMessage,
  footer,
}: AssignmentsTableProps) {
  const columns: ColumnDef<AssignmentRow>[] = [
    { key: "number", header: "#", width: "56px", render: (r) => <span className="body-sm-regular text-primary-500 tabular-nums">{r.number}</span> },
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <p className="body-sm-medium text-primary-500 min-w-48 max-w-72 truncate" title={r.assignment.title}>
          {r.assignment.title}
        </p>
      ),
    },
    { key: "module", header: "Module / Lesson", render: (r) => <ModuleLessonCell module={r.moduleLabel} lesson={r.lessonLabel} /> },
    {
      key: "type",
      header: "Type",
      render: (r) => <ToneBadge tone={ASSIGNMENT_TYPE_VIEW[r.assignment.type].tone}>{ASSIGNMENT_TYPE_VIEW[r.assignment.type].label}</ToneBadge>,
    },
    {
      key: "due",
      header: "Due Date",
      sortDirection: dueSort,
      onHeaderClick: onDueSortClick,
      render: (r) => <DueDateCell assignment={r.assignment} />,
    },
    { key: "submissions", header: "Submissions", render: (r) => <SubmissionsProgress submitted={r.submitted} enrolled={r.assignment.enrolledCount} /> },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <ToneBadge tone={ASSIGNMENT_STATUS_VIEW[r.assignment.status].tone} dot>
          {ASSIGNMENT_STATUS_VIEW[r.assignment.status].label}
        </ToneBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "152px",
      render: (r) => <AssignmentRowActions assignment={r.assignment} handlers={handlers} />,
    },
  ];

  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => handlers.onView(r.assignment)}
        selectable
        selectedRowKeys={selectedIds}
        onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
        onSelectAll={onSelectAll}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
        cellClassName="px-3.5 py-3"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default AssignmentsTable;
