"use client";

import React from "react";

const Line = ({ className = "" }: { className?: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const Soft = ({ className = "" }: { className?: string }) => <div className={`rounded-lg bg-slate-100 ${className}`} />;

const FieldSkeleton = ({ tall = false, counter = true }: { tall?: boolean; counter?: boolean }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Line className="h-4 w-28" />
      {counter && <Line className="h-3 w-12 bg-slate-100" />}
    </div>
    <Soft className={`w-full border border-dash ${tall ? "h-20" : "h-10"}`} />
  </div>
);

const MediaSkeleton = () => (
  <div className="space-y-2">
    <Line className="h-4 w-32" />
    <div className="grid grid-cols-2 gap-3">
      <div className="aspect-video rounded-xl bg-slate-200 relative">
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100" />
      </div>
      <div className="aspect-video rounded-xl border-2 border-dashed border-dash flex flex-col items-center justify-center gap-1.5">
        <Soft className="w-5 h-5 rounded" />
        <Line className="h-3 w-24" />
        <Line className="h-2.5 w-20 bg-slate-100" />
        <Line className="h-2.5 w-28 bg-slate-100" />
      </div>
    </div>
  </div>
);

/** Mirrors the Create Course layout: header, stepper, Basic Information form and preview column. */
export function CourseCreateSkeleton() {
  return (
    <div className="space-y-5 text-left pb-10 animate-pulse" aria-busy="true" aria-label="Loading course form">
      {/* Breadcrumb + title + header actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Line className="h-4 w-4" />
          <Line className="h-3.5 w-16" />
          <Line className="h-3.5 w-24" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <Line className="h-8 w-72" />
            <Line className="h-4 w-96 max-w-full bg-slate-100" />
          </div>
          <div className="flex gap-3">
            <Soft className="h-10 w-36 border border-dash" />
            <div className="h-10 w-40 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="dashboard-card px-5 py-4 flex items-center gap-3 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-full shrink-0 ${i === 0 ? "bg-slate-300" : "bg-slate-100 border border-dash"}`} />
            <div className="space-y-1.5 min-w-0">
              <Line className="h-3.5 w-24" />
              <Line className="h-3 w-28 bg-slate-100" />
            </div>
            {i < 4 && <div className="hidden xl:block h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Basic Information */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-dash p-5 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Line className="h-5 w-44" />
              <Line className="h-3.5 w-80 max-w-full bg-slate-100" />
            </div>
            <div className="h-10 w-40 rounded-lg bg-slate-100 border border-dash" />
          </div>
          <FieldSkeleton />
          <FieldSkeleton tall />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Line className="h-4 w-32" />
              <Line className="h-3 w-16 bg-slate-100" />
            </div>
            <div className="rounded-lg border border-dash overflow-hidden">
              <div className="h-10 bg-slate-100 border-b border-dash flex items-center gap-2 px-3">
                {Array.from({ length: 9 }, (_, i) => (
                  <Line key={i} className="h-4 w-5" />
                ))}
              </div>
              <div className="p-4 space-y-2.5">
                <Line className="h-3 w-full bg-slate-100" />
                <Line className="h-3 w-11/12 bg-slate-100" />
                <Line className="h-3 w-3/4 bg-slate-100" />
                <Line className="h-3 w-1/2 bg-slate-100" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MediaSkeleton />
            <MediaSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <FieldSkeleton key={i} counter={false} />
            ))}
          </div>
          <div className="space-y-2">
            <Line className="h-4 w-12" />
            <div className="h-11 rounded-lg border border-dash flex items-center gap-2 px-3">
              {["w-14", "w-12", "w-20", "w-14"].map((w, i) => (
                <div key={i} className={`h-6 rounded-md bg-slate-100 ${w}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Preview column */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-xl border border-dash p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Line className="h-5 w-36" />
              <Soft className="w-8 h-8" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl bg-slate-200 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-slate-100" />
              </div>
              <div className="space-y-2">
                <Line className="h-4 w-full" />
                <Line className="h-4 w-3/4" />
                <Line className="h-3 w-2/3 bg-slate-100" />
                <Line className="h-3 w-1/2 bg-slate-100" />
              </div>
            </div>
            <div className="h-12 rounded-2xl bg-slate-100 flex items-center gap-1.5 p-1.5">
              <div className="h-full w-24 rounded-xl bg-white" />
              <Line className="h-3 w-16 mx-2" />
              <Line className="h-3 w-16 mx-2" />
            </div>
            <div className="rounded-xl border border-dash p-4 space-y-2.5">
              <Line className="h-4 w-36" />
              <Line className="h-3 w-full bg-slate-100" />
              <Line className="h-3 w-5/6 bg-slate-100" />
              <div className="pt-3 border-t border-dash flex flex-wrap gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Line key={i} className="h-3.5 w-20 bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-dash p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Line className="h-3.5 w-28" />
                <Line className="h-3 w-36 bg-slate-100" />
              </div>
              <Soft className="h-8 w-32 border border-dash" />
            </div>
            <div className="rounded-xl border border-dash p-4 space-y-3">
              <Line className="h-4 w-32" />
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-slate-200 shrink-0" />
                  <Line className={`h-3 bg-slate-100 ${["w-4/5", "w-2/3", "w-3/4", "w-1/2"][i]}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-dash p-4 flex justify-end gap-3">
            <Soft className="h-10 w-24 border border-dash" />
            <div className="h-10 w-52 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCreateSkeleton;
