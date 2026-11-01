import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function CardHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
    </div>
  );
}

function InfoRowsSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-3">
          <Skeleton className="col-span-2 h-3.5 w-20" />
          <Skeleton className="col-span-3 h-3.5 w-40" />
        </div>
      ))}
    </div>
  );
}

/** Mirrors the stat tiles (icon tile, value, label, %). */
export function LiveStatTilesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-dash bg-white p-5">
          <Skeleton className="h-13 w-13 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-4 w-8 self-start" />
        </div>
      ))}
    </div>
  );
}

/** Mirrors the Students / Attendance table (checkbox, avatar, text, badge, progress, ⋯) with column borders. */
export function LiveTableSkeleton({ rows = 8 }: { rows?: number }) {
  const cols = ["w-4", "w-6", "w-32", "w-36", "w-20", "w-20", "w-16", "w-16", "w-8"];
  return (
    <div className="overflow-hidden rounded-xl border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-gray-bg">
        {cols.map((w, i) => (
          <div key={i} className="flex-1 px-3.5 py-3">
            <Skeleton className={`h-3 ${w}`} />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center divide-x divide-dash">
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-4 w-4 rounded" /></div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-3.5 w-5" /></div>
            <div className="flex flex-1 items-center gap-2 px-3.5 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-3.5 w-28" /></div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-3.5 w-20" /></div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-6 w-18 rounded-md" /></div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-3.5 w-14" /></div>
            <div className="flex flex-1 items-center gap-2 px-3.5 py-3">
              <Skeleton className="h-1.5 flex-1 rounded-full" />
              <Skeleton className="h-3 w-7" />
            </div>
            <div className="flex-1 px-3.5 py-3"><Skeleton className="h-7 w-7 rounded-lg" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Loading state for the Live Class Details page: header, summary card, tab bar and the Overview layout. */
export function LiveClassDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading live class">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-40" />
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
            {["w-28", "w-32", "w-24"].map((w) => (
              <Skeleton key={w} className={`h-10 rounded-lg ${w}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card p-6">
        <div className="flex gap-5">
          <Skeleton className="h-28 w-28 rounded-2xl" />
          <div className="flex-1 space-y-2.5 border-l border-dash pl-5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-52" />
            <Skeleton className="h-3.5 w-full max-w-2xl" />
            <Skeleton className="h-3.5 w-2/3 max-w-xl" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-dash pt-5 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-fit max-w-full gap-2 overflow-hidden rounded-2xl border border-dash bg-gray-bg p-1.5">
        {["w-24", "w-32", "w-36", "w-24", "w-32", "w-24", "w-24"].map((w, i) => (
          <Skeleton key={i} className={`h-9 rounded-xl ${w}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <div className="dashboard-card space-y-5 p-5">
            <CardHeaderSkeleton />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoRowsSkeleton rows={4} />
              <InfoRowsSkeleton rows={5} />
            </div>
          </div>
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
          <div className="dashboard-card space-y-5 p-5">
            <CardHeaderSkeleton />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5 xl:col-span-4">
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <div className="flex aspect-video items-center gap-4 rounded-xl border border-dash bg-slate-100 p-5">
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          </div>
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3.5">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card space-y-3 p-5">
            <CardHeaderSkeleton />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveClassDetailsSkeleton;
