import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

/** Stat tile: icon tile, label, value + pill, caption. */
export function StatTileSkeleton() {
  return (
    <div className="dashboard-card flex items-start gap-3 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

/** Search + selects + reset. */
export function FilterBarSkeleton({ selects = 3 }: { selects?: number }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <Skeleton className="h-10 w-full rounded-lg lg:w-80" />
      <div className="flex flex-1 flex-wrap items-center gap-3 lg:justify-end">
        {Array.from({ length: selects }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-40 rounded-lg" />
        ))}
        <Skeleton className="h-10 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export type SkeletonCell = "title" | "person" | "badges" | "badge" | "date" | "number" | "bar" | "menu" | "text";

function CellSkeleton({ kind, i }: { kind: SkeletonCell; i: number }) {
  switch (kind) {
    case "title":
      return (
        <div className="space-y-1.5">
          <Skeleton className={cn("h-3.5", i % 2 ? "w-3/4" : "w-5/6")} />
          <Skeleton className="h-3 w-1/2" />
        </div>
      );
    case "person":
      return (
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      );
    case "badges":
      return (
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          {i % 2 === 0 && <Skeleton className="h-5 w-12 rounded-md" />}
        </div>
      );
    case "badge":
      return <Skeleton className="mx-auto h-5 w-20 rounded-md" />;
    case "date":
      return (
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-14" />
        </div>
      );
    case "number":
      return (
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      );
    case "bar":
      return (
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      );
    case "menu":
      return <Skeleton className="mx-auto h-7 w-7 rounded-lg" />;
    default:
      return <Skeleton className={cn("h-3.5", i % 2 ? "w-16" : "w-20")} />;
  }
}

/** Bordered table with header cells and rows (vertical column borders). */
export function TableSkeleton({ columns, rows = 6 }: { columns: { kind: SkeletonCell; width?: string }[]; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
        {columns.map((c, i) => (
          <div key={i} className={cn("px-3 py-3", c.width ?? "flex-1")}>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex divide-x divide-dash">
            {columns.map((c, i) => (
              <div key={i} className={cn("min-w-0 px-3 py-3", c.width ?? "flex-1")}>
                <CellSkeleton kind={c.kind} i={r} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-dash px-4 py-3">
        <Skeleton className="h-3.5 w-40" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export const BROADCAST_TABLE_SKELETON: { kind: SkeletonCell; width?: string }[] = [
  { kind: "title" },
  { kind: "badges", width: "w-48" },
  { kind: "badge", width: "w-30" },
  { kind: "date", width: "w-39" },
  { kind: "number", width: "w-25" },
  { kind: "bar", width: "w-26" },
  { kind: "menu", width: "w-17" },
];

/** Broadcasts tab: six stat tiles, filters and the list table. */
export function BroadcastsTabSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading broadcasts">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
      <div className="dashboard-card shadow-2xs space-y-4 p-5">
        <FilterBarSkeleton />
        <div className="overflow-x-auto">
          <div className="min-w-240">
            <TableSkeleton columns={BROADCAST_TABLE_SKELETON} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card header: icon tile, title, description. */
export function CardHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      {action && <Skeleton className="ml-auto h-8 w-28 rounded-lg" />}
    </div>
  );
}

const BAR_HEIGHTS = ["h-24", "h-36", "h-28", "h-20", "h-16", "h-12", "h-10", "h-8", "h-6", "h-6", "h-4", "h-4"];

/** Detail page: header, stat cards, funnel / channels / chart, message + details sidebar, recipients table. */
export function BroadcastDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading broadcast">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-96 max-w-full" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-12 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="dashboard-card space-y-5 p-5">
              <CardHeaderSkeleton />
              {["w-full", "w-3/5", "w-1/4"].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                  <Skeleton className={cn("h-3 rounded-full", w)} />
                </div>
              ))}
            </div>
            <div className="dashboard-card space-y-4 p-5">
              <CardHeaderSkeleton />
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 rounded-xl border border-dash p-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card space-y-5 p-5">
            <CardHeaderSkeleton />
            <div className="flex h-56 items-end gap-2 border-b border-dash">
              {BAR_HEIGHTS.map((h, i) => (
                <Skeleton key={i} className={cn("flex-1 rounded-t-md", h)} />
              ))}
            </div>
          </div>
        </div>
        <div className="min-w-0 space-y-5 xl:col-span-4">
          <div className="dashboard-card space-y-4 p-5">
            <CardHeaderSkeleton />
            <div className="space-y-3 rounded-xl border border-dash p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
          <div className="dashboard-card space-y-3 p-5">
            <CardHeaderSkeleton />
            <div className="divide-y divide-dash">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className={cn("ml-auto h-4 rounded-md", i % 2 ? "w-16" : "w-28")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton action />
        <FilterBarSkeleton selects={2} />
        <TableSkeleton columns={RECIPIENT_TABLE_SKELETON} />
      </div>
    </div>
  );
}

export const RECIPIENT_TABLE_SKELETON: { kind: SkeletonCell; width?: string }[] = [
  { kind: "person" },
  { kind: "badges", width: "w-28" },
  { kind: "badge", width: "w-28" },
  { kind: "text", width: "w-32" },
  { kind: "text", width: "w-32" },
  { kind: "text", width: "w-32" },
  { kind: "text", width: "w-44" },
];

export default BroadcastsTabSkeleton;
