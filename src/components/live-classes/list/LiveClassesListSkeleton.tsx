import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

type Col = "check" | "class" | "instructor" | "date" | "attendees" | "status" | "platform" | "actions";
const COLUMNS: Col[] = ["check", "class", "instructor", "date", "attendees", "status", "platform", "actions"];
const WIDTH: Record<Col, string> = {
  check: "w-10 flex-none",
  class: "flex-1 min-w-0",
  instructor: "w-40 flex-none",
  date: "w-41 flex-none",
  attendees: "w-26 flex-none",
  status: "w-28 flex-none",
  platform: "w-37.5 flex-none",
  actions: "w-18 flex-none",
};

function CellSkeleton({ kind, row }: { kind: Col; row: number }) {
  switch (kind) {
    case "check":
      return <div className="w-4 h-4 rounded border border-dash" />;
    case "class":
      return (
        <div className="flex items-center gap-3 min-w-0">
          <Bar className="w-10 h-10 rounded-lg shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Bar className={cn("h-3.5 max-w-full", row % 2 ? "w-36" : "w-44")} />
            <Soft className="h-3 w-32" />
          </div>
        </div>
      );
    case "instructor":
      return (
        <div className="flex items-center gap-2">
          <Bar className="w-7 h-7 rounded-full shrink-0" />
          <Soft className="h-3.5 w-20" />
        </div>
      );
    case "date":
      return (
        <div className="flex items-start gap-2">
          <Soft className="w-4 h-4 rounded" />
          <div className="space-y-1.5">
            <Soft className="h-3.5 w-22" />
            <Soft className="h-3 w-28" />
          </div>
        </div>
      );
    case "attendees":
      return <Soft className="h-3.5 w-16" />;
    case "status":
      return <Soft className="h-5 w-18 rounded-md" />;
    case "platform":
      return (
        <div className="flex items-center gap-2">
          <Bar className="w-6 h-6 rounded-md" />
          <Soft className="h-3.5 w-16" />
        </div>
      );
    default:
      return <div className="w-7 h-7 rounded-lg border border-dash" />;
  }
}

export function LiveClassesTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-240">
          <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
            {COLUMNS.map((kind) => (
              <div key={kind} className={cn("py-2.5 px-3", WIDTH[kind])}>
                {kind === "check" ? <div className="w-4 h-4 rounded border border-dash" /> : <Bar className="h-3.5 w-14" />}
              </div>
            ))}
          </div>
          <div className="divide-y divide-dash">
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="flex items-stretch divide-x divide-dash min-h-15">
                {COLUMNS.map((kind) => (
                  <div key={kind} className={cn("px-3 py-2.5 flex items-center", kind === "actions" && "justify-center", WIDTH[kind])}>
                    <CellSkeleton kind={kind} row={r} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-dash flex items-center justify-between gap-3">
        <Soft className="h-3.5 w-48" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={cn("w-8 h-8 rounded-lg border border-dash", i === 1 && "bg-slate-200")} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mirrors the list page: breadcrumb/title/buttons, 5 KPI cards, filter bar and the table. */
export function LiveClassesListSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading live classes">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Soft className="w-4 h-4" />
            <Soft className="h-3.5 w-20" />
          </div>
          <Bar className="h-7 w-44" />
          <Soft className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-lg border border-dash bg-white" />
          <Bar className="h-10 w-48 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="rounded-xl border border-dash bg-white p-4 flex items-center gap-4">
            <Soft className="w-14 h-14 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Soft className="h-3.5 w-24" />
              <div className="flex items-end justify-between">
                <Bar className="h-6 w-12" />
                <div className="space-y-1 flex flex-col items-end">
                  <Soft className="h-3.5 w-10" />
                  <Soft className="h-2.5 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-card shadow-2xs p-5 space-y-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg border border-dash bg-white flex items-center gap-2 px-3.5">
            <Soft className="w-4 h-4 rounded-full" />
            <Soft className="h-3.5 w-64" />
          </div>
          {["xl:w-36", "xl:w-40", "xl:w-44", "xl:w-64", "xl:w-20"].map((w) => (
            <div key={w} className={cn("h-10 rounded-lg border border-dash bg-white flex items-center px-3.5", w)}>
              <Soft className="h-3.5 w-3/5" />
            </div>
          ))}
        </div>
        <LiveClassesTableSkeleton />
      </div>
    </div>
  );
}

export default LiveClassesListSkeleton;
