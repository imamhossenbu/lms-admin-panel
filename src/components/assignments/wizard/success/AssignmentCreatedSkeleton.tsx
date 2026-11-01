import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function SideRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="ml-auto h-3.5 w-20" />
        </div>
      ))}
    </>
  );
}

/** Mirrors the success page: header, hero (check + text + buttons), share/calendar cards, details + next steps. */
export function AssignmentCreatedSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading assignment">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-96 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="dashboard-card space-y-6 p-6 xl:col-span-2">
          <div className="flex flex-col items-center gap-4 py-4">
            <Skeleton className="h-36 w-36 rounded-full" />
            <Skeleton className="h-7 w-80 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-48 rounded-xl" />
              <Skeleton className="h-11 w-40 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-dash p-5">
                <div className="flex items-center gap-3.5">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-11 w-full rounded-lg" />
                {i === 0 ? (
                  <div className="flex gap-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-11 w-11 rounded-full" />
                    ))}
                  </div>
                ) : (
                  <Skeleton className="h-11 w-full rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="dashboard-card space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="ml-auto h-6 w-20 rounded-md" />
            </div>
            <div className="space-y-2.5 rounded-xl border border-dash p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <SideRows count={7} />
            </div>
          </div>
          <div className="dashboard-card space-y-2.5 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCreatedSkeleton;
