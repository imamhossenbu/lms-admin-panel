"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/analytics";
import type { RevenueCourseRow } from "../report/analyticsReport";
import { ChartCard } from "../shared/ChartCard";
import { ChangeBadge } from "../shared/ChangeBadge";
import { ShareBar } from "../shared/ShareBar";

/** Course revenue ranking: orders, revenue, share of revenue and change vs the previous period. */
export function RevenueByCourseTable({ rows, currency, index }: { rows: RevenueCourseRow[]; currency: string; index?: number }) {
  const columns: ColumnDef<RevenueCourseRow>[] = [
    {
      key: "course",
      header: "Course",
      width: "36%",
      render: (row) => (
        <span className="block truncate body-sm-medium text-primary-500" title={row.label}>
          {row.label}
        </span>
      ),
    },
    { key: "orders", header: "Orders", width: "11%", align: "right", render: (row) => formatNumber(row.count) },
    {
      key: "revenue",
      header: "Revenue",
      width: "16%",
      align: "right",
      render: (row) => <span className="body-sm-medium font-semibold! text-primary-500">{formatCurrency(row.value, currency)}</span>,
    },
    { key: "share", header: "Share", width: "22%", render: (row) => <ShareBar value={row.share} label={formatPercent(row.share)} /> },
    { key: "change", header: "Change", width: "15%", align: "center", render: (row) => <ChangeBadge changePct={row.changePct} /> },
  ];

  return (
    <ChartCard title="Revenue by course" subtitle="Net revenue per course (bundles split by list price)" index={index}>
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(row) => row.key}
        tableClassName="table-fixed"
        emptyMessage="No paid orders in this period."
      />
    </ChartCard>
  );
}

export default RevenueByCourseTable;
