"use client";

import React from "react";

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl text-left animate-pulse">
      {/* Section 1: White-Label Identity & Branding */}
      <div className="rounded-[12px] border border-dash bg-white p-6 space-y-4 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-56 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-80 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
          </div>
        </div>
      </div>

      {/* Section 2: Color Schema Tokens */}
      <div className="rounded-[12px] border border-dash bg-white p-6 space-y-4 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-72 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 border border-dash shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 border border-dash shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-lg border border-dash" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: System Maintenance */}
      <div className="rounded-[12px] border border-dash bg-white p-6 space-y-4 shadow-2xs">
        <div className="space-y-1 pb-3 border-b border-dash">
          <div className="h-5 w-40 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-64 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-dash">
          <div className="space-y-1">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
          <div className="w-6 h-6 rounded bg-slate-200" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <div className="h-10 w-52 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

export default SettingsSkeleton;
