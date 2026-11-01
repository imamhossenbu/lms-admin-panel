"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { formatPercent, type BreakdownRow } from "@/lib/analytics";

interface BreakdownBarChartProps {
  rows: BreakdownRow[];
  format: (value: number) => string;
  /** Second tooltip line, e.g. (row) => "12 orders". */
  detail?: (row: BreakdownRow) => string;
  /** Bar colour per row index (defaults to brand orange). */
  colors?: string[];
  emptyTitle: string;
  emptyMessage: string;
  /** Max label characters on the category axis. */
  labelChars?: number;
}

const truncate = (text: string, n: number) => (text.length > n ? `${text.slice(0, n - 1)}…` : text);

/** Horizontal ranked bars for "by category / by course" breakdowns. Height grows with the row count. */
export function BreakdownBarChart({ rows, format, detail, colors, emptyTitle, emptyMessage, labelChars = 18 }: BreakdownBarChartProps) {
  if (!rows.length || rows.every((r) => r.value === 0)) return <ChartEmpty title={emptyTitle} message={emptyMessage} />;
  const height = Math.max(160, rows.length * 38 + 24);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }} barCategoryGap={8}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHART.grid} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={AXIS_TICK} tickFormatter={format} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            width={labelChars * 6.5 + 8}
            tick={AXIS_TICK}
            tickFormatter={(v: string) => truncate(String(v), labelChars)}
          />
          <Tooltip
            cursor={{ fill: CHART.grid, fillOpacity: 0.35 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as BreakdownRow;
              return (
                <ChartTooltip title={row.label}>
                  <p className="font-semibold!">{format(row.value)}</p>
                  <p className="body-2xsm-regular text-primary-300 mt-0.5">
                    {formatPercent(row.share)} of total{detail ? ` · ${detail(row)}` : ""}
                  </p>
                </ChartTooltip>
              );
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {rows.map((row, i) => (
              <Cell key={row.key} fill={colors?.[i % colors.length] ?? CHART.orange} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BreakdownBarChart;
