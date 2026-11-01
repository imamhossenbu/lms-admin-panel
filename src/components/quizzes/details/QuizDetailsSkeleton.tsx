import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const BAR_HEIGHTS = ["h-16", "h-24", "h-20", "h-28", "h-14", "h-24", "h-32", "h-20", "h-24", "h-16", "h-28", "h-20"];

function CardHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="h-4 w-40" />
      {action && <Skeleton className="ml-auto h-8 w-28 rounded-lg" />}
    </div>
  );
}

/** Four KPI cards: icon tile, label, value, trend pill + caption. */
export function QuizStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dashboard-card flex items-start gap-4 p-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-6 w-16" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Submissions table: header cells + rows with #, avatar/name/email, score, badge, time, date, actions (column borders). */
export function QuizTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-gray-bg">
        {["w-8", "w-48", "w-16", "w-16", "w-20", "w-24", "w-16"].map((w, i) => (
          <div key={i} className="flex-1 px-3.5 py-3">
            <Skeleton className={`h-3 ${w} bg-slate-200`} />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center divide-x divide-dash">
            <div className="flex-1 px-3.5 py-3">
              <Skeleton className="h-3.5 w-4" />
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-3.5 py-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex-1 px-3.5 py-3">
              <Skeleton className="h-3.5 w-12" />
            </div>
            <div className="flex-1 px-3.5 py-3">
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <div className="flex-1 px-3.5 py-3">
              <Skeleton className="h-3.5 w-14" />
            </div>
            <div className="flex-1 space-y-1.5 px-3.5 py-3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="flex flex-1 items-center gap-2 px-3.5 py-3">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Quiz Information rows + Quick Actions grid + Share link. */
export function QuizSidebarSkeleton() {
  return (
    <div className="space-y-5">
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton />
        <div className="divide-y divide-dash">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className={`ml-auto h-4 rounded-md ${i % 3 === 0 ? "w-20" : "w-32"}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton action={false} />
        <div className="grid grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-11 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-3 p-5">
        <CardHeaderSkeleton action={false} />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  );
}

/** Loading state for the whole Quiz Details page (breadcrumb, header, tabs, KPIs, table, chart, sidebar). */
export function QuizDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading quiz">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-32" />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-12 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="inline-flex gap-1 rounded-full border border-dash bg-white p-1">
        {["w-24", "w-24", "w-28", "w-24", "w-28"].map((w, i) => (
          <Skeleton key={i} className={`h-9 rounded-full ${w}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <QuizStatCardsSkeleton />
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <QuizTableSkeleton />
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40 rounded-lg" />
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex h-48 items-end gap-3 border-b border-dash px-2">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="flex flex-1 items-end gap-1">
                  <Skeleton className={`flex-1 rounded-t-md rounded-b-none bg-slate-200 ${h}`} />
                  <Skeleton className={`flex-1 rounded-t-md rounded-b-none ${BAR_HEIGHTS[(i + 4) % BAR_HEIGHTS.length]}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="xl:col-span-4">
          <QuizSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

export default QuizDetailsSkeleton;
