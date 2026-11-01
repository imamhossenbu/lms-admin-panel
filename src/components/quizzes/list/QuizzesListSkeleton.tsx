import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const COLS = ["w-10", "", "w-40", "w-20", "w-24", "w-20", "w-24", "w-28", "w-16"];

function StatSkeleton() {
  return (
    <div className="dashboard-card flex items-start gap-4 p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-10" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
        {COLS.map((w, i) => (
          <div key={i} className={`${w || "flex-1"} shrink-0 px-2.5 py-3`}>
            <Skeleton className={i === 0 ? "h-4 w-4 rounded" : "h-3 w-14"} />
          </div>
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, r) => (
        <div key={r} className="flex divide-x divide-dash border-b border-dash last:border-b-0">
          <div className="w-10 shrink-0 px-2.5 py-3.5">
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="flex-1 space-y-1.5 px-2.5 py-3">
            <Skeleton className={r % 2 ? "h-3.5 w-36" : "h-3.5 w-44"} />
            <Skeleton className="h-3 w-52" />
          </div>
          <div className="w-40 shrink-0 space-y-1.5 px-2.5 py-3">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex w-20 shrink-0 justify-center px-2.5 py-4">
            <Skeleton className="h-3.5 w-6" />
          </div>
          <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 px-2.5 py-3">
            <Skeleton className="h-3.5 w-6" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex w-20 shrink-0 justify-center px-2.5 py-4">
            <Skeleton className="h-3.5 w-8" />
          </div>
          <div className="flex w-24 shrink-0 justify-center px-2.5 py-3.5">
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="w-28 shrink-0 space-y-1.5 px-2.5 py-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex w-16 shrink-0 justify-center px-2.5 py-3.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-dash p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="dashboard-card space-y-3.5 p-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="space-y-1.5 rounded-lg bg-gray-bg p-2">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-3.5 w-6" />
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-dash pt-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mirrors the Quizzes page: header, 4 stat cards, filter row, table (or grid) with pagination. */
export function QuizzesListSkeleton({ view = "table" }: { view?: "table" | "grid" }) {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading quizzes">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <div className="flex flex-col gap-3 xl:flex-row">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg xl:w-40" />
          ))}
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
        {view === "grid" ? <GridSkeleton /> : <TableSkeleton />}
      </div>
    </div>
  );
}

export default QuizzesListSkeleton;
