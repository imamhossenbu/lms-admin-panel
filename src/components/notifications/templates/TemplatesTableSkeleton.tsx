import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const COLS = ["flex-1", "w-57", "w-32", "w-37", "w-30", "w-27"];

/** Mirrors the Templates tab card: icon header + 6-column table with vertical borders. */
export function TemplatesTableSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <div className="dashboard-card space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-96 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-xl border border-dash">
        <div className="flex divide-x divide-dash border-b border-dash bg-gray-bg">
          {COLS.map((w, i) => (
            <div key={i} className={`${w} shrink-0 px-3.5 py-3`}>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex divide-x divide-dash border-b border-dash last:border-b-0">
            <div className="min-w-0 flex-1 space-y-1.5 px-3.5 py-3">
              <Skeleton className={r % 2 ? "h-3.5 w-36" : "h-3.5 w-48"} />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex w-57 shrink-0 items-center gap-1.5 px-3.5 py-3">
              <Skeleton className="h-5 w-16 rounded-md" />
              {r % 3 !== 1 && <Skeleton className="h-5 w-14 rounded-md" />}
              {r % 3 === 2 && <Skeleton className="h-5 w-14 rounded-md" />}
            </div>
            <div className="flex w-32 shrink-0 items-center justify-center px-3.5 py-3">
              <Skeleton className="h-3.5 w-10" />
            </div>
            <div className="w-37 shrink-0 space-y-1.5 px-3.5 py-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="flex w-30 shrink-0 items-center justify-center px-3.5 py-3">
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="flex w-27 shrink-0 items-center justify-center px-3.5 py-3">
              <Skeleton className="h-8.5 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplatesTableSkeleton;
