"use client";

import React from "react";
import { StudentTabKey } from "./StudentDetailsTabs";

const TAB_CONFIGS: { key: StudentTabKey; label: string; count?: number }[] = [
  { key: "overview", label: "Overview" },
  { key: "enrolled-courses", label: "Enrolled Courses", count: 6 },
  { key: "assignments", label: "Assignments", count: 4 },
  { key: "quizzes", label: "Quizzes", count: 8 },
  { key: "certificates", label: "Certificates", count: 2 },
  { key: "activity-log", label: "Activity Log" },
  { key: "notes", label: "Notes" },
];

/* -------------------------------------------------------------------------- */
/* TAB 1: OVERVIEW TAB SKELETON                                               */
/* -------------------------------------------------------------------------- */
export function StudentOverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Row: Student Information Overview + Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Student Information Overview */}
        <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-40 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-56 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-16 bg-slate-100 rounded-lg border border-dash" />
          </div>

          <div className="divide-y divide-dash space-y-0">
            <div className="flex items-center justify-between py-3.5">
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-4 w-36 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-44 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Card 2: Learning Progress with Donut Centerpiece */}
        <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-36 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-48 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-6 w-24 bg-slate-100 rounded-full" />
          </div>

          <div className="flex flex-col items-center justify-center py-4 my-auto space-y-3">
            <div className="relative w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
              <div className="text-center space-y-1">
                <div className="h-7 w-12 bg-slate-200 rounded mx-auto" />
                <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dash">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-dash space-y-1.5 text-center">
                <div className="h-5 w-10 bg-slate-200 rounded mx-auto" />
                <div className="h-3 w-14 bg-slate-100 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Enrolled Courses Mini Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card 3: Enrolled Courses Mini Table */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-dash p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-36 bg-slate-200 rounded-md" />
                  <div className="h-5 w-16 bg-slate-100 rounded-md" />
                </div>
                <div className="h-3.5 w-52 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-slate-100 rounded-lg border border-dash" />
          </div>

          <div className="rounded-lg border border-dash overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 border-b border-dash divide-x divide-dash py-2.5 px-3">
              <div className="col-span-1 h-3.5 bg-slate-200 rounded" />
              <div className="col-span-5 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
            </div>

            <div className="divide-y divide-dash">
              {[1, 2, 3].map((r) => (
                <div key={r} className="grid grid-cols-12 divide-x divide-dash py-3 px-3 items-center">
                  <div className="col-span-1 h-3.5 w-4 bg-slate-100 rounded" />
                  <div className="col-span-5 flex items-center gap-2.5 pl-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                  </div>
                  <div className="col-span-2 pl-2 space-y-1">
                    <div className="h-3 w-8 bg-slate-200 rounded" />
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                  </div>
                  <div className="col-span-2 pl-2">
                    <div className="h-5 w-20 bg-slate-100 rounded-md" />
                  </div>
                  <div className="col-span-2 pl-2">
                    <div className="h-3.5 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Recent Activity Timeline */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-dash p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-dash">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-32 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-44 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-slate-100 rounded-lg border border-dash" />
          </div>

          <div className="space-y-4 pt-1">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-dash shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 2: ENROLLED COURSES TAB SKELETON                                       */
/* -------------------------------------------------------------------------- */
export function StudentEnrolledCoursesTabSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton */}
      <div className="p-4 rounded-xl bg-white border border-dash flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="h-10 w-full sm:w-72 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-10 w-36 bg-slate-100 rounded-lg border border-dash hidden md:block" />
        </div>
        <div className="h-10 w-44 bg-slate-200 rounded-lg self-end sm:self-auto shrink-0" />
      </div>

      {/* Full DataTable Skeleton */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden">
        {/* Table Header with column dividers */}
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-3 text-left">
          <div className="col-span-1 pr-2 text-center"><div className="h-3.5 w-5 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-4 px-3"><div className="h-3.5 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3 hidden md:block"><div className="h-3.5 w-20 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3"><div className="h-3.5 w-16 bg-slate-200 rounded" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-12 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 hidden lg:block"><div className="h-3.5 w-16 bg-slate-200 rounded" /></div>
          <div className="col-span-1 pl-2 text-right"><div className="h-3.5 w-8 bg-slate-200 rounded ml-auto" /></div>
        </div>

        {/* 6 Table Rows */}
        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3.5 items-center">
              <div className="col-span-1 pr-2 text-center">
                <div className="h-4 w-4 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="col-span-4 px-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="col-span-2 px-3 hidden md:block">
                <div className="h-4 w-28 bg-slate-100 rounded" />
              </div>
              <div className="col-span-2 px-3 space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-8 bg-slate-200 rounded" />
                  <div className="h-3 w-10 bg-slate-100 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 rounded-full" style={{ width: `${(i * 18) % 100}%` }} />
                </div>
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-5 w-16 bg-slate-100 rounded-full mx-auto" />
              </div>
              <div className="col-span-1 px-2 hidden lg:block">
                <div className="h-3.5 w-20 bg-slate-100 rounded" />
              </div>
              <div className="col-span-1 pl-2 flex items-center justify-end">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-dash" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 3: ASSIGNMENTS TAB SKELETON                                            */
/* -------------------------------------------------------------------------- */
export function StudentAssignmentsTabSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton */}
      <div className="p-4 rounded-xl bg-white border border-dash flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="h-10 w-full sm:w-64 bg-slate-100 rounded-lg border border-dash" />
          <div className="h-10 w-36 bg-slate-100 rounded-lg border border-dash hidden sm:block" />
          <div className="h-10 w-32 bg-slate-100 rounded-lg border border-dash hidden md:block" />
        </div>
        <div className="h-6 w-28 bg-slate-100 rounded-full shrink-0" />
      </div>

      {/* Assignments DataTable Skeleton */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden">
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-3 text-left">
          <div className="col-span-1 pr-2 text-center"><div className="h-3.5 w-5 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-4 px-3"><div className="h-3.5 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-3 px-3 hidden md:block"><div className="h-3.5 w-24 bg-slate-200 rounded" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-16 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-12 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 px-2 text-center"><div className="h-3.5 w-10 bg-slate-200 rounded mx-auto" /></div>
          <div className="col-span-1 pl-2 text-right"><div className="h-3.5 w-8 bg-slate-200 rounded ml-auto" /></div>
        </div>

        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3.5 items-center">
              <div className="col-span-1 pr-2 text-center">
                <div className="h-4 w-4 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="col-span-4 px-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-dash shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-48 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="col-span-3 px-3 hidden md:block">
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-3.5 w-16 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-5 w-16 bg-slate-100 rounded-full mx-auto" />
              </div>
              <div className="col-span-1 px-2 text-center">
                <div className="h-4 w-12 bg-slate-200 rounded mx-auto" />
              </div>
              <div className="col-span-1 pl-2 flex items-center justify-end">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-dash" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 4: QUIZZES TAB SKELETON                                                */
/* -------------------------------------------------------------------------- */
export function StudentQuizzesTabSkeleton() {
  return (
    <div className="space-y-5">
      {/* Toolbar Skeleton */}
      <div className="p-4 rounded-xl bg-white border border-dash flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="h-10 w-full sm:w-72 bg-slate-100 rounded-lg border border-dash" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 bg-slate-100 rounded-lg" />
          <div className="h-9 w-24 bg-slate-100 rounded-lg" />
          <div className="h-9 w-20 bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Grid of Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((q) => (
          <div key={q} className="bg-white rounded-xl border border-dash p-5 space-y-4 shadow-2xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 bg-slate-100 rounded-md" />
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="h-5 w-44 bg-slate-200 rounded" />
              <div className="h-3.5 w-32 bg-slate-100 rounded" />
            </div>

            <div className="space-y-2 pt-2 border-t border-dash">
              <div className="flex justify-between items-center text-xs">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-3.5 w-10 bg-slate-200 rounded" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-200 rounded-full" style={{ width: `${(q * 20) % 100}%` }} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-dash">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 5: CERTIFICATES TAB SKELETON                                           */
/* -------------------------------------------------------------------------- */
export function StudentCertificatesTabSkeleton() {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-white border border-dash flex items-center justify-between shadow-2xs">
        <div className="h-10 w-72 bg-slate-100 rounded-lg border border-dash" />
        <div className="h-6 w-28 bg-slate-100 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((c) => (
          <div key={c} className="bg-white rounded-xl border border-dash p-5 space-y-4 shadow-2xs">
            {/* Certificate Header Banner Box */}
            <div className="h-28 rounded-lg bg-slate-100 border border-dash flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-5 w-44 bg-slate-200 rounded" />
              <div className="h-3.5 w-28 bg-slate-100 rounded" />
              <div className="h-3.5 w-36 bg-slate-100 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-dash">
              <div className="h-5 w-20 bg-slate-100 rounded-full" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 6: ACTIVITY LOG TAB SKELETON                                           */
/* -------------------------------------------------------------------------- */
export function StudentActivityLogTabSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-dash">
        <div className="space-y-1">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-3.5 w-52 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded-lg border border-dash" />
      </div>

      <div className="space-y-5">
        {[1, 2, 3, 4, 5, 6].map((a) => (
          <div key={a} className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-dash shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3.5 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-3.5 w-72 bg-slate-100 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TAB 7: NOTES TAB SKELETON                                                  */
/* -------------------------------------------------------------------------- */
export function StudentNotesTabSkeleton() {
  return (
    <div className="space-y-5">
      {/* Composer Card Skeleton */}
      <div className="bg-white rounded-xl border border-dash p-5 space-y-3 shadow-2xs">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-24 w-full bg-slate-50 rounded-lg border border-dash" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 bg-slate-100 rounded" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Notes List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-dash p-4 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
              </div>
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT: STUDENT DETAILS FULL PAGE SKELETON                         */
/* -------------------------------------------------------------------------- */
interface StudentDetailsSkeletonProps {
  activeTab?: StudentTabKey;
}

export function StudentDetailsSkeleton({ activeTab = "overview" }: StudentDetailsSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* 1. Breadcrumbs & Profile Banner Skeleton */}
      <div className="space-y-4">
        {/* Breadcrumb pills */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-2 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Back Button */}
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dash shrink-0" />

            {/* Avatar Photo Box */}
            <div className="w-20 h-20 rounded-2xl bg-slate-200 border-2 border-white shadow-md shrink-0" />

            {/* Name, Status, Meta */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-5 w-24 bg-slate-100 rounded-md" />
                <div className="h-4 w-40 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
            <div className="h-9 w-32 bg-slate-200 rounded-lg" />
            <div className="w-9 h-9 bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>
      </div>

      {/* 2. Tabs Bar Skeleton with Highlighted Active Tab */}
      <div className="p-1.5 bg-slate-100 rounded-xl flex items-center gap-2 overflow-x-auto border border-dash">
        {TAB_CONFIGS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <div
              key={tab.key}
              className={`h-9 px-3.5 rounded-lg shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-white shadow-xs border border-dash"
                  : "bg-slate-200/50"
              }`}
            >
              <div className={`h-3.5 ${isActive ? "w-20 bg-slate-300" : "w-16 bg-slate-200"} rounded`} />
              {tab.count !== undefined && (
                <div className="w-5 h-4 bg-slate-200 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Tab-Specific Content Skeleton */}
      {activeTab === "overview" && <StudentOverviewTabSkeleton />}
      {activeTab === "enrolled-courses" && <StudentEnrolledCoursesTabSkeleton />}
      {activeTab === "assignments" && <StudentAssignmentsTabSkeleton />}
      {activeTab === "quizzes" && <StudentQuizzesTabSkeleton />}
      {activeTab === "certificates" && <StudentCertificatesTabSkeleton />}
      {activeTab === "activity-log" && <StudentActivityLogTabSkeleton />}
      {activeTab === "notes" && <StudentNotesTabSkeleton />}
    </div>
  );
}

export default StudentDetailsSkeleton;
