"use client";

import React from "react";
import { Award, BadgeCheck, CheckCircle2, GraduationCap, Percent, ShoppingCart, UserCheck, Wallet } from "lucide-react";
import { CHART } from "@/components/ui/charts/chartTheme";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/lib/analytics";
import { KpiGrid } from "../shared/KpiGrid";
import type { KpiTileData } from "../shared/KpiTile";
import { ChartCard } from "../shared/ChartCard";
import { ChartLegend } from "../shared/ChartLegend";
import { SeriesComboChart } from "../shared/SeriesComboChart";
import { HighlightsCard } from "./HighlightsCard";
import type { OverviewReport } from "../report/analyticsReport";

interface OverviewTabProps {
  data: OverviewReport;
  currency: string;
  /** "vs previous 30 days" | "all time" */
  caption: string;
}

export function OverviewTab({ data, currency, caption }: OverviewTabProps) {
  const { kpis } = data;
  const tiles: KpiTileData[] = [
    { id: "net", label: "Net revenue", value: formatCurrency(kpis.netRevenue.value, currency, { decimals: 0 }), kpi: kpis.netRevenue, icon: Wallet, tone: "orange", caption },
    { id: "orders", label: "Orders", value: formatNumber(kpis.orders.value), kpi: kpis.orders, icon: ShoppingCart, tone: "blue", caption },
    { id: "conversion", label: "Conversion", value: formatPercent(kpis.conversion.value), kpi: kpis.conversion, icon: Percent, tone: "green", caption },
    { id: "enrollments", label: "New enrollments", value: formatNumber(kpis.newEnrollments.value), kpi: kpis.newEnrollments, icon: GraduationCap, tone: "purple", caption },
    { id: "active", label: "Active learners", value: formatNumber(kpis.activeLearners.value), kpi: kpis.activeLearners, icon: UserCheck, tone: "blue", caption },
    { id: "completion", label: "Avg completion", value: formatPercent(kpis.avgCompletion.value), kpi: kpis.avgCompletion, icon: CheckCircle2, tone: "green", caption },
    { id: "certificates", label: "Certificates issued", value: formatNumber(kpis.certificates.value), kpi: kpis.certificates, icon: Award, tone: "orange", caption },
    { id: "pass", label: "Quiz pass rate", value: formatPercent(kpis.quizPassRate.value), kpi: kpis.quizPassRate, icon: BadgeCheck, tone: "purple", caption },
  ];
  const money = (v: number) => formatCurrency(v, currency, { decimals: 0 });

  return (
    <div className="space-y-3">
      <KpiGrid tiles={tiles} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <ChartCard
          className="xl:col-span-2"
          title="Revenue vs enrollments"
          subtitle="Net revenue (line) against new enrollments (bars)"
          action={
            <ChartLegend
              items={[
                { label: "Enrollments", color: CHART.blue },
                { label: "Net revenue", color: CHART.orange, line: true },
              ]}
            />
          }
          index={1}
        >
          <SeriesComboChart
            data={data.combo}
            heightClassName="h-72"
            series={[
              { key: "enrollments", label: "Enrollments", color: CHART.blue, kind: "bar", format: formatNumber },
              { key: "net", label: "Net revenue", color: CHART.orange, kind: "line", axis: "right", format: money },
            ]}
            leftFormat={formatNumber}
            rightFormat={(v) => formatCompactCurrency(v, currency)}
            emptyTitle="No revenue or enrollments in this period"
            emptyMessage="Pick a wider date range to see the trend."
          />
        </ChartCard>
        <HighlightsCard highlights={data.highlights} currency={currency} index={2} />
      </div>
    </div>
  );
}

export default OverviewTab;
