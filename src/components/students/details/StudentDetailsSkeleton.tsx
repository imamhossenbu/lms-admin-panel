"use client";

import React from "react";

export function StudentDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-44 bg-slate-100 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-36 bg-slate-100 rounded-lg" />
            <div className="w-12 h-12 bg-slate-100 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-100 rounded-md" />
              <div className="h-4 w-72 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="h-10 w-32 bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-10 w-full bg-slate-100 rounded-lg" />

      {/* Grid Skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-white rounded-xl border border-dash p-6" />
          <div className="h-72 bg-white rounded-xl border border-dash p-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 xl:col-span-8 h-72 bg-white rounded-xl border border-dash p-6" />
          <div className="lg:col-span-5 xl:col-span-4 h-72 bg-white rounded-xl border border-dash p-6" />
        </div>
      </div>
    </div>
  );
}
