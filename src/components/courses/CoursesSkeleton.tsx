"use client";

import React from "react";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

const COLUMNS = ["course", "person", "badge", "text", "text", "text", "text", "badge", "menu"] as const;

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
        {COLUMNS.map((kind, i) => (
          <div key={i} className={`py-3 px-3.5 ${kind === "course" ? "flex-3" : "flex-1"}`}>
            <Bar className="h-3.5 w-14" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: 10 }, (_, r) => (
          <div key={r} className="flex items-center divide-x divide-dash min-h-16">
            {COLUMNS.map((kind, i) => (
              <div key={i} className={`px-3.5 py-3 ${kind === "course" ? "flex-3" : "flex-1"}`}>
                {kind === "course" ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-11 rounded-lg bg-slate-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Bar className="h-4 w-40" />
                      <SoftBar className="h-3 w-28" />
                    </div>
                  </div>
                ) : kind === "person" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200" />
                    <SoftBar className="h-3.5 w-20" />
                  </div>
                ) : kind === "badge" ? (
                  <SoftBar className="h-6 w-20 rounded-md" />
                ) : kind === "menu" ? (
                  <div className="w-9 h-9 rounded-lg border border-dash mx-auto" />
                ) : (
                  <SoftBar className="h-4 w-14" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-dash flex items-center justify-between">
        <SoftBar className="h-4 w-44" />
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-lg ${i === 1 ? "bg-slate-200" : "border border-dash"}`} />
          ))}
          <div className="h-8 w-29 ml-2 rounded-lg border border-dash" />
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded-xl border border-dash overflow-hidden bg-white">
          <div className="h-40 bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <SoftBar className="h-5 w-20 rounded-md" />
              <SoftBar className="h-5 w-16 rounded-md" />
            </div>
            <Bar className="h-5 w-3/4" />
            <SoftBar className="h-3.5 w-full" />
            <div className="flex items-center justify-between pt-2 border-t border-dash">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200" />
                <SoftBar className="h-3.5 w-20" />
              </div>
              <Bar className="h-5 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for the Courses list page (header, KPI cards, filters, table or grid). */
export function CoursesSkeleton({ view = "table" }: { view?: "table" | "grid" }) {
  return (
    <div className="space-y-5 text-left animate-pulse pb-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <Bar className="h-4 w-28" />
          <Bar className="h-8 w-32" />
          <SoftBar className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-32 rounded-lg border border-dash bg-white" />
          <div className="h-11 w-32 rounded-lg border border-dash bg-white" />
          <div className="h-11 w-40 rounded-lg bg-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-dash p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <SoftBar className="h-3.5 w-24" />
              <Bar className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-dash p-5 space-y-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg border border-dash bg-white flex items-center gap-3 px-3.5">
            <div className="w-4 h-4 rounded bg-slate-100" />
            <SoftBar className="h-3.5 w-56" />
          </div>
          {["w-40", "w-48", "w-40"].map((w, i) => (
            <div key={i} className={`h-10 ${w} rounded-lg border border-dash bg-white flex items-center px-3.5`}>
              <Bar className="h-3.5 w-3/4" />
            </div>
          ))}
          <div className="h-10 w-20 rounded-lg border border-dash bg-white" />
          <div className="h-10 w-36 rounded-lg border border-dash bg-white" />
        </div>
        {view === "grid" ? <GridSkeleton /> : <TableSkeleton />}
      </div>
    </div>
  );
}

export default CoursesSkeleton;
