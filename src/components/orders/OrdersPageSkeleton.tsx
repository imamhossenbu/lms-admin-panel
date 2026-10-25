"use client";

import React from "react";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

const COLUMNS = ["w-16", "w-24", "w-24", "w-12", "w-24", "w-14", "w-16", "w-10"];

interface OrdersPageSkeletonProps {
  /** Number of KPI cards in the stats row (Payments shows 6). */
  statCards?: number;
  /** Status pill tabs above the toolbar (Orders only). */
  showTabs?: boolean;
}

/** Skeleton for the commerce list pages (Orders, Payments). */
export function OrdersPageSkeleton({ statCards = 4, showTabs = true }: OrdersPageSkeletonProps) {
  return (
    <div className="space-y-5 text-left animate-pulse pb-8">
      {/* Breadcrumb + title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-200" />
          <Bar className="h-4 w-12" />
          <Bar className="h-3.5 w-2" />
          <Bar className="h-4 w-14" />
        </div>
        <Bar className="h-8 w-32" />
        <SoftBar className="h-4 w-96 max-w-full" />
      </div>

      {/* Stat cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
          statCards === 6 ? "lg:grid-cols-3 2xl:grid-cols-6" : "xl:grid-cols-4"
        }`}
      >
        {Array.from({ length: statCards }, (_, i) => (
          <div key={i} className="bg-white rounded-xl border border-dash p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <Bar className="h-6 w-20" />
              <SoftBar className="h-3.5 w-28" />
            </div>
            <SoftBar className="h-5 w-12 rounded-md self-end" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-dash p-5 space-y-4">
        {/* Pill tabs */}
        {showTabs && (
          <div className="bg-gray-bg p-1.5 rounded-2xl flex items-center gap-1.5 w-fit max-w-full overflow-hidden">
            {["w-16", "w-10", "w-14", "w-12", "w-16", "w-16"].map((w, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl shrink-0 ${i === 0 ? "bg-white shadow-xs" : ""}`}>
                <Bar className={`h-4 ${w}`} />
                <div className="h-4 w-8 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg border border-dash bg-white flex items-center gap-3 px-3.5">
            <div className="w-4 h-4 rounded bg-slate-100" />
            <SoftBar className="h-3.5 w-64" />
          </div>
          {["w-48", "w-44", "w-40", "w-24"].map((w, i) => (
            <div key={i} className={`h-10 ${w} rounded-lg border border-dash bg-white flex items-center px-3.5`}>
              <Bar className="h-3.5 w-3/4" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-dash overflow-hidden">
          <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
            {COLUMNS.map((w, i) => (
              <div key={i} className="flex-1 py-3 px-3.5">
                <Bar className={`h-3.5 ${w}`} />
              </div>
            ))}
          </div>
          <div className="divide-y divide-dash">
            {Array.from({ length: 10 }, (_, r) => (
              <div key={r} className="flex items-center divide-x divide-dash min-h-16">
                <div className="flex-1 px-3.5"><Bar className="h-4 w-24" /></div>
                <div className="flex-1 px-3.5 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Bar className="h-4 w-24" />
                    <SoftBar className="h-3 w-28" />
                  </div>
                </div>
                <div className="flex-1 px-3.5 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Bar className="h-3.5 w-24" />
                    <SoftBar className="h-3.5 w-16" />
                  </div>
                </div>
                <div className="flex-1 px-3.5"><Bar className="h-4 w-14" /></div>
                <div className="flex-1 px-3.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-200" />
                  <SoftBar className="h-3.5 w-16" />
                </div>
                <div className="flex-1 px-3.5"><SoftBar className="h-6 w-20 rounded-md" /></div>
                <div className="flex-1 px-3.5 space-y-1.5">
                  <SoftBar className="h-3.5 w-20" />
                  <SoftBar className="h-3 w-14" />
                </div>
                <div className="flex-1 px-3.5 flex justify-center"><div className="w-9 h-9 rounded-lg border border-dash" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <SoftBar className="h-4 w-44" />
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-lg ${i === 1 ? "bg-slate-200" : "border border-dash"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <SoftBar className="h-4 w-10" />
            <div className="h-8 w-20 rounded-lg border border-dash" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPageSkeleton;
