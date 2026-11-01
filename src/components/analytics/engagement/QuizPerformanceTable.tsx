"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatNumber, formatPercent, type QuizPerformanceRow } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ShareBar } from "../shared/ShareBar";

/** Per-quiz attempts, average score and pass rate in the range. */
export function QuizPerformanceTable({ rows, index }: { rows: QuizPerformanceRow[]; index?: number }) {
  const columns: ColumnDef<QuizPerformanceRow>[] = [
    {
      key: "quiz",
      header: "Quiz",
      width: "40%",
      render: (row) => (
        <span className="block truncate body-sm-medium text-primary-500" title={row.title}>
          {row.title}
        </span>
      ),
    },
    { key: "attempts", header: "Attempts", width: "16%", align: "right", render: (row) => formatNumber(row.attempts) },
    {
      key: "score",
      header: "Avg score",
      width: "22%",
      render: (row) => (row.finished ? <ShareBar value={row.avgScore} label={formatPercent(row.avgScore, 0)} barClassName="bg-blue" /> : <span className="text-primary-300">—</span>),
    },
    {
      key: "pass",
      header: "Pass rate",
      width: "22%",
      align: "center",
      render: (row) =>
        row.finished ? (
          <ToneBadge tone={row.passRate >= 70 ? "green" : row.passRate >= 40 ? "yellow" : "red"} size="sm" variant="pill">
            {formatPercent(row.passRate, 0)}
          </ToneBadge>
        ) : (
          <span className="text-primary-300">—</span>
        ),
    },
  ];
  return (
    <ChartCard title="Quiz performance" subtitle="Most attempted quizzes in this period" index={index}>
      <DataTable columns={columns} data={rows.slice(0, 8)} rowKey={(row) => row.quizId} tableClassName="table-fixed" emptyMessage="No quiz attempts in this period." />
    </ChartCard>
  );
}

export default QuizPerformanceTable;
