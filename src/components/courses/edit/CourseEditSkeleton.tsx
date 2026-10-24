"use client";

import React from "react";

export type CourseEditTabKey = "curriculum" | "details";

interface CourseEditSkeletonProps {
  activeTab?: CourseEditTabKey;
}

/* -------------------------------------------------------------------------- */
/* TAB 1: CURRICULUM BUILDER TAB SKELETON                                     */
/* -------------------------------------------------------------------------- */
export function CourseEditCurriculumSkeleton() {
  return (
    <div className="space-y-4 text-left">
      {/* Top Action Bar */}
      <div className="p-4 rounded-xl bg-white border border-dash flex items-center justify-between shadow-2xs">
        <div className="space-y-1">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-60 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* 2 Module Cards with Lessons */}
      <div className="space-y-4">
        {[1, 2].map((mod) => (
          <div key={mod} className="rounded-xl border border-dash bg-white overflow-hidden shadow-2xs">
            {/* Module Header Bar */}
            <div className="p-4 bg-slate-50 border-b border-dash flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-slate-200" />
                <div className="space-y-1">
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-slate-200/80 rounded-lg" />
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-dash" />
              </div>
            </div>

            {/* Lesson rows */}
            <div className="divide-y divide-dash">
              {[1, 2, 3].map((les) => (
                <div key={les} className="p-3.5 px-5 flex items-center justify-between hover:bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-slate-200/60" />
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center" />
                    <div className="space-y-1">
                      <div className="h-4 w-52 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-slate-100" />
                    <div className="w-7 h-7 rounded-md bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 2: COURSE DETAILS FORM SKELETON                                        */
/* -------------------------------------------------------------------------- */
export function CourseEditDetailsSkeleton() {
  return (
    <div className="space-y-6 text-left">
      {/* Basic Info Card */}
      <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-72 bg-slate-100 rounded" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-16 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
          </div>

          {/* Description Editor Outline */}
          <div className="space-y-1.5 pt-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-40 w-full bg-slate-50 rounded-lg border border-dash p-4 space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Upload Zone */}
      <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-40 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-36 rounded-xl border-2 border-dashed border-dash bg-slate-50 flex items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 mx-auto" />
            <div className="h-3.5 w-40 bg-slate-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT: COURSE EDIT SKELETON                                       */
/* -------------------------------------------------------------------------- */
export function CourseEditSkeleton({ activeTab = "curriculum" }: CourseEditSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* 1. Header with Back Button and Actions */}
      <div className="bg-white rounded-xl border border-dash p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-dash shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-48 bg-slate-200 rounded-md" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="h-3.5 w-64 bg-slate-100 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-24 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 2. Tabs Bar Skeleton */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-dash">
        <div
          className={`h-9 px-4 rounded-lg flex items-center gap-2 ${
            activeTab === "curriculum"
              ? "bg-white shadow-xs border border-dash"
              : "bg-slate-200/50"
          }`}
        >
          <div className={`h-3.5 ${activeTab === "curriculum" ? "w-28 bg-slate-300" : "w-24 bg-slate-200"} rounded`} />
        </div>

        <div
          className={`h-9 px-4 rounded-lg flex items-center gap-2 ${
            activeTab === "details"
              ? "bg-white shadow-xs border border-dash"
              : "bg-slate-200/50"
          }`}
        >
          <div className={`h-3.5 ${activeTab === "details" ? "w-28 bg-slate-300" : "w-24 bg-slate-200"} rounded`} />
        </div>
      </div>

      {/* 3. Tab-Specific Content Skeleton */}
      {activeTab === "curriculum" && <CourseEditCurriculumSkeleton />}
      {activeTab === "details" && <CourseEditDetailsSkeleton />}
    </div>
  );
}

export default CourseEditSkeleton;
