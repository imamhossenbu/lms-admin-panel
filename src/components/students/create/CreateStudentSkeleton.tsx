"use client";

import React from "react";

export function CreateStudentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left pb-8">
      {/* Top Header Skeleton */}
      <div className="space-y-4">
        {/* Breadcrumb pills */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-2 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
        </div>

        {/* Action Header Card */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dash shrink-0" />
          <div className="space-y-1.5">
            <div className="h-7 w-56 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Student Information Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-6 shadow-2xs">
            <div className="flex items-center gap-3 pb-3 border-b border-dash">
              <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-44 bg-slate-200 rounded-md" />
                <div className="h-4 w-80 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
              </div>
            </div>

            {/* Password Generator Notice Skeleton */}
            <div className="p-4 rounded-xl bg-slate-50 border border-dash space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1">
                  <div className="h-4 w-64 bg-slate-200 rounded" />
                  <div className="h-3 w-80 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2 border-t border-dash">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-3.5 w-36 bg-slate-200 rounded" />
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
              </div>
            </div>
          </div>

          {/* Card 2: Course Enrollment Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-dash">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-slate-200 rounded-md" />
                  <div className="h-4 w-64 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-44 bg-slate-100 rounded-lg border border-dash" />
                <div className="h-9 w-28 bg-slate-100 rounded-lg border border-dash" />
              </div>
            </div>

            {/* Courses Table Skeleton */}
            <div className="rounded-lg border border-dash overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50 border-b border-dash divide-x divide-dash py-2.5 px-3">
                <div className="col-span-1 h-4 bg-slate-200 rounded" />
                <div className="col-span-1 h-4 bg-slate-200 rounded pl-2" />
                <div className="col-span-5 h-4 bg-slate-200 rounded pl-2" />
                <div className="col-span-3 h-4 bg-slate-200 rounded pl-2" />
                <div className="col-span-2 h-4 bg-slate-200 rounded pl-2" />
              </div>
              <div className="divide-y divide-dash">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-12 divide-x divide-dash py-3 px-3 items-center">
                    <div className="col-span-1 h-4 w-4 bg-slate-200 rounded" />
                    <div className="col-span-1 h-3.5 w-4 bg-slate-100 rounded pl-2" />
                    <div className="col-span-5 flex items-center gap-2 pl-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
                      <div className="h-4 w-40 bg-slate-200 rounded" />
                    </div>
                    <div className="col-span-3 pl-2">
                      <div className="h-4 w-24 bg-slate-100 rounded" />
                    </div>
                    <div className="col-span-2 pl-2">
                      <div className="h-4 w-16 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 3: Account Summary Card Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-3 pb-3 border-b border-dash">
              <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
            </div>

            <div className="divide-y divide-dash space-y-0">
              <div className="flex items-center justify-between py-3">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="h-4 w-16 bg-slate-100 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="h-4 w-16 bg-slate-100 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="h-4 w-16 bg-slate-100 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="h-4 w-28 bg-slate-100 rounded" />
                <div className="h-6 w-24 bg-slate-200 rounded-md" />
              </div>
            </div>
          </div>

          {/* Card 4: Next Steps Card Skeleton */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 pb-2 border-b border-dash">
              <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
            </div>

            <div className="space-y-3 pt-1">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                  <div className="h-4 w-52 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex justify-end gap-3 pt-2">
            <div className="h-10 w-24 bg-slate-100 rounded-lg border border-dash" />
            <div className="h-10 w-36 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStudentSkeleton;
