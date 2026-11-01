"use client";

import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

function CardHead({ titleWidth = "w-40" }: { titleWidth?: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="h-11 w-11 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-2 flex-1">
        <Bar className={cn("h-4", titleWidth)} />
        <Soft className="h-3.5 w-64 max-w-full" />
      </div>
    </div>
  );
}

function Field({ label = "w-20", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Soft className={cn("h-3.5", label)} />
      <div className="h-10 rounded-lg border border-dash" />
    </div>
  );
}

function ChoiceCards({ count }: { count: number }) {
  return (
    <div className={cn("grid gap-3", count === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-dash p-3.5 flex gap-3">
          <div className="h-5 w-5 rounded-full border border-dash shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Bar className="h-3.5 w-20" />
            <Soft className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleRow() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-6 w-11 rounded-full bg-slate-200 shrink-0" />
      <div className="space-y-1.5">
        <Bar className="h-3.5 w-28" />
        <Soft className="h-3 w-52" />
      </div>
    </div>
  );
}

/** Mirrors the Create / Edit Assignment layout: header, Basic Information, Attachments, Settings, Grading, Visibility. */
export function AssignmentFormSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading assignment form">
      <div className="space-y-3">
        <Soft className="h-4 w-96 max-w-full" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <Bar className="h-8 w-64" />
            <Soft className="h-4 w-md max-w-full" />
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-52 rounded-xl border border-dash" />
            <div className="h-11 w-48 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 space-y-5">
          <div className="dashboard-card p-5 space-y-5">
            <CardHead />
            <Field />
            <div className="space-y-2">
              <Soft className="h-3.5 w-24" />
              <div className="rounded-lg border border-dash overflow-hidden">
                <div className="h-10 bg-gray-bg border-b border-dash flex items-center gap-2 px-3">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="h-5 w-5 rounded bg-slate-200" />
                  ))}
                </div>
                <div className="p-3.5 space-y-2 h-36">
                  <Soft className="h-3.5 w-full" />
                  <Soft className="h-3.5 w-5/6" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="w-16" />
              <Field label="w-28" />
            </div>
            <ChoiceCards count={2} />
          </div>
          <div className="dashboard-card p-5 space-y-5">
            <CardHead titleWidth="w-52" />
            <div className="rounded-xl border-2 border-dashed border-dash py-10 flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <Bar className="h-3.5 w-64" />
                <Soft className="h-3 w-44" />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-5">
          <div className="dashboard-card p-5 space-y-4">
            <CardHead titleWidth="w-44" />
            <div className="grid grid-cols-2 gap-4">
              <Field />
              <Field />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="w-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="w-32" />
              <Field label="w-28" />
            </div>
          </div>
          <div className="dashboard-card p-5 space-y-5">
            <CardHead titleWidth="w-36" />
            <ChoiceCards count={3} />
            <ToggleRow />
            <ToggleRow />
          </div>
          <div className="dashboard-card p-5 space-y-5">
            <CardHead titleWidth="w-24" />
            <ChoiceCards count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentFormSkeleton;
