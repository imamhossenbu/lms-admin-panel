"use client";

import React from "react";
import { Star } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatCurrency, formatNumber, type InstructorRow } from "@/lib/analytics";
import type { InstructorRankBy } from "../report/analyticsReport";
import { ChartCard } from "../shared/ChartCard";

const RANKS: { value: InstructorRankBy; label: string }[] = [
  { value: "revenue", label: "Revenue" },
  { value: "enrollments", label: "Enrollments" },
];

interface InstructorLeaderboardProps {
  rows: InstructorRow[];
  rankBy: InstructorRankBy;
  onRankChange: (by: InstructorRankBy) => void;
  currency: string;
  index?: number;
}

/** Instructors ranked by revenue or enrollments earned in the range. */
export function InstructorLeaderboard({ rows, rankBy, onRankChange, currency, index }: InstructorLeaderboardProps) {
  type Row = InstructorRow & { rank: number };
  const columns: ColumnDef<Row>[] = [
    {
      key: "rank",
      header: "#",
      width: "10%",
      align: "center",
      render: (row) => (
        <ToneBadge tone={row.rank === 1 ? "orange" : "gray"} size="sm" variant="pill">
          {row.rank}
        </ToneBadge>
      ),
    },
    {
      key: "instructor",
      header: "Instructor",
      width: "38%",
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={row.avatarUrl} name={row.name} size={28} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate" title={row.name}>
              {row.name}
            </p>
            <p className="body-2xsm-regular text-primary-300 truncate">
              {row.courses} {row.courses === 1 ? "course" : "courses"}
              {row.rating !== null && (
                <span className="inline-flex items-center gap-0.5 ml-1.5">
                  <Star className="h-3 w-3 fill-current text-yellow" />
                  {row.rating.toFixed(1)}
                </span>
              )}
            </p>
          </div>
        </div>
      ),
    },
    { key: "enrollments", header: "Enrollments", width: "24%", align: "right", render: (row) => formatNumber(row.enrollments) },
    {
      key: "revenue",
      header: "Revenue",
      width: "28%",
      align: "right",
      render: (row) => <span className="body-sm-medium font-semibold! text-primary-500">{formatCurrency(row.revenue, currency, { decimals: 0 })}</span>,
    },
  ];

  return (
    <ChartCard
      title="Instructor leaderboard"
      subtitle={`Ranked by ${rankBy} in this period`}
      index={index}
      action={<SegmentedControl options={RANKS} value={rankBy} onChange={onRankChange} />}
    >
      <DataTable
        columns={columns}
        data={rows.map((r, i) => ({ ...r, rank: i + 1 }))}
        rowKey={(row) => row.id}
        tableClassName="table-fixed"
        emptyMessage="No instructor sales in this period."
      />
    </ChartCard>
  );
}

export default InstructorLeaderboard;
