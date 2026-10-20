"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SectionCard } from "@/components/ui/SectionCard";

const CHART_DATA = [
  { month: "Jan", revenue: 14200, enrollments: 320 },
  { month: "Feb", revenue: 18500, enrollments: 450 },
  { month: "Mar", revenue: 16800, enrollments: 410 },
  { month: "Apr", revenue: 22400, enrollments: 590 },
  { month: "May", revenue: 28900, enrollments: 720 },
  { month: "Jun", revenue: 26400, enrollments: 680 },
  { month: "Jul", revenue: 34100, enrollments: 890 },
  { month: "Aug", revenue: 39500, enrollments: 1040 },
  { month: "Sep", revenue: 36200, enrollments: 950 },
  { month: "Oct", revenue: 48250, enrollments: 1280 },
];

export function RevenueChart() {
  return (
    <SectionCard
      title="Revenue & Enrollment Growth"
      description="Monthly gross volume and verified student enrollments"
      action={
        <span className="body-xsm-medium px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary">
          FY 2026 Live
        </span>
      }
    >
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1C4D8D" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1C4D8D" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "#0F2854",
                borderColor: "#1C355E",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#BDE8F5" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1C4D8D"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
