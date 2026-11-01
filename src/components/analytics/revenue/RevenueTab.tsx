"use client";

import React from "react";
import { Receipt, RotateCcw, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import { formatCompactCurrency, formatCurrency, formatNumber, type Granularity } from "@/lib/analytics";
import { KpiGrid } from "../shared/KpiGrid";
import type { KpiTileData } from "../shared/KpiTile";
import { ChartCard } from "../shared/ChartCard";
import { DonutBreakdown } from "../shared/DonutBreakdown";
import { BreakdownBarChart } from "../shared/BreakdownBarChart";
import { SERIES_COLORS } from "../shared/palette";
import { RevenueTrendCard } from "./RevenueTrendCard";
import { OrderStatusCard } from "./OrderStatusCard";
import { RevenueByCourseTable } from "./RevenueByCourseTable";
import type { RevenueReport } from "../report/analyticsReport";

interface RevenueTabProps {
  data: RevenueReport;
  currency: string;
  caption: string;
  onGranularityChange: (g: Granularity) => void;
}

export function RevenueTab({ data, currency, caption, onGranularityChange }: RevenueTabProps) {
  const { summary } = data;
  const money = (v: number) => formatCurrency(v, currency, { decimals: 0 });
  const tiles: KpiTileData[] = [
    { id: "gross", label: "Gross revenue", value: money(summary.gross.value), kpi: summary.gross, icon: TrendingUp, tone: "blue", caption },
    { id: "net", label: "Net revenue", value: money(summary.net.value), kpi: summary.net, icon: Wallet, tone: "orange", caption },
    { id: "refunds", label: "Refunds", value: money(summary.refunds.value), kpi: summary.refunds, icon: RotateCcw, tone: "purple", caption, invert: true },
    { id: "aov", label: "Avg order value", value: formatCurrency(summary.avgOrderValue.value, currency), kpi: summary.avgOrderValue, icon: Receipt, tone: "green", caption },
    { id: "paid", label: "Paid orders", value: formatNumber(summary.paidOrders.value), kpi: summary.paidOrders, icon: ShoppingBag, tone: "blue", caption },
  ];

  return (
    <div className="space-y-3">
      <KpiGrid tiles={tiles} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <RevenueTrendCard
          className="xl:col-span-2"
          index={1}
          data={data.series}
          currency={currency}
          granularity={data.granularity}
          options={data.granularityOptions}
          onGranularityChange={onGranularityChange}
        />
        <ChartCard title="Payment methods" subtitle="Share of net revenue" index={2}>
          <DonutBreakdown
            slices={data.byMethod.map((r, i) => ({
              key: r.key,
              label: r.label,
              value: r.value,
              share: r.share,
              color: SERIES_COLORS[i % SERIES_COLORS.length],
              detail: `${formatNumber(r.count)} ${r.count === 1 ? "order" : "orders"}`,
            }))}
            centerValue={formatCompactCurrency(summary.net.value, currency)}
            centerLabel="Net revenue"
            format={money}
            emptyTitle="No paid orders"
            emptyMessage="Payment methods appear once orders are paid."
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Revenue by category" subtitle="Net revenue per course category" index={3}>
          <BreakdownBarChart
            rows={data.byCategory}
            format={(v) => formatCompactCurrency(v, currency)}
            detail={(r) => `${formatNumber(r.count)} course ${r.count === 1 ? "sale" : "sales"}`}
            colors={SERIES_COLORS}
            emptyTitle="No category revenue"
            emptyMessage="Pick a wider date range to compare categories."
            labelChars={14}
          />
        </ChartCard>
        <OrderStatusCard byStatus={data.orders.byStatus} placed={data.orders.placed} conversion={data.orders.conversion} index={4} />
      </div>

      <RevenueByCourseTable rows={data.byCourse} currency={currency} index={5} />
    </div>
  );
}

export default RevenueTab;
