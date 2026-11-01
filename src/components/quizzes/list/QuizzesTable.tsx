"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { QUIZ_STATUS_VIEW } from "../wizard/quizWizardFormat";
import type { QuizRow, UpdatedSort } from "./quizListUtils";
import { CourseModuleCell, MarksCell, QuizTitleCell, UpdatedCell } from "./QuizCells";
import { QuizRowActions, type QuizRowHandlers } from "./QuizRowActions";

export interface QuizzesTableProps {
  rows: QuizRow[];
  handlers: QuizRowHandlers;
  updatedSort: UpdatedSort;
  onUpdatedSortClick: () => void;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: React.ReactNode;
  /** Pagination footer, rendered inside the bordered card. */
  footer?: React.ReactNode;
}

const num = (v: React.ReactNode) => <span className="body-sm-regular text-primary-500 tabular-nums">{v}</span>;

/** Compact quizzes table (Course + Module and Total Marks + Pass Mark merged so it fits ~1280px without horizontal scroll). */
export function QuizzesTable({ rows, handlers, updatedSort, onUpdatedSortClick, selectedIds, onSelectRow, onSelectAll, emptyMessage, footer }: QuizzesTableProps) {
  const columns: ColumnDef<QuizRow>[] = [
    { key: "title", header: "Quiz Title", render: (r) => <QuizTitleCell title={r.quiz.title} description={r.description} /> },
    { key: "course", header: "Course / Module", width: "160px", render: (r) => <CourseModuleCell course={r.courseTitle} module={r.moduleLabel} /> },
    { key: "questions", header: "Questions", width: "80px", align: "center", render: (r) => num(r.questionCount) },
    { key: "marks", header: "Marks / Pass", width: "96px", align: "center", render: (r) => <MarksCell total={r.totalMarks} passPct={r.passPct} /> },
    { key: "attempts", header: "Attempts", width: "78px", align: "center", render: (r) => num(r.attempts.toLocaleString()) },
    {
      key: "status",
      header: "Status",
      width: "92px",
      align: "center",
      render: (r) => (
        <ToneBadge tone={QUIZ_STATUS_VIEW[r.quiz.status].tone} size="sm">
          {QUIZ_STATUS_VIEW[r.quiz.status].label}
        </ToneBadge>
      ),
    },
    { key: "updated", header: "Updated", width: "108px", sortDirection: updatedSort, onHeaderClick: onUpdatedSortClick, render: (r) => <UpdatedCell iso={r.quiz.updatedAt} /> },
    { key: "actions", header: "Actions", width: "60px", align: "center", render: (r) => <QuizRowActions quiz={r.quiz} handlers={handlers} /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => handlers.onView(r.quiz)}
        selectable
        selectedRowKeys={selectedIds}
        onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
        onSelectAll={onSelectAll}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-225"
        thClassName="px-2.5 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-2.5 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default QuizzesTable;
