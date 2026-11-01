"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatCurrency, formatNumber, formatPercent, type StudentPerformanceRow, type StudentRankBy } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ShareBar } from "../shared/ShareBar";

const RANKS: { value: StudentRankBy; label: string }[] = [
  { value: "completion", label: "Completion" },
  { value: "score", label: "Score" },
  { value: "spent", label: "Spent" },
];

interface TopStudentsTableProps {
  rows: StudentPerformanceRow[];
  rankBy: StudentRankBy;
  onRankChange: (by: StudentRankBy) => void;
  currency: string;
  className?: string;
  index?: number;
}

/** Student leaderboard from the students store (+ paid spend in the range). Row → student profile. */
export function TopStudentsTable({ rows, rankBy, onRankChange, currency, className, index }: TopStudentsTableProps) {
  const router = useRouter();
  const columns: ColumnDef<StudentPerformanceRow>[] = [
    {
      key: "student",
      header: "Student",
      width: "31%",
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={row.avatarUrl} name={row.name} size={28} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate" title={row.name}>
              {row.name}
            </p>
            <p className="body-2xsm-regular text-primary-300 truncate" title={row.email}>
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    { key: "enrolled", header: "Enrolled", width: "11%", align: "right", render: (row) => formatNumber(row.enrolled) },
    { key: "completed", header: "Completed", width: "12%", align: "right", render: (row) => formatNumber(row.completed) },
    { key: "score", header: "Avg score", width: "12%", align: "right", render: (row) => formatPercent(row.avgScore) },
    {
      key: "completion",
      header: "Completion",
      width: "20%",
      render: (row) => <ShareBar value={row.completionRate} label={formatPercent(row.completionRate)} barClassName="bg-green" />,
    },
    {
      key: "spent",
      header: "Spent",
      width: "14%",
      align: "right",
      render: (row) => <span className="body-sm-medium font-semibold! text-primary-500">{formatCurrency(row.spent, currency, { decimals: 0 })}</span>,
    },
  ];

  return (
    <ChartCard
      className={className}
      index={index}
      title="Top students"
      subtitle="Ranked learners (spend counts paid orders in this period)"
      action={<SegmentedControl options={RANKS} value={rankBy} onChange={onRankChange} />}
    >
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(row) => row.studentId}
        onRowClick={(row) => router.push(`/students/${row.studentId}`)}
        tableClassName="table-fixed"
        emptyMessage="No students joined by the end of this period."
      />
    </ChartCard>
  );
}

export default TopStudentsTable;
