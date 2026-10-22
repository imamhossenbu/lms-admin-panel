"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { StudentGrowthPoint } from "@/types/dashboard";

interface StudentGrowthChartProps {
  data: StudentGrowthPoint[];
}

export function StudentGrowthChart({ data }: StudentGrowthChartProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[330px]">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="text-left">
          <h3 className="heading-h5 font-bold text-primary-500">
            Student Growth
          </h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            New students vs active students
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B00]" />
            <span className="body-xsm-medium text-primary-400">
              New Students
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FED7AA]" />
            <span className="body-xsm-medium text-primary-400">
              Active Students
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 10, left: -10, bottom: 20 }}
            barCategoryGap={24}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              domain={[0, 1500]}
              ticks={[0, 500, 1000, 1500]}
              tickFormatter={(val) => {
                if (val === 0) return "0";
                if (val >= 1000) return `${val / 1000}K`;
                return `${val}`;
              }}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length >= 2) {
                  const item = payload[0].payload as StudentGrowthPoint;
                  return (
                    <div className="bg-white rounded-xl shadow-md border border-dash px-3.5 py-2.5 text-left">
                      <p className="body-2xsm-regular text-primary-300 mb-1">
                        {item.date}, 2026
                      </p>
                      <div className="space-y-1">
                        <p className="body-xsm-medium text-primary-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF5B00]" />
                          <span>New Students:</span>
                          <span className="font-bold ml-auto">{item.newStudents}</span>
                        </p>
                        <p className="body-xsm-medium text-primary-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FED7AA]" />
                          <span>Active Students:</span>
                          <span className="font-bold ml-auto">{item.activeStudents}</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="newStudents"
              stackId="growth"
              fill="#FF5B00"
              barSize={16}
            />
            <Bar
              dataKey="activeStudents"
              stackId="growth"
              fill="#FED7AA"
              barSize={16}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
