import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function RowSkeleton({ i }: { i: number }) {
  return (
    <div className="flex items-start gap-3 px-3.5 py-3">
      <Skeleton className="mt-2.5 h-4 w-4 shrink-0 rounded" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {i < 2 && <Skeleton className="h-2 w-2 rounded-full" />}
          <Skeleton className={i % 2 ? "h-4 w-40" : "h-4 w-56"} />
          {i === 1 && <Skeleton className="h-5 w-20 rounded-md" />}
        </div>
        <Skeleton className={i % 3 === 0 ? "h-3.5 w-11/12" : "h-3.5 w-3/4"} />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the Inbox tab: category rail + toolbar + day-grouped feed. */
export function InboxSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      <div className="dashboard-card p-3 xl:col-span-3">
        <Skeleton className="mx-2 mb-3 h-3 w-20" />
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
              <Skeleton className={i % 2 ? "h-3.5 w-20" : "h-3.5 w-28"} />
              {i % 3 === 0 && <Skeleton className="ml-auto h-4 w-6 rounded-full" />}
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-4 p-5 xl:col-span-9">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-56 rounded-lg" />
            <Skeleton className="h-6 w-11 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </div>
        <Skeleton className="ml-3.5 h-4 w-40" />
        {[3, 4].map((rows, g) => (
          <div key={g} className="space-y-2">
            <Skeleton className="ml-1 h-3 w-20" />
            <div className="divide-y divide-dash overflow-hidden rounded-xl border border-dash">
              {Array.from({ length: rows }).map((_, i) => (
                <RowSkeleton key={i} i={g * 3 + i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InboxSkeleton;
