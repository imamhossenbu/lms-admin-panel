"use client";

import React from "react";

export type CourseDetailsTabKey = "syllabus" | "outcomes" | "learners";

interface CourseDetailsSkeletonProps {
  activeTab?: CourseDetailsTabKey;
}

/* -------------------------------------------------------------------------- */
/* TAB 1: SYLLABUS TAB SKELETON                                               */
/* -------------------------------------------------------------------------- */
export function CourseSyllabusTabSkeleton() {
  return (
    <div className="space-y-4 text-left">
      {/* Syllabus Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
        <div className="space-y-1">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-36 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-28 bg-slate-200/80 rounded-lg" />
      </div>

      {/* 3 Module Accordions */}
      <div className="space-y-3">
        {/* Module 1: Expanded with lessons */}
        <div className="rounded-[12px] border border-[#EDEDED] bg-white overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50/80 border-b border-dash flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-xs" />
              <div className="space-y-1">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="w-6 h-6 bg-slate-100 rounded" />
          </div>

          {/* Lessons list inside expanded module */}
          <div className="divide-y divide-dash">
            {[1, 2, 3, 4].map((l) => (
              <div key={l} className="p-3.5 px-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center" />
                  <div className="space-y-1">
                    <div className="h-4 w-52 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-14 bg-slate-100 rounded" />
                  <div className="h-7 w-16 bg-slate-100 rounded-md border border-dash" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Collapsed */}
        <div className="rounded-[12px] border border-[#EDEDED] bg-white p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="space-y-1">
              <div className="h-4 w-56 bg-slate-200 rounded" />
              <div className="h-3 w-28 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="w-6 h-6 bg-slate-100 rounded" />
        </div>

        {/* Module 3: Collapsed */}
        <div className="rounded-[12px] border border-[#EDEDED] bg-white p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="space-y-1">
              <div className="h-4 w-60 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="w-6 h-6 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 2: OUTCOMES TAB SKELETON                                               */
/* -------------------------------------------------------------------------- */
export function CourseOutcomesTabSkeleton() {
  return (
    <div className="space-y-5 text-left">
      {/* What You'll Learn Box */}
      <div className="p-5 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-200" />
          <div className="h-5 w-48 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="h-3.5 w-full bg-slate-200 rounded" />
                <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites Box */}
      <div className="p-5 rounded-[12px] bg-white border border-[#EDEDED] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-200" />
          <div className="h-5 w-44 bg-slate-200 rounded" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((req) => (
            <div key={req} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 3: LEARNERS TAB SKELETON                                               */
/* -------------------------------------------------------------------------- */
export function CourseLearnersTabSkeleton() {
  return (
    <div className="space-y-4 text-left">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((m) => (
          <div key={m} className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-1.5">
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Learners Table with Column Dividers */}
      <div className="rounded-[12px] border border-dash bg-white overflow-hidden shadow-2xs">
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-4 py-3 text-left">
          <div className="col-span-4 pr-3"><div className="h-3.5 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-3 px-3"><div className="h-3.5 w-24 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3 text-center"><div className="h-3.5 w-14 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-3 pl-3 text-right"><div className="h-3.5 w-16 bg-slate-200 rounded ml-auto" /></div>
        </div>

        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-12 divide-x divide-dash px-4 py-3.5 items-center">
              <div className="col-span-4 pr-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="col-span-3 px-3 space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-8 bg-slate-200 rounded" />
                  <div className="h-3 w-10 bg-slate-100 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 rounded-full" style={{ width: `${(i * 22) % 100}%` }} />
                </div>
              </div>
              <div className="col-span-2 px-3 text-center">
                <div className="h-5 w-16 bg-slate-100 rounded-full mx-auto" />
              </div>
              <div className="col-span-3 pl-3 text-right">
                <div className="h-3.5 w-20 bg-slate-100 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT: COURSE DETAILS SKELETON                                    */
/* -------------------------------------------------------------------------- */
export function CourseDetailsSkeleton({ activeTab = "syllabus" }: CourseDetailsSkeletonProps) {
  return (
    <div className="space-y-5 animate-pulse text-left pb-10">
      {/* 1. Header Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-dash shrink-0" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 2. Course Hero Banner Skeleton */}
      <div className="rounded-[14px] overflow-hidden border border-[#EDEDED] bg-slate-900 text-white p-6 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Banner Thumbnail Box (5 cols) */}
          <div className="md:col-span-5 h-48 md:h-56 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center" />

          {/* Info Details (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 bg-slate-800 rounded-md" />
              <div className="h-6 w-20 bg-slate-800 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-3/4 bg-slate-700 rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-800 rounded" />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800" />
                <div className="h-3.5 w-28 bg-slate-800 rounded" />
              </div>
              <div className="h-3.5 w-20 bg-slate-800 rounded" />
              <div className="h-3.5 w-24 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar Skeleton */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-dash overflow-x-auto">
        {[
          { id: "syllabus", label: "Curriculum & Syllabus" },
          { id: "outcomes", label: "Learning Outcomes & Prerequisites" },
          { id: "learners", label: "Enrolled Students" },
        ].map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <div
              key={tab.id}
              className={`h-9 px-4 rounded-lg shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-white shadow-xs border border-dash"
                  : "bg-slate-200/50"
              }`}
            >
              <div className={`h-3.5 ${isActive ? "w-36 bg-slate-300" : "w-28 bg-slate-200"} rounded`} />
            </div>
          );
        })}
      </div>

      {/* 4. Tab-Specific Content Skeleton */}
      {activeTab === "syllabus" && <CourseSyllabusTabSkeleton />}
      {activeTab === "outcomes" && <CourseOutcomesTabSkeleton />}
      {activeTab === "learners" && <CourseLearnersTabSkeleton />}
    </div>
  );
}

export default CourseDetailsSkeleton;
