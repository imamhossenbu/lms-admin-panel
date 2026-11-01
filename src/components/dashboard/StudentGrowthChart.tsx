"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { formatCompact, formatNumber, type StudentGrowthPoint } from "@/lib/analytics";

export function StudentGrowthChart({ data }: { data: StudentGrowthPoint[] }) {
  const hasData = data.some((p) => p.newStudents > 0 || p.activeStudents > 0);

  return (
    <div className="bg-white rounded-xl border border-dash p-5 shadow-xs flex flex-col justify-between h-82.5">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="text-left">
          <h3 className="heading-h5 font-bold text-primary-500">Student Growth</h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">New students vs active students</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
            <span className="body-xsm-medium text-primary-400">New Students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange/30" />
            <span className="body-xsm-medium text-primary-400">Active Students</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full flex-1 min-h-65">
        {!hasData ? (
          <ChartEmpty title="No student activity in this period" message="New sign-ups and learning activity will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 15, right: 10, left: -10, bottom: 20 }} barCategoryGap="24%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />

              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={12} />

              <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} tickFormatter={(v: number) => formatCompact(v)} />

              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as StudentGrowthPoint;
                  return (
                    <ChartTooltip title={item.fullLabel}>
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-orange" />
                          <span>New Students:</span>
                          <span className="font-bold ml-auto pl-3">{formatNumber(item.newStudents)}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-orange/30" />
                          <span>Active Students:</span>
                          <span className="font-bold ml-auto pl-3">{formatNumber(item.activeStudents)}</span>
                        </p>
                      </div>
                    </ChartTooltip>
                  );
                }}
              />

              <Bar dataKey="newStudents" stackId="growth" fill={CHART.orange} maxBarSize={16} />
              <Bar dataKey="activeStudents" stackId="growth" fill={CHART.orange} fillOpacity={0.3} maxBarSize={16} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
