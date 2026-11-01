import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const BAR_HEIGHTS = ["h-10", "h-6", "h-28", "h-20", "h-20", "h-8", "h-4"];

function CardHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
    </div>
  );
}

/** Mirrors the stat row (icon tile, value, label, %). */
export function AssignmentStatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="dashboard-card flex items-center gap-4 p-5">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Sidebar "Assignment Details" + "Quick Actions" geometry. */
export function AssignmentSidebarSkeleton() {
  return (
    <div className="space-y-5">
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton />
        <div className="divide-y divide-dash">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="ml-auto h-5 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-3 p-5">
        <CardHeaderSkeleton />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-1">
            <Skeleton className="h-4.5 w-4.5 rounded" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Loading state for the whole Assignment Details page (header, tabs, stats, cards, chart, sidebar). */
export function AssignmentDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading assignment">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          {["w-16", "w-28", "w-20", "w-32"].map((w) => (
            <Skeleton key={w} className={`h-3.5 ${w}`} />
          ))}
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-80" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["w-36", "w-24", "w-40"].map((w) => (
              <Skeleton key={w} className={`h-10 rounded-lg ${w}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <div className="dashboard-card flex gap-8 px-6 py-4">
            {["w-16", "w-24", "w-24", "w-14", "w-18"].map((w, i) => (
              <Skeleton key={i} className={`h-4 ${w}`} />
            ))}
          </div>
          <AssignmentStatCardsSkeleton />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="dashboard-card space-y-4 p-5">
              <CardHeaderSkeleton />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <div className="space-y-2.5 rounded-xl border border-dash p-4">
                <Skeleton className="h-4 w-36" />
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-3 w-3/4" />
                ))}
              </div>
            </div>
            <div className="dashboard-card space-y-4 p-5">
              <CardHeaderSkeleton />
              <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-dash">
                <div className="space-y-2 bg-slate-200 p-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-2.5 w-4/5 bg-slate-100" />
                  ))}
                </div>
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="dashboard-card space-y-4 p-5">
              <CardHeaderSkeleton />
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
              <div className="flex h-36 items-end gap-4 border-b border-dash px-2">
                {BAR_HEIGHTS.map((h, i) => (
                  <Skeleton key={i} className={`flex-1 rounded-t-md rounded-b-none ${h}`} />
                ))}
              </div>
            </div>
            <div className="dashboard-card flex items-center gap-6 p-5">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-18 border-slate-200 animate-pulse">
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex-1 space-y-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="ml-auto h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-4">
          <AssignmentSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetailsSkeleton;
