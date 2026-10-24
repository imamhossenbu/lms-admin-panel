"use client";

import React from "react";

export function CourseCreateSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left animate-pulse pb-16">
      {/* 1. Navigation Topbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded" />
          <div className="h-4 w-36 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-32 bg-slate-100 rounded-full" />
      </div>

      {/* 2. PageHeader Skeleton */}
      <div className="space-y-1.5">
        <div className="h-7 w-52 bg-slate-200 rounded-lg" />
        <div className="h-4 w-80 bg-slate-100 rounded" />
      </div>

      {/* 3. Main Form Card Skeleton */}
      <div className="p-6 rounded-[12px] bg-white border border-[#EDEDED] shadow-2xs space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>

        {/* Level & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>

        {/* Course Banner Picker Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-100 border border-dash" />
            ))}
          </div>
        </div>

        {/* Description Editor Outline */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-44 w-full rounded-lg bg-slate-50 border border-dash p-4 space-y-2.5">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#EDEDED] flex items-center justify-end gap-3">
          <div className="h-10 w-24 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-10 w-36 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default CourseCreateSkeleton;
