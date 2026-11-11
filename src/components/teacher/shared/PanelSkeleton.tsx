import React from "react";
import { TableSkeleton } from "@/components/website/shared/TableSkeleton";

/** Page header, stat tiles (optional) and a table — the shape of most teacher pages while loading. */
export function PanelSkeleton({ stats = 0, cols = 5 }: { stats?: number; cols?: number }) {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-2">
        <span className="block h-7 w-48 rounded-lg bg-slate-200" />
        <span className="block h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
      {stats > 0 && (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: stats }, (_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-dash bg-white p-5">
              <span className="h-12 w-12 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <span className="block h-3 w-24 rounded bg-slate-100" />
                <span className="block h-6 w-12 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-4 rounded-xl border border-dash bg-white p-5">
        <div className="flex gap-3">
          <span className="h-10 w-80 max-w-full rounded-lg border border-dash" />
          <span className="h-10 w-56 rounded-lg border border-dash" />
        </div>
        <TableSkeleton cols={cols} rows={6} />
      </div>
    </div>
  );
}

export default PanelSkeleton;
