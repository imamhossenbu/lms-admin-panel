import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

/** Breadcrumb + title + subtitle + button(s). */
export function HeaderSkeleton({ crumbs = 1, buttons = 1 }: { crumbs?: number; buttons?: number }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          {Array.from({ length: crumbs }).map((_, i) => (
            <Skeleton key={i} className={cn("h-3.5", i === crumbs - 1 ? "w-28" : "w-20")} />
          ))}
        </div>
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-md max-w-full" />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: buttons }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-36 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/** Stat tile: icon tile, label, value, caption. */
export function StatTileSkeleton() {
  return (
    <div className="dashboard-card flex items-start gap-4 p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

/** Table with vertical borders: avatar + two lines, badges, text cells, action button. */
export function TableSkeleton({ rows = 6, cols = ["w-auto", "w-36", "w-28", "w-16", "w-28", "w-28", "w-16"] }: { rows?: number; cols?: string[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
        {cols.map((w, i) => (
          <div key={i} className={cn("px-2.5 py-3", i === 0 ? "min-w-0 flex-1" : cn("shrink-0", w))}>
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center divide-x divide-dash">
            {cols.map((w, i) => (
              <div key={i} className={cn("flex items-center px-2.5 py-3", i === 0 ? "min-w-0 flex-1 gap-2.5" : cn("shrink-0", w))}>
                {i === 0 ? (
                  <>
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-36 max-w-full" />
                      <Skeleton className="h-3 w-48 max-w-full" />
                    </div>
                  </>
                ) : i === cols.length - 1 ? (
                  <Skeleton className="mx-auto h-7 w-7 rounded-lg" />
                ) : i < 3 ? (
                  <Skeleton className="h-5 w-20 rounded-full" />
                ) : (
                  <Skeleton className="h-3.5 w-14" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Filter bar: search + two selects + Reset. */
export function FiltersSkeleton({ selects = 2 }: { selects?: number }) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      {Array.from({ length: selects }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg xl:w-44" />
      ))}
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
  );
}

/** Role card: icon tile, name + badge, 2 description lines, bar, avatars, 3 buttons. */
export function RoleCardSkeleton() {
  return (
    <div className="dashboard-card space-y-4 p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-full border-2 border-white" />
          ))}
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex gap-2 border-t border-dash pt-4">
        <Skeleton className="h-8.5 w-16 rounded-lg" />
        <Skeleton className="h-8.5 w-24 rounded-lg" />
        <Skeleton className="ml-auto h-8.5 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/** Timeline: day label + rows (icon tile, sentence, detail, time). */
export function TimelineSkeleton({ groups = 2, rows = 3 }: { groups?: number; rows?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: groups }).map((_, g) => (
        <div key={g} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: rows }).map((__, r) => (
            <div key={r} className="flex items-start gap-3 py-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className={cn("h-3.5", r % 2 ? "w-64" : "w-80", "max-w-full")} />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Capsule tab bar. */
export function TabsSkeleton({ widths = ["w-28", "w-32", "w-44", "w-24"] }: { widths?: string[] }) {
  return (
    <div className="flex w-fit max-w-full gap-1.5 overflow-hidden rounded-2xl border border-dash bg-gray-bg p-1.5">
      {widths.map((w, i) => (
        <Skeleton key={i} className={cn("h-9 shrink-0 rounded-xl", w)} />
      ))}
    </div>
  );
}
