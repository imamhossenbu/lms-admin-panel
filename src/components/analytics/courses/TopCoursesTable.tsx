"use client";

import React from "react";
import { Star } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatCurrency, formatNumber, formatPercent, type CourseRow } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ShareBar } from "../shared/ShareBar";
import { CardLinkButton } from "../shared/CardLinkButton";

const Dash = () => <span className="text-primary-300">—</span>;

/** Every course with enrollments in the range: enrollments, revenue, completion and rating ("—" when unknown). */
export function TopCoursesTable({ rows, currency, index }: { rows: CourseRow[]; currency: string; index?: number }) {
  const columns: ColumnDef<CourseRow>[] = [
    {
      key: "course",
      header: "Course",
      width: "32%",
      render: (row) => (
        <div className="min-w-0">
          <p className="body-sm-medium text-primary-500 truncate" title={row.title}>
            {row.title}
          </p>
          <p className="body-2xsm-regular text-primary-300 truncate" title={row.instructor}>
            {row.instructor}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "15%",
      render: (row) => (
        <ToneBadge tone="gray" size="sm" className="max-w-full">
          <span className="truncate" title={row.category}>
            {row.category}
          </span>
        </ToneBadge>
      ),
    },
    { key: "enrollments", header: "Enrollments", width: "12%", align: "right", render: (row) => formatNumber(row.enrollments) },
    {
      key: "revenue",
      header: "Revenue",
      width: "13%",
      align: "right",
      render: (row) => <span className="body-sm-medium font-semibold! text-primary-500">{formatCurrency(row.revenue, currency, { decimals: 0 })}</span>,
    },
    {
      key: "completion",
      header: "Completion",
      width: "18%",
      render: (row) =>
        row.completionPct === null ? <Dash /> : <ShareBar value={row.completionPct} label={formatPercent(row.completionPct, 0)} barClassName="bg-green" />,
    },
    {
      key: "rating",
      header: "Rating",
      width: "10%",
      align: "center",
      render: (row) =>
        row.rating === null ? (
          <Dash />
        ) : (
          <span className="inline-flex items-center gap-1 body-sm-medium text-primary-500">
            <Star className="h-3.5 w-3.5 fill-current text-yellow" />
            {row.rating.toFixed(1)}
          </span>
        ),
    },
  ];

  return (
    <ChartCard
      title="Top courses"
      subtitle="Courses ranked by new enrollments in this period"
      index={index}
      action={<CardLinkButton href="/courses">View courses</CardLinkButton>}
    >
      <DataTable columns={columns} data={rows} rowKey={(row) => row.courseId} tableClassName="table-fixed" emptyMessage="No enrollments in this period." />
    </ChartCard>
  );
}

export default TopCoursesTable;
