"use client";

import React from "react";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

function InputSkeleton({ labelWidth, placeholderWidth = "w-48" }: { labelWidth: string; placeholderWidth?: string }) {
  return (
    <div className="space-y-2">
      <Bar className={`h-4 ${labelWidth}`} />
      <div className="h-11 rounded-lg border border-dash bg-white flex items-center justify-between px-3.5">
        <SoftBar className={`h-3.5 ${placeholderWidth}`} />
      </div>
    </div>
  );
}

export function NoteFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* Breadcrumb + compact profile header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-20" />
          <Bar className="h-4 w-2" />
          <Bar className="h-4 w-28" />
          <Bar className="h-4 w-2" />
          <Bar className="h-4 w-20" />
        </div>
        <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 flex gap-5">
          <div className="h-10 w-44 rounded-lg border border-dash bg-white shrink-0" />
          <div className="w-28 h-28 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <Bar className="h-8 w-56" />
              <SoftBar className="h-6 w-16 rounded-md" />
            </div>
            <div className="flex gap-5">
              <SoftBar className="h-4 w-44" />
              <SoftBar className="h-4 w-32" />
              <SoftBar className="h-4 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Form + side info */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-5">
          <div className="space-y-2">
            <Bar className="h-8 w-40" />
            <SoftBar className="h-4 w-96 max-w-full" />
          </div>
          <InputSkeleton labelWidth="w-24" placeholderWidth="w-56" />
          <div className="space-y-2">
            <Bar className="h-4 w-28" />
            <div className="rounded-lg border border-dash overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-dash bg-slate-50">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="w-5 h-5 rounded bg-slate-200" />
                ))}
              </div>
              <div className="h-36 p-3.5">
                <SoftBar className="h-3.5 w-40" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputSkeleton labelWidth="w-20" placeholderWidth="w-32" />
            <InputSkeleton labelWidth="w-16" placeholderWidth="w-28" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-6 rounded-full bg-slate-200" />
            <SoftBar className="h-4 w-44" />
          </div>
          <InputSkeleton labelWidth="w-28" placeholderWidth="w-40" />
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-36 rounded-lg bg-slate-200" />
            <div className="h-12 w-28 rounded-lg border border-dash bg-white" />
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="rounded-xl border border-dash p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-200" />
              <Bar className="h-5 w-40" />
            </div>
            {["bg-blue-14", "bg-green-bg", "bg-yellow-bg"].map((bg, i) => (
              <div key={bg} className={`rounded-xl p-5 flex gap-4 ${bg}`}>
                <div className="w-6 h-6 rounded bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Bar className="h-4 w-32" />
                  {i < 2 ? (
                    <>
                      <SoftBar className="h-3.5 w-full" />
                      <SoftBar className="h-3.5 w-4/5" />
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {["w-20", "w-16", "w-12", "w-20", "w-16"].map((w, j) => (
                        <div key={j} className={`h-6 ${w} rounded-md border border-dash bg-white`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteFormSkeleton;
