"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CHART } from "@/components/ui/charts/chartTheme";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { formatNumber, type CompletionBreakdown, type CompletionSegment } from "@/lib/analytics";

const SEGMENT_COLOR: Record<CompletionSegment["key"], string> = {
  completed: CHART.green,
  inProgress: CHART.orange,
  stalled: CHART.tick,
};

interface CourseCompletionChartProps {
  /** completionBreakdown(): course seats of students joined by the end of the range. */
  data: CompletionBreakdown;
}

export function CourseCompletionChart({ data }: CourseCompletionChartProps) {
  const chartData = data.segments.filter((c) => c.count > 0).map((c) => ({ name: c.label, value: c.count, color: SEGMENT_COLOR[c.key] }));

  return (
    <div className="bg-white rounded-xl border border-dash p-5 shadow-xs flex flex-col justify-between h-85">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="heading-h5 text-primary-500">Course Completion</h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">Course seats completed by students</p>
        </div>

        <Link
          href="/students"
          className="body-sm-medium text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Main Content: Donut + Legend Split */}
      {data.enrolled === 0 ? (
        <ChartEmpty title="No enrollments yet" message="Completion appears once students enroll in courses." />
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Donut with Center Percentage */}
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity hover:opacity-85" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Stat Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="heading-h2-bold text-primary-500">{data.completionRate}%</span>
              <span className="body-2xsm-regular text-primary-300 mt-1">Completion Rate</span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="flex-1 w-full max-w-60 space-y-4">
            {data.segments.map((cat) => (
              <div key={cat.label} className="flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SEGMENT_COLOR[cat.key] }} />
                  <span className="body-sm-medium text-primary-400">{cat.label}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="body-sm-medium text-primary-500">{formatNumber(cat.count)}</span>
                  <span className="body-sm-regular text-primary-300 w-9 text-right">{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
