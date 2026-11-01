import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className?: string }) => <div className={cn("rounded-md bg-slate-200", className)} />;
const Soft = ({ className }: { className?: string }) => <div className={cn("rounded-md bg-slate-100", className)} />;

const TAB_WIDTHS = ["w-20", "w-24", "w-24", "w-20", "w-24", "w-16", "w-24", "w-28", "w-28"];

/** One settings card: icon tile + title/description, then label-left / control-right rows with dividers. */
function CardSkeleton({ rows, controls }: { rows: number; controls?: ("input" | "textarea" | "cards")[] }) {
  return (
    <div className="dashboard-card shadow-2xs p-5">
      <div className="flex items-center gap-3.5">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <Bar className="h-4 w-36" />
          <Soft className="h-3 w-64 max-w-full" />
        </div>
      </div>
      <div className="mt-4 divide-y divide-dash border-t border-dash">
        {Array.from({ length: rows }, (_, i) => {
          const kind = controls?.[i] ?? "input";
          return (
            <div key={i} className="flex flex-col gap-2.5 py-4 last:pb-0 md:flex-row md:gap-8">
              <div className="space-y-1.5 md:w-2/5 md:max-w-64 md:pt-2">
                <Bar className="h-3.5 w-28" />
                <Soft className="h-3 w-44 max-w-full" />
              </div>
              <div className="min-w-0 flex-1">
                {kind === "textarea" ? (
                  <div className="h-20 w-full rounded-lg border border-dash bg-slate-100" />
                ) : kind === "cards" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1].map((c) => (
                      <div key={c} className="flex items-start gap-3 rounded-xl border border-dash p-3.5">
                        <div className="h-5 w-5 shrink-0 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-1.5">
                          <Bar className="h-3.5 w-20" />
                          <Soft className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-10 w-full items-center rounded-lg border border-dash bg-white px-3.5">
                    <Soft className="h-3 w-1/2" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Mirrors /settings: header + status pill, capsule tab bar, section header, cards (8/12) + preview aside (4/12). */
export function SettingsSkeleton() {
  return (
    <div className="space-y-5 pb-8 text-left animate-pulse" aria-busy="true" aria-label="Loading settings">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Soft className="h-4 w-4" />
            <Soft className="h-3 w-3" />
            <Bar className="h-3.5 w-16" />
          </div>
          <Bar className="h-7 w-32" />
          <Soft className="h-3.5 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-dash bg-white py-1.5 pl-3.5 pr-1.5">
          <Soft className="h-3 w-20" />
          <div className="h-6 w-36 rounded-full bg-green-bg" />
        </div>
      </div>

      {/* Capsule tabs */}
      <div className="flex w-fit max-w-full items-center gap-1.5 overflow-hidden rounded-2xl border border-dash bg-gray-bg p-1.5">
        {TAB_WIDTHS.map((w, i) => (
          <div key={i} className={cn("flex h-9 shrink-0 items-center gap-2 rounded-xl px-4", i === 0 && "border border-dash bg-white")}>
            <div className="h-4 w-4 rounded bg-slate-200" />
            <Bar className={cn("h-3", w === "w-16" ? "w-10" : w === "w-20" ? "w-12" : "w-16")} />
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-brand-orange-light" />
          <div className="space-y-2">
            <Bar className="h-5 w-28" />
            <Soft className="h-3.5 w-72 max-w-full" />
          </div>
        </div>
        <div className="hidden h-7 w-40 rounded-full border border-dash bg-gray-bg sm:block" />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={3} controls={["input", "input", "textarea"]} />
          <CardSkeleton rows={3} controls={["input", "input", "cards"]} />
        </div>

        <div className="space-y-5 xl:col-span-4">
          {/* Preview card */}
          <div className="dashboard-card shadow-2xs p-5">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <Bar className="h-4 w-28" />
                <Soft className="h-3 w-40" />
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-dash">
              <div className="flex items-center gap-2 border-b border-dash bg-gray-bg px-3 py-2.5">
                <div className="h-6 w-6 rounded-md bg-brand-orange-light" />
                <Bar className="h-3 w-24" />
              </div>
              <div className="space-y-3 p-4">
                <Bar className="h-4 w-3/4" />
                <Soft className="h-3 w-full" />
                {[0, 1, 2].map((r) => (
                  <div key={r} className="flex items-center justify-between">
                    <Soft className="h-3 w-16" />
                    <Bar className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Recent changes */}
          <div className="dashboard-card shadow-2xs p-5">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <Bar className="h-4 w-32" />
                <Soft className="h-3 w-44" />
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {[0, 1].map((r) => (
                <div key={r} className="flex items-start gap-3">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1.5">
                    <Bar className="h-3 w-full" />
                    <Soft className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSkeleton;
