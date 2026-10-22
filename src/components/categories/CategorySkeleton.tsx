"use client";

import React from "react";

export function CategorySkeleton() {
  return (
    <div className="space-y-[12px] animate-pulse select-none pb-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-[12px]">
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-slate-100 rounded-md" />
          <div className="h-7 w-36 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* Main Split: Left Table + Right Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] items-start">
        {/* Left Table Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-dash overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-dash">
            <div className="h-9 w-60 bg-slate-100 rounded-lg" />
            <div className="h-9 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 w-full bg-slate-100 rounded-md" />
            ))}
          </div>
        </div>

        {/* Right Form Card Skeleton */}
        <div className="bg-white rounded-xl border border-dash p-4 space-y-4">
          <div className="h-5 w-28 bg-slate-200 rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-100 rounded-md" />
            <div className="h-9 w-full bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-100 rounded-md" />
            <div className="h-20 w-full bg-slate-100 rounded-lg" />
          </div>
          <div className="h-16 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
