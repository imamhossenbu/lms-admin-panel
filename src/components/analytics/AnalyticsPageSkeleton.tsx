"use client";

import React from "react";

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6 text-left animate-pulse pb-10">
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-7 w-64 bg-slate-200 rounded-lg" />
            <div className="h-6 w-32 bg-slate-100 rounded-full" />
          </div>
          <div className="h-4 w-96 max-w-full bg-slate-100 rounded" />
        </div>
      </div>

      {/* 2. 4 Stat Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-dash p-5 flex flex-col justify-between shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center" />
            </div>
            <div className="h-7 w-24 bg-slate-200 rounded-md" />
            <div className="pt-2 border-t border-dash flex items-center justify-between">
              <div className="h-3.5 w-16 bg-slate-100 rounded" />
              <div className="h-3.5 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. 2 Large Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Velocity */}
        <div className="rounded-xl bg-white border border-dash p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="space-y-1">
              <div className="h-5 w-44 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-60 bg-slate-100 rounded" />
            </div>
            <div className="h-7 w-24 bg-slate-100 rounded-md border border-dash" />
          </div>

          {/* Bar Chart Bars */}
          <div className="h-64 w-full flex items-end gap-3 pt-4 px-2 border-b border-dash">
            {[45, 60, 52, 78, 88, 70, 95, 82, 90, 100].map((pct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full bg-slate-200 rounded-t-sm"
                  style={{ height: `${pct}%` }}
                />
                <div className="h-2.5 w-5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-28 bg-slate-100 rounded" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Chart 2: Student Engagement */}
        <div className="rounded-xl bg-white border border-dash p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="space-y-1">
              <div className="h-5 w-48 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-64 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>

          {/* Stepped Area Grid */}
          <div className="h-64 w-full flex items-end gap-2.5 pt-4 px-2 border-b border-dash">
            {[35, 48, 62, 58, 74, 80, 85, 78, 92, 98].map((pct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full bg-slate-200 rounded-t-sm"
                  style={{ height: `${pct}%` }}
                />
                <div className="h-2.5 w-5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-36 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPageSkeleton;
