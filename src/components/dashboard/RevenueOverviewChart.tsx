"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { formatCompactCurrency, formatCurrency, formatNumber, type RevenuePoint } from "@/lib/analytics";

export type RevenueMetric = "Revenue" | "Orders" | "Refunds";
export const REVENUE_METRICS: RevenueMetric[] = ["Revenue", "Orders", "Refunds"];

const FIELD: Record<RevenueMetric, keyof Pick<RevenuePoint, "net" | "orders" | "refunds">> = {
  Revenue: "net",
  Orders: "orders",
  Refunds: "refunds",
};

const SUBTITLE: Record<RevenueMetric, string> = {
  Revenue: "Paid revenue over the selected period",
  Orders: "Orders placed over the selected period",
  Refunds: "Refunded amounts by payment date",
};

interface RevenueOverviewChartProps {
  data: RevenuePoint[];
  currency: string;
  metric: RevenueMetric;
  onMetricChange: (metric: RevenueMetric) => void;
}

export function RevenueOverviewChart({ data, currency, metric, onMetricChange }: RevenueOverviewChartProps) {
  const field = FIELD[metric];
  const isMoney = metric !== "Orders";
  const total = data.reduce((s, p) => s + p[field], 0);
  const format = (v: number) => (isMoney ? formatCurrency(v, currency) : formatNumber(v));

  return (
    <div className="bg-white rounded-xl border border-dash p-5 shadow-xs flex flex-col justify-between h-82.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-left min-w-0">
          <h3 className="heading-h5 font-bold text-primary-500">Revenue Overview</h3>
          <p className="body-sm-regular text-primary-300 mt-0.5 truncate">
            {SUBTITLE[metric]} · <span className="font-semibold text-primary-500">{format(total)}</span>
          </p>
        </div>

        <DropdownSelect
          options={REVENUE_METRICS}
          value={metric}
          onChange={(v) => onMetricChange(v as RevenueMetric)}
          align="right"
          className="w-32 shrink-0"
          buttonClassName="h-9 body-sm-medium"
        />
      </div>

      {/* Chart Area */}
      <div className="w-full flex-1 min-h-65">
        {total === 0 ? (
          <ChartEmpty title={`No ${metric.toLowerCase()} in this period`} message="Pick a wider date range to see the trend." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 15, right: 10, left: -4, bottom: 20 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.orange} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={CHART.orange} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />

              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={16} />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                width={52}
                allowDecimals={!isMoney ? false : undefined}
                tickFormatter={(v: number) => (isMoney ? formatCompactCurrency(v, currency) : formatNumber(v))}
              />

              <Tooltip
                cursor={{ stroke: CHART.grid }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as RevenuePoint;
                  return (
                    <ChartTooltip title={item.fullLabel}>
                      <p className="flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                        {format(item[field])}
                      </p>
                      {metric === "Revenue" && (
                        <p className="body-2xsm-regular text-primary-300 mt-0.5">
                          {formatNumber(item.paidOrders)} paid {item.paidOrders === 1 ? "order" : "orders"}
                        </p>
                      )}
                    </ChartTooltip>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey={field}
                stroke={CHART.orange}
                strokeWidth={2.8}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, fill: CHART.orange, stroke: "white", strokeWidth: 2.5 }}
                dot={data.length <= 14 ? { r: 3.5, fill: CHART.orange, stroke: "white", strokeWidth: 1.5 } : false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
