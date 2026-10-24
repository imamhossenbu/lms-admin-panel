"use client";

import React from "react";

export function InstructorSkeleton() {
  return (
    <div className="space-y-[16px] text-left animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Main Table Card Skeleton */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Toolbar Skeleton */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-dash">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="h-9 w-72 bg-slate-100 rounded-lg" />
            <div className="h-9 w-28 bg-slate-100 rounded-lg" />
            <div className="h-9 w-36 bg-slate-100 rounded-lg" />
            <div className="h-9 w-28 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-9 w-24 bg-slate-100 rounded-lg self-end lg:self-auto" />
        </div>

        {/* Table Header Skeleton */}
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-3 text-left">
          <div className="col-span-1 pr-2 text-center"><div className="h-4 w-5 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-3 px-3"><div className="h-4 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3 hidden md:block"><div className="h-4 w-24 bg-slate-200 rounded" /></div>
          <div className="col-span-1 px-2 text-center hidden sm:block"><div className="h-4 w-12 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 text-center hidden sm:block"><div className="h-4 w-12 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-4 w-12 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2"><div className="h-4 w-14 bg-slate-200 rounded" /></div>
          <div className="col-span-1 px-2 hidden lg:block"><div className="h-4 w-14 bg-slate-200 rounded" /></div>
          <div className="col-span-1 pl-2 text-right"><div className="h-4 w-10 bg-slate-200 rounded ml-auto" /></div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3 items-center">
              <div className="col-span-1 pr-2 text-center">
                <div className="h-4 w-5 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="col-span-3 px-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="col-span-2 px-3 hidden md:block">
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
              <div className="col-span-1 px-2 text-center hidden sm:block">
                <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
              </div>
              <div className="col-span-1 px-2 text-center hidden sm:block">
                <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-4 w-10 bg-slate-200 rounded mx-auto" />
              </div>
              <div className="col-span-1 px-2">
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="col-span-1 px-2 hidden lg:block">
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
              <div className="col-span-1 pl-2 flex items-center justify-end gap-1.5">
                <div className="w-7 h-7 bg-slate-100 rounded-md" />
                <div className="w-7 h-7 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-dash flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-100 rounded" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div className="w-8 h-8 bg-slate-200 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="w-[116px] h-8 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorSkeleton;
