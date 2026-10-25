"use client";

import React from "react";

function CardHeaderSkeleton({ titleWidth = "w-44", descWidth = "w-80" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
      <div className="space-y-1.5">
        <div className={`h-5 ${titleWidth} bg-slate-200 rounded-md`} />
        <div className={`h-4 ${descWidth} max-w-full bg-slate-100 rounded`} />
      </div>
    </div>
  );
}

function FieldSkeleton({ labelWidth }: { labelWidth: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-4 ${labelWidth} bg-slate-200 rounded`} />
      <div className="h-10 w-full rounded-lg border border-dash bg-white flex items-center gap-3 px-3">
        <div className="w-4 h-4 rounded bg-slate-100" />
        <div className="h-3.5 w-32 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function InstructorFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
          <div className="h-4 w-2 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-40 rounded-lg border border-dash bg-white" />
          <div className="w-11 h-11 rounded-full bg-slate-100 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-7 w-56 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Information */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
            <CardHeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldSkeleton labelWidth="w-20" />
              <FieldSkeleton labelWidth="w-28" />
              <FieldSkeleton labelWidth="w-36" />
              <FieldSkeleton labelWidth="w-14" />
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs flex gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-24 bg-slate-200 rounded-md mt-2.5" />
              <div className="rounded-xl border border-dash bg-slate-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-72 max-w-full bg-slate-200 rounded" />
                    <div className="h-3.5 w-96 max-w-full bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 pl-8">
                  {["w-24", "w-48", "w-40"].map((w) => (
                    <div key={w} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-slate-200" />
                      <div className={`h-3.5 ${w} bg-slate-200 rounded`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assign courses */}
          <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <CardHeaderSkeleton titleWidth="w-48" descWidth="w-96" />
              <div className="flex gap-2.5">
                <div className="h-10 w-56 rounded-lg border border-dash bg-white" />
                <div className="h-10 w-36 rounded-lg border border-dash bg-white" />
              </div>
            </div>
            <div className="rounded-lg border border-dash overflow-hidden">
              <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
                <div className="w-10 py-3 px-3"><div className="w-4 h-4 rounded bg-slate-200" /></div>
                <div className="w-12 py-3 px-3"><div className="h-3.5 w-3 bg-slate-200 rounded" /></div>
                <div className="flex-3 py-3 px-3"><div className="h-3.5 w-20 bg-slate-200 rounded" /></div>
                <div className="flex-2 py-3 px-3"><div className="h-3.5 w-16 bg-slate-200 rounded" /></div>
                <div className="flex-1 py-3 px-3"><div className="h-3.5 w-14 bg-slate-200 rounded" /></div>
                <div className="flex-1 py-3 px-3"><div className="h-3.5 w-14 bg-slate-200 rounded" /></div>
                <div className="flex-1 py-3 px-3"><div className="h-3.5 w-10 bg-slate-200 rounded" /></div>
              </div>
              <div className="divide-y divide-dash">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center divide-x divide-dash">
                    <div className="w-10 py-3 px-3"><div className="w-4 h-4 rounded border border-dash" /></div>
                    <div className="w-12 py-3 px-3"><div className="h-3.5 w-3 bg-slate-100 rounded" /></div>
                    <div className="flex-3 py-3 px-3 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-200 shrink-0" />
                      <div className="h-4 w-36 bg-slate-200 rounded" />
                    </div>
                    <div className="flex-2 py-3 px-3"><div className="h-4 w-28 bg-slate-100 rounded" /></div>
                    <div className="flex-1 py-3 px-3"><div className="h-4 w-8 bg-slate-100 rounded" /></div>
                    <div className="flex-1 py-3 px-3"><div className="h-4 w-14 bg-slate-100 rounded" /></div>
                    <div className="flex-1 py-3 px-3"><div className="h-4 w-10 bg-slate-100 rounded" /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-44 rounded-lg border border-dash bg-slate-50" />
              <div className="h-8 w-52 rounded-lg border border-dash bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-dash p-5 shadow-2xs space-y-5">
            <CardHeaderSkeleton titleWidth="w-36" descWidth="w-0" />
            <div className="rounded-lg border border-dash p-4 divide-y divide-dash">
              {["w-32", "w-44", "w-28", "w-16", "w-20"].map((w, i) => (
                <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-slate-100" />
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                  </div>
                  <div className={`h-4 ${w} bg-slate-200 rounded`} />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-dash bg-slate-50 p-6 space-y-4">
              <div className="h-5 w-40 bg-slate-200 rounded-md" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                  <div className="h-4 w-56 bg-slate-100 rounded mt-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto flex justify-end gap-3">
            <div className="h-12 w-28 rounded-lg border border-dash bg-white" />
            <div className="h-12 w-48 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorFormSkeleton;
