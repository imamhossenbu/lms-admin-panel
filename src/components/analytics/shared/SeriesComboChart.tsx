"use client";

import React, { useId } from "react";
import { Area, Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { formatCompact, type TimeBucket } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export interface SeriesDef<T> {
  key: keyof T & string;
  label: string;
  /** CHART.* colour. */
  color: string;
  kind: "bar" | "line" | "area";
  /** Bars sharing a stackId are stacked. */
  stackId?: string;
  /** Plot against the right axis (e.g. a % line over count bars). */
  axis?: "left" | "right";
  /** Tooltip value format (defaults to the axis format). */
  format?: (value: number) => string;
}

interface SeriesComboChartProps<T extends TimeBucket> {
  data: T[];
  series: SeriesDef<T>[];
  leftFormat?: (value: number) => string;
  rightFormat?: (value: number) => string;
  /** Fixed right-axis domain, e.g. [0, 100] for rates. */
  rightDomain?: [number, number];
  emptyTitle: string;
  emptyMessage: string;
  /** Tailwind height class of the plot area. */
  heightClassName?: string;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/**
 * Time-series chart for every Analytics trend: any mix of bars (optionally stacked), lines and areas over
 * shared buckets, optional right axis, shared tooltip and an empty state when every value is zero.
 */
export function SeriesComboChart<T extends TimeBucket>({
  data,
  series,
  leftFormat = formatCompact,
  rightFormat = formatCompact,
  rightDomain,
  emptyTitle,
  emptyMessage,
  heightClassName = "h-64",
}: SeriesComboChartProps<T>) {
  const gradientPrefix = useId().replace(/:/g, "");
  const hasData = data.some((p) => series.some((s) => num(p[s.key]) !== 0));
  const hasRight = series.some((s) => s.axis === "right");
  const barCount = series.filter((s) => s.kind === "bar").length;

  if (!hasData) return <ChartEmpty title={emptyTitle} message={emptyMessage} />;
  // Recharts types dataKey against the row type; rows are plain records here.
  const rows = data as unknown as Record<string, unknown>[];

  return (
    <div className={cn("w-full", heightClassName)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 10, right: hasRight ? 0 : 6, left: -6, bottom: 0 }} barGap={2}>
          <defs>
            {series
              .filter((s) => s.kind === "area")
              .map((s) => (
                <linearGradient key={s.key} id={`${gradientPrefix}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={14} />
          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={AXIS_TICK} width={50} allowDecimals={false} tickFormatter={leftFormat} />
          {hasRight && (
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              width={44}
              domain={rightDomain ?? [0, "auto"]}
              tickFormatter={rightFormat}
            />
          )}
          <Tooltip
            cursor={{ fill: CHART.grid, fillOpacity: 0.35, stroke: CHART.grid }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as T;
              return (
                <ChartTooltip title={point.fullLabel}>
                  <div className="space-y-0.5">
                    {series.map((s) => {
                      const fmt = s.format ?? (s.axis === "right" ? rightFormat : leftFormat);
                      return (
                        <p key={s.key} className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-primary-400">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            {s.label}
                          </span>
                          <span className="font-semibold! text-primary-500">{fmt(num(point[s.key]))}</span>
                        </p>
                      );
                    })}
                  </div>
                </ChartTooltip>
              );
            }}
          />
          {series.map((s) => {
            const axis = s.axis === "right" ? "right" : "left";
            const dataKey: string = s.key;
            if (s.kind === "bar") {
              return (
                <Bar
                  key={s.key}
                  yAxisId={axis}
                  dataKey={dataKey}
                  fill={s.color}
                  stackId={s.stackId}
                  maxBarSize={barCount > 1 && !s.stackId ? 14 : 28}
                  radius={s.stackId ? 0 : [4, 4, 0, 0]}
                />
              );
            }
            if (s.kind === "area") {
              return (
                <Area
                  key={s.key}
                  yAxisId={axis}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={s.color}
                  strokeWidth={2.4}
                  fill={`url(#${gradientPrefix}-${s.key})`}
                  activeDot={{ r: 5, fill: s.color, stroke: "white", strokeWidth: 2 }}
                  dot={data.length <= 14 ? { r: 3, fill: s.color, stroke: "white", strokeWidth: 1.5 } : false}
                />
              );
            }
            return (
              <Line
                key={s.key}
                yAxisId={axis}
                type="monotone"
                dataKey={dataKey}
                stroke={s.color}
                strokeWidth={2.4}
                dot={data.length <= 14 ? { r: 3, fill: s.color, stroke: "white", strokeWidth: 1.5 } : false}
                activeDot={{ r: 5, fill: s.color, stroke: "white", strokeWidth: 2 }}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SeriesComboChart;
