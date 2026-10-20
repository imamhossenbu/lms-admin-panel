import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-[#F0F0F0]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-64 rounded-[8px]" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
          <Skeleton className="h-4 w-80 max-w-full rounded-[6px]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-[8px]" />
          <Skeleton className="h-9 w-28 rounded-[8px]" />
        </div>
      </div>

      {/* 2. KPI Stat Cards Ribbon Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] bg-white border border-[#EDEDED] p-5 flex flex-col justify-between"
            style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="w-10 h-10 rounded-[10px]" />
            </div>
            <div className="my-1.5">
              <Skeleton className="h-8 w-32 rounded-[6px]" />
            </div>
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#F0F0F0]">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Quick Action Matrix Launcher Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] bg-white border border-[#EDEDED] p-4.5 flex flex-col justify-between"
            style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <Skeleton className="w-11 h-11 rounded-[10px]" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-48 max-w-full rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Main Analytics & Telemetry Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Chart Skeleton (2 cols) */}
        <div
          className="lg:col-span-2 rounded-[12px] bg-white border border-[#EDEDED] p-6 space-y-4"
          style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#F0F0F0]">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-56 rounded" />
              <Skeleton className="h-3 w-72 rounded" />
            </div>
            <Skeleton className="h-8 w-44 rounded-[8px]" />
          </div>

          {/* Metric Summary Ribbon Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-[#F0F0F0]">
            <div className="space-y-1">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-6 w-28 rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-6 w-32 rounded" />
            </div>
            <div className="hidden sm:block space-y-1">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>

          {/* Chart Canvas Area Skeleton */}
          <div className="h-64 w-full flex items-end gap-3 pt-4 px-2">
            {[40, 55, 48, 65, 78, 70, 85, 92, 80, 100].map((heightPct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton
                  className="w-full rounded-t-lg"
                  style={{ height: `${heightPct}%` }}
                />
                <Skeleton className="h-3 w-6 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Cluster Telemetry Skeleton (1 col) */}
        <div
          className="rounded-[12px] bg-white border border-[#EDEDED] p-6 space-y-4"
          style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F0F0]">
            <div className="space-y-1">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <div className="space-y-3 pt-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-[8px]" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28 rounded" />
                    <Skeleton className="h-2.5 w-36 rounded" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#F0F0F0]">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </div>

      {/* 5. Secondary Grid Skeleton (Orders & Top Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Orders Table Skeleton (2 cols) */}
        <div
          className="lg:col-span-2 rounded-[12px] bg-white border border-[#EDEDED] p-6 space-y-4"
          style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F0F0]">
            <div className="space-y-1">
              <Skeleton className="h-5 w-64 rounded" />
              <Skeleton className="h-3 w-80 max-w-full rounded" />
            </div>
            <Skeleton className="h-4 w-28 rounded" />
          </div>

          {/* Table Rows Skeleton */}
          <div className="rounded-[10px] border border-[#EDEDED] overflow-hidden divide-y divide-[#F0F0F0]">
            {/* Header row */}
            <div className="bg-[#F8F9FA] p-3.5 flex items-center justify-between gap-4">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            {/* 4 Body rows */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-20 rounded-[6px]" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-2.5 w-32 rounded" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-36 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Courses Skeleton (1 col) */}
        <div
          className="rounded-[12px] bg-white border border-[#EDEDED] p-6 space-y-4"
          style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F0F0]">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          <div className="space-y-3 pt-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-[8px]" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-36 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
