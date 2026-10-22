"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-[12px] animate-pulse select-none pb-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-[12px]">
        <div className="space-y-1.5">
          <div className="h-7 w-32 bg-slate-200 rounded-lg" />
          <div className="h-4 w-60 bg-slate-100 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[12px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-dash py-3.5 px-4 h-[108px] flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-6 w-20 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-24 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="h-3.5 w-20 bg-slate-100 rounded-md" />
              <div className="h-6 w-16 bg-slate-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: 2 Main Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <div className="bg-white rounded-xl border border-dash p-5 h-[330px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-7 w-20 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl border border-dash p-5 h-[330px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-40 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Row 3: 2 Middle Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl border border-dash p-5 h-[340px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-52 bg-slate-100 rounded-md" />
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-6">
            <div className="w-36 h-36 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: 2 Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        {[1, 2].map((t) => (
          <div
            key={t}
            className="bg-white rounded-xl border border-dash p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-200 rounded-md" />
              <div className="h-4 w-14 bg-slate-100 rounded-md" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((r) => (
                <div key={r} className="h-9 w-full bg-slate-100 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
