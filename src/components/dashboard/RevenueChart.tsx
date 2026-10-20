"use client";

import React, { useState } from "react";
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
import { TrendingUp, DollarSign, Users } from "lucide-react";

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
  const [metric, setMetric] = useState<"revenue" | "enrollments">("revenue");

  const totalRevenue = CHART_DATA.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalEnrollments = CHART_DATA.reduce((acc, curr) => acc + curr.enrollments, 0);

  return (
    <SectionCard
      title="Financial Telemetry & Enrollment Velocity"
      description="Monthly gross transaction volume and verified student enrollments"
      action={
        <div className="flex items-center gap-2">
          {/* Metric Selector Pills */}
          <div className="inline-flex items-center p-1 bg-[#F3F4F6] rounded-[8px] border border-[#EDEDED]">
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              className={`px-3 py-1 body-xsm-medium rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer ${
                metric === "revenue"
                  ? "bg-white text-[#1C4D8D] shadow-2xs border border-[#EDEDED]"
                  : "text-primary-400 hover:text-primary-500"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue</span>
            </button>
            <button
              type="button"
              onClick={() => setMetric("enrollments")}
              className={`px-3 py-1 body-xsm-medium rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer ${
                metric === "enrollments"
                  ? "bg-white text-[#1C4D8D] shadow-2xs border border-[#EDEDED]"
                  : "text-primary-400 hover:text-primary-500"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Enrollments</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Metric Quick Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 mb-2 border-b border-[#F0F0F0] text-left">
        <div className="space-y-0.5">
          <span className="body-xsm-regular subtext-500 uppercase tracking-wider font-semibold">
            Total 10M Volume
          </span>
          <p className="title-medium text-primary-500 font-bold">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="body-xsm-regular subtext-500 uppercase tracking-wider font-semibold">
            Total Enrollments
          </span>
          <p className="title-medium text-primary-500 font-bold">
            {totalEnrollments.toLocaleString()} learners
          </p>
        </div>
        <div className="hidden sm:block space-y-0.5">
          <span className="body-xsm-regular subtext-500 uppercase tracking-wider font-semibold">
            Oct Peak Run-Rate
          </span>
          <p className="title-medium text-[#0dc34a] font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +33.2% vs Sep
          </p>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={CHART_DATA}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              tick={{ fill: "#64748B", fontWeight: 500 }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              tick={{ fill: "#64748B", fontWeight: 500 }}
              tickFormatter={(v) =>
                metric === "revenue" ? `$${v >= 1000 ? `${v / 1000}k` : v}` : v
              }
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0F2854] border border-[#1C355E] rounded-xl p-3 shadow-xl text-left text-white space-y-1">
                      <p className="body-xsm-medium text-sky-200 uppercase tracking-wider">
                        {label} 2026 Telemetry
                      </p>
                      <div className="flex items-center justify-between gap-4 body-sm-medium text-white">
                        <span>Revenue:</span>
                        <span className="text-emerald-400">
                          ${data.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 body-xsm-regular text-slate-300">
                        <span>Enrollments:</span>
                        <span className="font-semibold text-sky-300">
                          {data.enrollments.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {metric === "revenue" ? (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="#0D9488"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#enrollmentGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
