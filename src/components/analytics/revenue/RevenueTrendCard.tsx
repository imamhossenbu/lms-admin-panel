"use client";

import React from "react";
import { CHART } from "@/components/ui/charts/chartTheme";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatCompactCurrency, formatCurrency, type Granularity, type RevenuePoint } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ChartLegend } from "../shared/ChartLegend";
import { SeriesComboChart } from "../shared/SeriesComboChart";

const LABEL: Record<Granularity, string> = { day: "Day", week: "Week", month: "Month" };

interface RevenueTrendCardProps {
  data: RevenuePoint[];
  currency: string;
  granularity: Granularity;
  options: Granularity[];
  onGranularityChange: (g: Granularity) => void;
  className?: string;
  index?: number;
}

/** Net revenue (area) and refunds (line) over time with a day / week / month toggle. */
export function RevenueTrendCard({ data, currency, granularity, options, onGranularityChange, className, index }: RevenueTrendCardProps) {
  const money = (v: number) => formatCurrency(v, currency);
  return (
    <ChartCard
      className={className}
      index={index}
      title="Revenue trend"
      subtitle={`Net revenue and refunds per ${granularity}`}
      action={
        options.length > 1 ? (
          <SegmentedControl options={options.map((g) => ({ value: g, label: LABEL[g] }))} value={granularity} onChange={onGranularityChange} />
        ) : undefined
      }
      toolbar={
        <ChartLegend
          items={[
            { label: "Net revenue", color: CHART.orange },
            { label: "Gross revenue", color: CHART.blue, line: true },
            { label: "Refunds", color: CHART.red, line: true },
          ]}
        />
      }
    >
      <SeriesComboChart
        data={data}
        heightClassName="h-72"
        series={[
          { key: "net", label: "Net revenue", color: CHART.orange, kind: "area", format: money },
          { key: "gross", label: "Gross revenue", color: CHART.blue, kind: "line", format: money },
          { key: "refunds", label: "Refunds", color: CHART.red, kind: "line", format: money },
        ]}
        leftFormat={(v) => formatCompactCurrency(v, currency)}
        emptyTitle="No revenue in this period"
        emptyMessage="Paid orders will appear here; pick a wider date range."
      />
    </ChartCard>
  );
}

export default RevenueTrendCard;
