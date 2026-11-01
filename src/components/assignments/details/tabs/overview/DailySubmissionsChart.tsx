"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface DailySubmissionsChartProps {
  data: { label: string; count: number }[];
}

const AXIS_TICK = { fill: "var(--color-primary-300)", fontSize: 12 };

/** Blue bar per day (submissions count). */
export function DailySubmissionsChart({ data }: DailySubmissionsChartProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-gray-bg)" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={8} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
          <Tooltip
            cursor={{ fill: "var(--color-blue-14)" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-lg border border-dash bg-white px-3 py-2 shadow-md">
                  <p className="body-xsm-regular text-primary-300">{label}</p>
                  <p className="body-sm-medium text-primary-500">
                    {payload[0].value} submission{payload[0].value === 1 ? "" : "s"}
                  </p>
                </div>
              ) : null
            }
          />
          <Bar dataKey="count" fill="var(--color-blue)" radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailySubmissionsChart;
