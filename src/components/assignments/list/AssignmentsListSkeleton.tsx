"use client";

import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

type Col = "check" | "num" | "title" | "twoLine" | "badge" | "progress" | "actions";
const COLUMNS: Col[] = ["check", "num", "title", "twoLine", "badge", "twoLine", "progress", "badge", "actions"];
const WIDTH: Record<Col, string> = {
  check: "w-12 flex-none",
  num: "w-14 flex-none",
  title: "flex-2",
  twoLine: "flex-2",
  badge: "flex-1",
  progress: "flex-1",
  actions: "w-40 flex-none",
};

function CellSkeleton({ kind }: { kind: Col }) {
  if (kind === "check") return <div className="w-4 h-4 rounded border border-dash" />;
  if (kind === "num") return <Soft className="h-4 w-4" />;
  if (kind === "title") return <Bar className="h-4 w-40" />;
  if (kind === "twoLine")
    return (
      <div className="space-y-1.5">
        <Soft className="h-3.5 w-32" />
        <Soft className="h-3 w-24" />
      </div>
    );
  if (kind === "badge") return <Soft className="h-6 w-20 rounded-md" />;
  if (kind === "progress")
    return (
      <div className="space-y-2">
        <Soft className="h-3.5 w-12" />
        <Soft className="h-1.5 w-full rounded-full" />
      </div>
    );
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-9 h-9 rounded-lg border border-dash" />
      ))}
    </div>
  );
}

export function AssignmentsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-240">
          <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
            {COLUMNS.map((kind, i) => (
              <div key={i} className={cn("py-3 px-3.5", WIDTH[kind])}>
                {kind === "check" ? <div className="w-4 h-4 rounded border border-dash" /> : <Bar className="h-3.5 w-14" />}
              </div>
            ))}
          </div>
          <div className="divide-y divide-dash">
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="flex items-center divide-x divide-dash min-h-16">
                {COLUMNS.map((kind, i) => (
                  <div key={i} className={cn("px-3.5 py-3", WIDTH[kind])}>
                    <CellSkeleton kind={kind} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-dash flex items-center justify-between">
        <Soft className="h-4 w-48" />
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("w-8 h-8 rounded-lg", i === 1 ? "bg-slate-200" : "border border-dash")} />
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
        <div key={i} className="dashboard-card p-4 space-y-3.5">
          <div className="flex justify-between">
            <Soft className="h-6 w-24 rounded-md" />
            <Soft className="h-6 w-20 rounded-md" />
          </div>
          <Bar className="h-5 w-3/4" />
          <Soft className="h-3.5 w-2/3" />
          <Soft className="h-3.5 w-1/2" />
          <Soft className="h-4 w-48" />
          <Soft className="h-1.5 w-full rounded-full" />
          <div className="pt-3 border-t border-dash flex justify-end gap-2">
            {[0, 1, 2].map((j) => (
              <div key={j} className="w-9 h-9 rounded-lg border border-dash" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Full-page skeleton: header + banner, 4 stat tiles, tab bar, filter row and table (or card grid). */
export function AssignmentsListSkeleton({ view = "table" }: { view?: "table" | "grid" }) {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading assignments">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-3">
          <Soft className="h-4 w-72" />
          <Bar className="h-8 w-52" />
          <Soft className="h-4 w-96 max-w-full" />
        </div>
        <div className="dashboard-card p-3 flex items-center gap-4">
          <div className="w-40 aspect-video rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bar className="h-5 w-40" />
              <Soft className="h-6 w-20 rounded-md" />
            </div>
            <Soft className="h-4 w-52" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="dashboard-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <Bar className="h-6 w-14" />
              <Soft className="h-3.5 w-32" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-dash pb-2">
        <div className="flex gap-6">
          {["w-28", "w-24", "w-16", "w-14"].map((w) => (
            <Soft key={w} className={cn("h-5", w)} />
          ))}
        </div>
        <div className="h-11 w-48 rounded-xl bg-slate-200" />
      </div>

      <div className="dashboard-card p-5 space-y-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg border border-dash" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 xl:w-44 rounded-lg border border-dash" />
          ))}
          <div className="h-10 w-20 rounded-lg border border-dash" />
          <div className="h-10 w-20 rounded-lg border border-dash" />
        </div>
        {view === "grid" ? <GridSkeleton /> : <AssignmentsTableSkeleton />}
      </div>
    </div>
  );
}

export default AssignmentsListSkeleton;
