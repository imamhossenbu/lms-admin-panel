"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { EligibleLearner } from "@/types/certificate";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { RecipientCell } from "./IssuedCells";
import { courseTitleOf, formatShortDate } from "./certificateListUtils";

export interface EligibleRow extends EligibleLearner {
  id: string;
}

export interface EligibleTableProps {
  rows: EligibleRow[];
  onIssue: (row: EligibleRow) => void;
  /** Courses whose template is missing (Issue disabled). */
  blockedCourseIds: Set<string>;
  emptyMessage: React.ReactNode;
  footer?: React.ReactNode;
}

function CompletionCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-bg">
        <motion.div className="h-full rounded-full bg-green" initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>
      <span className="shrink-0 body-xsm-medium text-primary-500 tabular-nums">{value}%</span>
    </div>
  );
}

/** Learners who completed but have no certificate yet (manual-issue courses). */
export function EligibleTable({ rows, onIssue, blockedCourseIds, emptyMessage, footer }: EligibleTableProps) {
  const columns: ColumnDef<EligibleRow>[] = [
    { key: "learner", header: "Learner", render: (r) => <RecipientCell recipient={r.recipient} /> },
    {
      key: "course",
      header: "Course",
      width: "200px",
      render: (r) => (
        <p className="truncate body-sm-regular text-primary-500" title={courseTitleOf(r.courseId)}>
          {courseTitleOf(r.courseId)}
        </p>
      ),
    },
    { key: "completion", header: "Completion", width: "140px", render: (r) => <CompletionCell value={r.completion} /> },
    {
      key: "quiz",
      header: "Quiz Score",
      width: "96px",
      align: "center",
      render: (r) => <span className="body-sm-regular text-primary-500 tabular-nums">{r.quizScore === null ? "—" : `${r.quizScore}%`}</span>,
    },
    { key: "completed", header: "Completed", width: "120px", render: (r) => <span className="whitespace-nowrap body-sm-regular text-primary-500">{formatShortDate(r.completedAt)}</span> },
    {
      key: "action",
      header: "Action",
      width: "104px",
      align: "center",
      render: (r) => (
        <CardActionButton icon={<Award className="h-3.5 w-3.5" />} onClick={() => onIssue(r)} disabled={blockedCourseIds.has(r.courseId)}>
          Issue
        </CardActionButton>
      ),
    },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-200"
        thClassName="px-2.5 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-2.5 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default EligibleTable;
