"use client";

import React from "react";

export function StudentSkeleton() {
  return (
    <div className="space-y-[16px] animate-pulse select-none pb-8 text-left">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[16px]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-slate-200 rounded-md" />
            <div className="h-4 w-3 bg-slate-100 rounded-md" />
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
          </div>
          <div className="h-7 w-40 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg shrink-0" />
      </div>

      {/* Main Full-Width Table Card Skeleton */}
      <div className="bg-white rounded-xl border border-dash overflow-hidden shadow-2xs">
        {/* Toolbar Skeleton */}
        <div className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-b border-dash">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="h-10 w-72 bg-slate-100 rounded-lg" />
            <div className="h-10 w-28 bg-slate-100 rounded-lg" />
            <div className="h-10 w-32 bg-slate-100 rounded-lg" />
            <div className="h-10 w-28 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-10 w-24 bg-slate-100 rounded-lg self-end lg:self-auto" />
        </div>

        {/* Table Header Skeleton */}
        <div className="bg-[#F1F3F5] border-b border-dash px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-4 w-4 bg-slate-200 rounded" />
            <div className="h-4 w-6 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-36 bg-slate-200 rounded hidden md:block" />
          </div>
          <div className="flex items-center gap-8">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-14 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded hidden sm:block" />
            <div className="h-4 w-6 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-slate-100 rounded" />
                <div className="w-5 h-4 bg-slate-100 rounded text-center" />
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>

              <div className="flex items-center gap-8">
                <div className="h-4 w-36 bg-slate-100 rounded hidden md:block" />
                <div className="h-4 w-8 bg-slate-200 rounded" />
                <div className="space-y-1 w-24">
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                  <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                </div>
                <div className="h-5 w-14 bg-slate-100 rounded-md" />
                <div className="h-4 w-20 bg-slate-100 rounded hidden sm:block" />
                <div className="w-6 h-6 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-dash flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-100 rounded" />
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSkeleton;
