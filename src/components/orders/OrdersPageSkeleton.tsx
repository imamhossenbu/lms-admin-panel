"use client";

import React from "react";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

type Cell = "id" | "person" | "course" | "text" | "badge" | "method" | "date" | "menu";

const ORDER_COLUMNS: Cell[] = ["id", "person", "course", "text", "badge", "badge", "date", "menu"];
const PAYMENT_COLUMNS: Cell[] = ["id", "person", "text", "id", "method", "text", "badge", "date", "menu"];

function CellSkeleton({ kind }: { kind: Cell }) {
  switch (kind) {
    case "id":
    case "date":
      return (
        <div className="space-y-1.5">
          <Bar className="h-4 w-24" />
          <SoftBar className="h-3 w-20" />
        </div>
      );
    case "person":
    case "course":
      return (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 shrink-0 bg-slate-200 ${kind === "person" ? "rounded-full" : "rounded-lg"}`} />
          <div className="space-y-1.5 flex-1">
            <Bar className="h-4 w-28" />
            <SoftBar className="h-3 w-32" />
          </div>
        </div>
      );
    case "badge":
      return <SoftBar className="h-6 w-20 rounded-md" />;
    case "method":
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-200" />
          <SoftBar className="h-3.5 w-14" />
        </div>
      );
    case "menu":
      return <div className="w-9 h-9 rounded-lg border border-dash mx-auto" />;
    default:
      return <SoftBar className="h-4 w-14" />;
  }
}

interface OrdersPageSkeletonProps {
  /** Orders shows Create/Export buttons and 3 filters; Payments shows Export and 2 filters. */
  variant?: "orders" | "payments";
}

/** Skeleton for the commerce list pages (Orders, Payments). */
export function OrdersPageSkeleton({ variant = "orders" }: OrdersPageSkeletonProps) {
  const columns = variant === "orders" ? ORDER_COLUMNS : PAYMENT_COLUMNS;
  const wide: Cell[] = ["person", "course"];

  return (
    <div className="space-y-5 text-left animate-pulse pb-8">
      {/* Title + header actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          {variant === "payments" && <Bar className="h-4 w-40" />}
          <Bar className="h-8 w-36" />
          <SoftBar className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-3">
          {variant === "orders" && <div className="h-11 w-28 rounded-lg border border-dash bg-white" />}
          <div className="h-11 w-36 rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* 5 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-dash p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <SoftBar className="h-3.5 w-24" />
              <div className="flex items-end justify-between">
                <Bar className="h-7 w-20" />
                <div className="space-y-1">
                  <SoftBar className="h-3.5 w-10" />
                  <SoftBar className="h-2.5 w-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-dash p-5 space-y-4">
        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg border border-dash bg-white flex items-center gap-3 px-3.5">
            <div className="w-4 h-4 rounded bg-slate-100" />
            <SoftBar className="h-3.5 w-56" />
          </div>
          {(variant === "orders" ? ["w-40", "w-44", "w-52"] : ["w-44", "w-44"]).map((w, i) => (
            <div key={i} className={`h-10 ${w} rounded-lg border border-dash bg-white flex items-center px-3.5`}>
              <Bar className="h-3.5 w-3/4" />
            </div>
          ))}
          <div className="h-10 w-64 rounded-lg border border-dash bg-white flex items-center gap-2.5 px-3.5">
            <div className="w-4 h-4 rounded bg-slate-200" />
            <SoftBar className="h-3.5 w-32" />
          </div>
          <div className="h-10 w-20 rounded-lg border border-dash bg-white" />
        </div>

        {/* Table + attached pagination */}
        <div className="rounded-lg border border-dash overflow-hidden">
          <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
            {columns.map((kind, i) => (
              <div key={i} className={`py-3 px-3.5 ${wide.includes(kind) ? "flex-2" : "flex-1"}`}>
                <Bar className="h-3.5 w-16" />
              </div>
            ))}
          </div>
          <div className="divide-y divide-dash">
            {Array.from({ length: 10 }, (_, r) => (
              <div key={r} className="flex items-center divide-x divide-dash min-h-16">
                {columns.map((kind, i) => (
                  <div key={i} className={`px-3.5 py-3 ${wide.includes(kind) ? "flex-2" : "flex-1"}`}>
                    <CellSkeleton kind={kind} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-dash flex items-center justify-between">
            <SoftBar className="h-4 w-44" />
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-lg ${i === 1 ? "bg-slate-200" : "border border-dash"}`} />
              ))}
              <div className="h-8 w-29 ml-2 rounded-lg border border-dash" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPageSkeleton;
