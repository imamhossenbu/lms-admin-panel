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
            <div className="h-4 w-2 bg-slate-200 rounded" />
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
            <div className="h-10 w-72 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-10 w-28 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-10 w-32 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-10 w-28 bg-slate-100 rounded-lg border border-dash" />
          </div>
          <div className="h-10 w-24 bg-slate-100 rounded-lg border border-dash self-end lg:self-auto" />
        </div>

        {/* Table Skeleton with column-wise borders */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-50 border-b border-dash divide-x divide-dash py-3 px-4 min-w-[800px]">
            <div className="col-span-1 h-4 w-6 bg-slate-200 rounded mx-auto" />
            <div className="col-span-4 h-4 w-28 bg-slate-200 rounded pl-3" />
            <div className="col-span-2 h-4 w-16 bg-slate-200 rounded pl-3" />
            <div className="col-span-2 h-4 w-20 bg-slate-200 rounded pl-3" />
            <div className="col-span-1 h-4 w-12 bg-slate-200 rounded mx-auto" />
            <div className="col-span-1 h-4 w-16 bg-slate-200 rounded mx-auto" />
            <div className="col-span-1 h-4 w-12 bg-slate-200 rounded mx-auto" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-dash min-w-[800px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-12 divide-x divide-dash py-3 px-4 items-center">
                {/* # */}
                <div className="col-span-1 h-4 w-4 bg-slate-100 rounded mx-auto" />

                {/* Student Info */}
                <div className="col-span-4 flex items-center gap-3 pl-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-44 bg-slate-100 rounded" />
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-2 pl-3">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                </div>

                {/* Progress / Enrolled */}
                <div className="col-span-2 pl-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-16 bg-slate-200 rounded" />
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-center">
                  <div className="h-6 w-16 bg-slate-200 rounded-full" />
                </div>

                {/* Join Date */}
                <div className="col-span-1 flex justify-center">
                  <div className="h-4 w-16 bg-slate-100 rounded" />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-1.5">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg border border-dash" />
                  <div className="w-7 h-7 bg-slate-100 rounded-lg border border-dash" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-dash flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-100 rounded" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-slate-100 rounded-lg border border-dash" />
              <div className="w-8 h-8 bg-slate-200 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg border border-dash" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg border border-dash" />
            </div>
            <div className="w-[116px] h-8 bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSkeleton;
