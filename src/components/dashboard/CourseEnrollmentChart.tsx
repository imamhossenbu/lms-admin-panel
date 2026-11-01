"use client";

import React from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { formatNumber, type BreakdownRow } from "@/lib/analytics";

interface CourseEnrollmentChartProps {
  /** Top courses by new enrollments in the range (enrollmentsByCourse). */
  data: BreakdownRow[];
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-5 shadow-xs flex flex-col justify-between h-85">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="heading-h5 font-bold text-primary-500">
            Course Enrollment
          </h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            Top courses by new enrollments
          </p>
        </div>

        <Link
          href="/courses"
          className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Chart Area */}
      <div className="w-full flex-1 min-h-65">
        {data.length === 0 ? (
          <ChartEmpty title="No enrollments in this period" message="Paid orders create enrollments; pick a wider date range." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 25 }} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={({ x, y, payload }) => {
                  const words = String(payload.value).split(" ");
                  const line1 = words.length > 2 ? words.slice(0, 2).join(" ") : String(payload.value);
                  const line2 = words.length > 2 ? words.slice(2).join(" ") : "";
                  return (
                    <g transform={`translate(${x},${Number(y) + 8})`}>
                      <text x={0} y={0} textAnchor="middle" fill={AXIS_TICK.fill} fontSize={AXIS_TICK.fontSize} fontWeight={500}>
                        <tspan x={0} dy="0.6em">
                          {line1}
                        </tspan>
                        {line2 && (
                          <tspan x={0} dy="1.2em">
                            {line2}
                          </tspan>
                        )}
                      </text>
                    </g>
                  );
                }}
              />

              <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />

              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as BreakdownRow;
                  return (
                    <ChartTooltip title={item.label}>
                      <p className="body-sm-medium text-brand-orange font-semibold">
                        {formatNumber(item.value)} new {item.value === 1 ? "enrollment" : "enrollments"}
                      </p>
                      <p className="body-2xsm-regular text-primary-300 mt-0.5">{item.share}% of all enrollments</p>
                    </ChartTooltip>
                  );
                }}
              />

              <Bar
                dataKey="value"
                fill={CHART.orange}
                maxBarSize={36}
                radius={[6, 6, 0, 0]}
                className="cursor-pointer transition-opacity hover:opacity-85"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
