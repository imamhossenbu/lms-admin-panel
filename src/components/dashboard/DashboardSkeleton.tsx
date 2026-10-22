"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-9 w-40 bg-slate-200 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-dash p-5 h-36 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
              <div className="space-y-2">
                <div className="h-7 w-24 bg-slate-200 rounded-lg" />
                <div className="h-4 w-28 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded-md" />
              <div className="h-7 w-20 bg-slate-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: 2 Main Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-dash p-6 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-8 w-24 bg-slate-100 rounded-lg" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-xl" />
        </div>

        <div className="bg-white rounded-2xl border border-dash p-6 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-44 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Row 3: 2 Middle Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-dash p-6 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-xl" />
        </div>

        <div className="bg-white rounded-2xl border border-dash p-6 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-6">
            <div className="w-40 h-40 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: 2 Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((t) => (
          <div
            key={t}
            className="bg-white rounded-2xl border border-dash p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-4 w-16 bg-slate-100 rounded-md" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((r) => (
                <div key={r} className="h-10 w-full bg-slate-100 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
