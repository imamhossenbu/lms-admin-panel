import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { HeaderSkeleton } from "../shared/TeamSkeletonParts";

function CardHeader({ actions = 0 }: { actions?: number }) {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-64 max-w-full" />
      </div>
      {Array.from({ length: actions }).map((_, i) => (
        <Skeleton key={i} className="h-8.5 w-24 rounded-lg" />
      ))}
    </div>
  );
}

/** Mirrors the role editor: header, details card (3 rows), matrix (header + 10 rows), aside summary + members + tip. */
export function RoleEditorSkeleton() {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading role">
      <HeaderSkeleton crumbs={3} />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <div className="dashboard-card space-y-4 p-5">
            <CardHeader />
            <div className="divide-y divide-dash border-t border-dash">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2.5 py-4 sm:flex-row sm:gap-8">
                  <div className="space-y-1.5 sm:w-56">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  {i === 2 ? (
                    <div className="flex flex-1 gap-3.5">
                      {[0, 1, 2, 3, 4, 5, 6].map((s) => (
                        <Skeleton key={s} className="h-8 w-8 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <Skeleton className={cn("flex-1 rounded-lg", i === 1 ? "h-20" : "h-10")} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card space-y-4 p-5">
            <CardHeader actions={3} />
            <div className="overflow-hidden rounded-lg border border-dash">
              <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
                <div className="flex-1 px-2 py-3">
                  <Skeleton className="h-3.5 w-16" />
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex w-16 shrink-0 flex-col items-center gap-1.5 px-2 py-2.5">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4.5 w-4.5 rounded" />
                  </div>
                ))}
              </div>
              <div className="divide-y divide-dash">
                {Array.from({ length: 10 }).map((_, r) => (
                  <div key={r} className="flex items-center divide-x divide-dash">
                    <div className="flex flex-1 items-center gap-2.5 px-2 py-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex w-16 shrink-0 justify-center px-2 py-3">
                        {(r + i) % 4 === 3 ? <Skeleton className="h-3 w-6" /> : <Skeleton className="h-5 w-5 rounded-md" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 space-y-5 xl:col-span-4">
          <div className="dashboard-card space-y-4 p-5">
            <CardHeader />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <div className="flex flex-wrap gap-1.5">
              {[16, 20, 14, 24, 18].map((w, i) => (
                <Skeleton key={i} className={cn("h-5 rounded-md", w > 18 ? "w-24" : "w-16")} />
              ))}
            </div>
          </div>
          <div className="dashboard-card space-y-3 p-5">
            <CardHeader />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="h-7.5 w-7.5 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange-light p-4">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleEditorSkeleton;
