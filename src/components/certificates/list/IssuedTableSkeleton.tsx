"use client";

import React from "react";

/** Issued table while its first page loads: header + rows with code, recipient avatar, course, badges and actions. */
export function IssuedTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-dash overflow-hidden animate-pulse" aria-busy="true" aria-label="Loading certificates">
      <div className="grid grid-cols-[40px_1.3fr_1.6fr_1.2fr_110px_110px_90px] divide-x divide-dash bg-slate-50 border-b border-dash">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="px-3.5 py-3">
            <div className="h-3 w-14 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid grid-cols-[40px_1.3fr_1.6fr_1.2fr_110px_110px_90px] divide-x divide-dash border-b border-dash last:border-b-0">
          <div className="px-3.5 py-3">
            <div className="h-4 w-4 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3 space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-16 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-2.5 w-36 rounded bg-slate-100" />
            </div>
          </div>
          <div className="px-3.5 py-3">
            <div className="h-3 w-32 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3">
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="px-3.5 py-3">
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3 flex gap-1.5">
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default IssuedTableSkeleton;
