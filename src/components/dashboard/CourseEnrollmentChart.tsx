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
import { CourseEnrollmentPoint } from "@/types/dashboard";

interface CourseEnrollmentChartProps {
  data: CourseEnrollmentPoint[];
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-dash p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="heading-h5 font-bold text-primary-500">
            Course Enrollment
          </h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            Top performing courses by enrollment
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
      <div className="w-full flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 10, left: -15, bottom: 25 }}
            barCategoryGap={20}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="courseName"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={({ x, y, payload }) => {
                const words = payload.value.split(" ");
                let line1 = payload.value;
                let line2 = "";
                if (words.length > 2) {
                  line1 = words.slice(0, 2).join(" ");
                  line2 = words.slice(2).join(" ");
                }
                return (
                  <g transform={`translate(${x},${Number(y) + 8})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize={11}
                      fontWeight={500}
                    >
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

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as CourseEnrollmentPoint;
                  return (
                    <div className="bg-white rounded-xl shadow-lg border border-dash px-3.5 py-2.5 text-left pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-100">
                      <p className="body-xsm-medium text-primary-500 font-bold">
                        {item.courseName}
                      </p>
                      <p className="body-sm-medium text-brand-orange font-semibold mt-0.5">
                        {item.enrollments} Enrolled Students
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="enrollments"
              fill="#FF5B00"
              barSize={36}
              radius={[6, 6, 0, 0]}
              className="cursor-pointer transition-opacity hover:opacity-85"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
