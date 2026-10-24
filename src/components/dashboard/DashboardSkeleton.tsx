"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-[12px] animate-pulse select-none pb-6 text-left">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-[12px]">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-36 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 2. 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[12px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-dash py-3.5 px-4 h-[112px] flex flex-col justify-between shadow-2xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dash shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-6 w-24 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-28 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="h-4 w-20 bg-slate-100 rounded-md" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Row 2: 2 Main Charts Skeleton (Revenue Overview & Student Growth) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        {/* Revenue Overview Chart Skeleton */}
        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center pb-3 border-b border-dash">
            <div className="space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-56 bg-slate-100 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
              <div className="h-7 w-24 bg-slate-100 rounded-md border border-dash" />
            </div>
          </div>

          {/* Metric Row */}
          <div className="flex items-center gap-6 py-2">
            <div className="space-y-1">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-6 w-24 bg-slate-200 rounded-md" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-6 w-20 bg-slate-200 rounded-md" />
            </div>
          </div>

          {/* Bar Chart Canvas with Columns */}
          <div className="h-44 w-full flex items-end gap-3 pt-3 px-2 border-b border-dash">
            {[35, 55, 45, 70, 85, 65, 92, 100, 78, 60, 88, 75].map((pct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full bg-slate-200 rounded-t-sm"
                  style={{ height: `${pct}%` }}
                />
                <div className="h-2.5 w-4 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Student Growth Chart Skeleton */}
        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center pb-3 border-b border-dash">
            <div className="space-y-1.5">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>

          <div className="flex items-center gap-6 py-2">
            <div className="space-y-1">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-6 w-28 bg-slate-200 rounded-md" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded-md" />
            </div>
          </div>

          {/* Stepped Wave / Area Chart Canvas */}
          <div className="h-44 w-full flex items-end gap-2.5 pt-3 px-2 border-b border-dash">
            {[40, 48, 55, 52, 68, 74, 70, 82, 88, 95].map((pct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full bg-slate-200 rounded-t-sm"
                  style={{ height: `${pct}%` }}
                />
                <div className="h-2.5 w-5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Row 3: Course Enrollment & Course Completion (Donut) Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        {/* Course Enrollment Breakdown */}
        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center pb-3 border-b border-dash">
            <div className="space-y-1.5">
              <div className="h-5 w-44 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-60 bg-slate-100 rounded-md" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-md" />
          </div>

          {/* 4 Progress Bar Rows */}
          <div className="space-y-4 py-2 flex-1 justify-center flex flex-col">
            {[
              { w: "82%", labelW: "w-28", valW: "w-12" },
              { w: "65%", labelW: "w-36", valW: "w-10" },
              { w: "48%", labelW: "w-24", valW: "w-10" },
              { w: "30%", labelW: "w-32", valW: "w-8" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className={`h-3.5 ${item.labelW} bg-slate-200 rounded`} />
                  <div className={`h-3.5 ${item.valW} bg-slate-100 rounded`} />
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-200 rounded-full"
                    style={{ width: item.w }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Completion Donut Chart */}
        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center pb-3 border-b border-dash">
            <div className="space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>

          {/* Donut Ring with Center Metric and Legend Items */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-36 h-36 rounded-full border-[14px] border-slate-100 border-t-slate-200 border-r-slate-200 flex items-center justify-center shrink-0">
              <div className="text-center space-y-1">
                <div className="h-6 w-14 bg-slate-200 rounded mx-auto" />
                <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              {[1, 2, 3].map((leg) => (
                <div
                  key={leg}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-dash"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                    <div className="h-3.5 w-24 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Row 4: 2 Tables Skeleton with Column Borders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        {/* Table 1: Recent Orders */}
        <div className="bg-white rounded-xl border border-dash overflow-hidden shadow-2xs">
          <div className="p-4 flex justify-between items-center border-b border-dash">
            <div className="space-y-1">
              <div className="h-5 w-32 bg-slate-200 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 rounded-md" />
            </div>
            <div className="h-7 w-20 bg-slate-100 rounded-md border border-dash" />
          </div>

          {/* Table Header */}
          <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-2.5">
            <div className="col-span-3 pr-2"><div className="h-3.5 w-16 bg-slate-200 rounded" /></div>
            <div className="col-span-4 px-2"><div className="h-3.5 w-20 bg-slate-200 rounded" /></div>
            <div className="col-span-3 px-2"><div className="h-3.5 w-14 bg-slate-200 rounded" /></div>
            <div className="col-span-2 pl-2"><div className="h-3.5 w-12 bg-slate-200 rounded" /></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-dash">
            {[1, 2, 3, 4].map((r) => (
              <div key={r} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3 items-center">
                <div className="col-span-3 pr-2">
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="col-span-4 px-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-20 bg-slate-200 rounded" />
                    <div className="h-2.5 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="col-span-3 px-2">
                  <div className="h-4 w-14 bg-slate-200 rounded" />
                </div>
                <div className="col-span-2 pl-2">
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table 2: Recent Enrollments */}
        <div className="bg-white rounded-xl border border-dash overflow-hidden shadow-2xs">
          <div className="p-4 flex justify-between items-center border-b border-dash">
            <div className="space-y-1">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 rounded-md" />
            </div>
            <div className="h-7 w-20 bg-slate-100 rounded-md border border-dash" />
          </div>

          {/* Table Header */}
          <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-2.5">
            <div className="col-span-4 pr-2"><div className="h-3.5 w-20 bg-slate-200 rounded" /></div>
            <div className="col-span-5 px-2"><div className="h-3.5 w-24 bg-slate-200 rounded" /></div>
            <div className="col-span-3 pl-2"><div className="h-3.5 w-14 bg-slate-200 rounded" /></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-dash">
            {[1, 2, 3, 4].map((r) => (
              <div key={r} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3 items-center">
                <div className="col-span-4 pr-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-20 bg-slate-200 rounded" />
                    <div className="h-2.5 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="col-span-5 px-2">
                  <div className="h-3.5 w-28 bg-slate-200 rounded" />
                </div>
                <div className="col-span-3 pl-2">
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
