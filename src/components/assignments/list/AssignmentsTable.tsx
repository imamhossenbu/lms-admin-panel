"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { AssignmentItem } from "@/types/assignment";
import { ASSIGNMENT_STATUS_VIEW, ASSIGNMENT_TYPE_VIEW, type DueSort } from "./assignmentListUtils";
import { AssignmentTitleCell, DueDateCell, SubmissionsProgress } from "./AssignmentCells";
import { AssignmentRowActions, type AssignmentRowHandlers } from "./AssignmentRowActions";

/** One table/grid row: the assignment plus everything derived for display. */
export interface AssignmentRow {
  id: string;
  /** 1-based position in the filtered list (grid card prefix). */
  number: number;
  assignment: AssignmentItem;
  /** Course title — only set in the all-courses view. */
  courseLabel: string | null;
  moduleLabel: string;
  lessonLabel: string | null;
  /** Compact "Module 1 · Lesson 4" ("HTML Fundamentals · Module 1 · Lesson 4" across all courses). */
  metaLabel: string;
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
    {
      key: "assignment",
      header: "Assignment",
      render: (r) => (
        <AssignmentTitleCell
          title={r.assignment.title}
          meta={r.metaLabel}
          metaTitle={[r.courseLabel, r.moduleLabel, r.lessonLabel ?? "No lesson linked"].filter(Boolean).join(" · ")}
        />
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "76px",
      render: (r) => {
        const view = ASSIGNMENT_TYPE_VIEW[r.assignment.type];
        return (
          <span title={view.label}>
            <ToneBadge tone={view.tone} size="sm">
              {view.short}
            </ToneBadge>
          </span>
        );
      },
    },
    {
      key: "due",
      header: "Due Date",
      width: "124px",
      sortDirection: dueSort,
      onHeaderClick: onDueSortClick,
      render: (r) => <DueDateCell assignment={r.assignment} />,
    },
    {
      key: "submissions",
      header: "Submissions",
      width: "108px",
      render: (r) => <SubmissionsProgress compact submitted={r.submitted} enrolled={r.assignment.enrolledCount} />,
    },
    {
      key: "status",
      header: "Status",
      width: "104px",
      render: (r) => (
        <ToneBadge tone={ASSIGNMENT_STATUS_VIEW[r.assignment.status].tone} size="sm" dot>
          {ASSIGNMENT_STATUS_VIEW[r.assignment.status].label}
        </ToneBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "88px",
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
        tableClassName="table-fixed"
        minWidth="min-w-180"
        thClassName="px-3 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-3 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default AssignmentsTable;
