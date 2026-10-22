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
import { ChevronDown } from "lucide-react";
import { RevenueDataPoint } from "@/types/dashboard";

interface RevenueOverviewChartProps {
  data: RevenueDataPoint[];
}

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  const [metricFilter, setMetricFilter] = useState<"Revenue" | "Orders" | "Net">("Revenue");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-dash p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[330px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="heading-h5 font-bold text-primary-500">
            Revenue Overview
          </h3>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            Total revenue and growth over time
          </p>
        </div>

        {/* Dropdown Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{metricFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-primary-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-dash py-1 z-20">
              {(["Revenue", "Orders", "Net"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setMetricFilter(option);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 body-sm-medium transition-colors ${
                    metricFilter === option
                      ? "text-brand-orange bg-brand-orange-light font-semibold"
                      : "text-primary-500 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5B00" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#FF5B00" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
              tickFormatter={(val) => (val === 0 ? "$0" : `$${val / 1000}K`)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RevenueDataPoint;
                  return (
                    <div className="bg-white rounded-xl shadow-md border border-dash px-3.5 py-2 text-center">
                      <p className="body-2xsm-regular text-primary-300">
                        {item.date}, 2026
                      </p>
                      <p className="body-sm-medium font-bold text-primary-500 flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                        <span>{item.formattedRevenue}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF5B00"
              strokeWidth={2.8}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              activeDot={{
                r: 6,
                fill: "#FF5B00",
                stroke: "#FFFFFF",
                strokeWidth: 2.5,
              }}
              dot={{
                r: 3.5,
                fill: "#FF5B00",
                stroke: "#FFFFFF",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
