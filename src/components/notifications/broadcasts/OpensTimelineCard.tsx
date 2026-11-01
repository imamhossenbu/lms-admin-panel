"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";

export interface OpensTimelineCardProps {
  data: { label: string; opens: number }[];
}

/** Opens per hour during the first 24 hours after sending. */
export function OpensTimelineCard({ data }: OpensTimelineCardProps) {
  const total = data.reduce((s, d) => s + d.opens, 0);
  return (
    <IconSectionCard icon={<TrendingUp className="h-5 w-5" />} tone="orange" title="Opens over the first 24 hours" description={`${total.toLocaleString()} opens in the first day`}>
      {total === 0 ? (
        <ChartEmpty title="No opens yet" message="Opens will appear here as recipients read the message." />
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="broadcast-opens-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.orange} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={CHART.orange} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} interval="preserveStartEnd" minTickGap={16} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as OpensTimelineCardProps["data"][number];
                  return <ChartTooltip title={`Hour ${row.label.replace("h", "")} after sending`}>{`${row.opens} ${row.opens === 1 ? "open" : "opens"}`}</ChartTooltip>;
                }}
              />
              <Area
                type="monotone"
                dataKey="opens"
                stroke={CHART.orange}
                strokeWidth={2}
                fill="url(#broadcast-opens-fill)"
                dot={false}
                activeDot={{ r: 5, fill: CHART.orange, stroke: "white", strokeWidth: 2 }}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default OpensTimelineCard;
