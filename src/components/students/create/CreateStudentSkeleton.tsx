"use client";

import React from "react";

export function CreateStudentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left pb-8">
      {/* Top Header Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-40 bg-slate-100 rounded-md" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-36 bg-slate-100 rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-100 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-100 rounded-md" />
              <div className="h-4 w-72 bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Student Information Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg" />
              <div className="space-y-2">
                <div className="h-5 w-44 bg-slate-100 rounded-md" />
                <div className="h-4 w-80 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-14 bg-slate-100 rounded-lg" />
              <div className="h-14 bg-slate-100 rounded-lg" />
              <div className="h-14 bg-slate-100 rounded-lg" />
              <div className="h-14 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-28 bg-slate-100 rounded-xl" />
          </div>

          {/* Card 2: Course Enrollment Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-slate-100 rounded-md" />
                  <div className="h-4 w-72 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-48 bg-slate-100 rounded-lg" />
                <div className="h-9 w-28 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="h-64 bg-slate-100 rounded-lg" />
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-dash p-6 h-64" />
          <div className="bg-white rounded-xl border border-dash p-6 h-56" />
          <div className="flex justify-end gap-3">
            <div className="h-10 w-24 bg-slate-100 rounded-lg" />
            <div className="h-10 w-36 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
