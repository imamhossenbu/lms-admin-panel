"use client";

import React from "react";

export function OrdersPageSkeleton() {
  return (
    <div className="space-y-6 text-left animate-pulse pb-10">
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-7 w-64 bg-slate-200 rounded-lg" />
            <div className="h-6 w-36 bg-slate-100 rounded-full" />
          </div>
          <div className="h-4 w-96 max-w-full bg-slate-100 rounded" />
        </div>
      </div>

      {/* 2. 4 Financial Stat Cards Ribbon */}
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
            <div className="h-7 w-28 bg-slate-200 rounded-md" />
            <div className="pt-2 border-t border-dash flex items-center justify-between">
              <div className="h-3.5 w-16 bg-slate-100 rounded" />
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Orders DataTable Skeleton */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-dash flex items-center justify-between gap-4">
          <div className="h-10 w-full sm:w-80 bg-slate-100 rounded-lg border border-dash" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-9 w-28 bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>

        {/* Table Header with column dividers */}
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-3 text-left">
          <div className="col-span-2 pr-2"><div className="h-3.5 w-20 bg-slate-200 rounded" /></div>
          <div className="col-span-4 px-3"><div className="h-3.5 w-24 bg-slate-200 rounded" /></div>
          <div className="col-span-3 px-3 hidden md:block"><div className="h-3.5 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-14 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-16 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 pl-2 text-right"><div className="h-3.5 w-12 bg-slate-200 rounded ml-auto" /></div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5, 6].map((r) => (
            <div key={r} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3.5 items-center">
              <div className="col-span-2 pr-2">
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
              <div className="col-span-4 px-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="col-span-3 px-3 hidden md:block">
                <div className="h-3.5 w-44 bg-slate-100 rounded" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-4 w-14 bg-slate-200 rounded mx-auto" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-5 w-18 bg-slate-100 rounded-full mx-auto" />
              </div>
              <div className="col-span-1 pl-2 flex items-center justify-end">
                <div className="w-7 h-7 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPageSkeleton;
