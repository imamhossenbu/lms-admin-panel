"use client";

import React from "react";

export function StudentDetailsSkeleton() {
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

      {/* 2. Tabs Bar Skeleton */}
      <div className="p-1.5 bg-slate-100 rounded-xl flex items-center gap-2 overflow-x-auto border border-dash">
        <div className="h-9 w-28 bg-white rounded-lg shadow-xs shrink-0" />
        <div className="h-9 w-36 bg-slate-200/60 rounded-lg shrink-0" />
        <div className="h-9 w-32 bg-slate-200/60 rounded-lg shrink-0" />
        <div className="h-9 w-24 bg-slate-200/60 rounded-lg shrink-0 hidden sm:block" />
        <div className="h-9 w-28 bg-slate-200/60 rounded-lg shrink-0 hidden md:block" />
        <div className="h-9 w-28 bg-slate-200/60 rounded-lg shrink-0 hidden lg:block" />
        <div className="h-9 w-20 bg-slate-200/60 rounded-lg shrink-0 hidden lg:block" />
      </div>

      {/* 3. Top Row: Student Information Overview + Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Student Information Overview Card */}
        <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          {/* Header */}
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

          {/* 5 Rows */}
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

        {/* Card 2: Learning Progress Card */}
        <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs flex flex-col justify-between space-y-5">
          {/* Header */}
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

          {/* Donut Progress Centerpiece */}
          <div className="flex flex-col items-center justify-center py-4 my-auto space-y-3">
            <div className="relative w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
              <div className="text-center space-y-1">
                <div className="h-7 w-12 bg-slate-200 rounded mx-auto" />
                <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dash">
            <div className="p-3 rounded-lg bg-slate-50 border border-dash space-y-1.5 text-center">
              <div className="h-5 w-10 bg-slate-200 rounded mx-auto" />
              <div className="h-3 w-14 bg-slate-100 rounded mx-auto" />
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-dash space-y-1.5 text-center">
              <div className="h-5 w-10 bg-slate-200 rounded mx-auto" />
              <div className="h-3 w-14 bg-slate-100 rounded mx-auto" />
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-dash space-y-1.5 text-center">
              <div className="h-5 w-10 bg-slate-200 rounded mx-auto" />
              <div className="h-3 w-14 bg-slate-100 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Enrolled Courses Mini Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card 3: Enrolled Courses Mini Table (Col 8) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-dash p-6 shadow-2xs space-y-5">
          {/* Header */}
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

          {/* Mini Table Skeleton with column-wise vertical borders */}
          <div className="rounded-lg border border-dash overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-dash divide-x divide-dash py-2.5 px-3">
              <div className="col-span-1 h-3.5 bg-slate-200 rounded" />
              <div className="col-span-5 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
              <div className="col-span-2 h-3.5 bg-slate-200 rounded pl-2" />
            </div>

            {/* 3 Table Rows */}
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

        {/* Card 4: Recent Activity Timeline (Col 4) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-dash p-6 shadow-2xs space-y-5">
          {/* Header */}
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

          {/* Timeline items */}
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

export default StudentDetailsSkeleton;
