"use client";

import React from "react";

export function CategoryFormSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl text-left animate-pulse pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-dash shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-6 w-24 bg-slate-100 rounded-full" />
      </div>

      {/* Main Form Card Skeleton */}
      <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-40 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-72 bg-slate-100 rounded" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-24 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>

          <div className="space-y-2 pt-2 border-t border-dash">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-10 h-10 rounded-lg bg-slate-100 border border-dash" />
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-dash">
            <div className="h-10 w-24 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-10 w-36 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryFormSkeleton;
