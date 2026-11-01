"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatNumber, formatPercent, type AssignmentPerformanceRow } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ShareBar } from "../shared/ShareBar";

/** Per-assignment submissions, on-time rate and average grade in the range. */
export function AssignmentPerformanceTable({ rows, index }: { rows: AssignmentPerformanceRow[]; index?: number }) {
  const columns: ColumnDef<AssignmentPerformanceRow>[] = [
    {
      key: "assignment",
      header: "Assignment",
      width: "40%",
      render: (row) => (
        <span className="block truncate body-sm-medium text-primary-500" title={row.title}>
          {row.title}
        </span>
      ),
    },
    { key: "submissions", header: "Submitted", width: "16%", align: "right", render: (row) => formatNumber(row.submissions) },
    {
      key: "onTime",
      header: "On time",
      width: "22%",
      render: (row) => <ShareBar value={row.onTimeRate} label={formatPercent(row.onTimeRate, 0)} barClassName="bg-green" />,
    },
    {
      key: "grade",
      header: "Avg grade",
      width: "22%",
      align: "center",
      render: (row) =>
        row.avgScore === null ? (
          <ToneBadge tone="gray" size="sm" variant="pill">
            Not graded
          </ToneBadge>
        ) : (
          <ToneBadge tone="blue" size="sm" variant="pill">
            {formatPercent(row.avgScore, 0)}
          </ToneBadge>
        ),
    },
  ];
  return (
    <ChartCard title="Assignment performance" subtitle="Most submitted assignments in this period" index={index}>
      <DataTable columns={columns} data={rows.slice(0, 8)} rowKey={(row) => row.assignmentId} tableClassName="table-fixed" emptyMessage="No submissions in this period." />
    </ChartCard>
  );
}

export default AssignmentPerformanceTable;
