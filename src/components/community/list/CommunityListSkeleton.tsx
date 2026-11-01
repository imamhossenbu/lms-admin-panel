import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CommunityListView } from "./communityListUtils";

function StatSkeleton() {
  return (
    <div className="dashboard-card flex items-start gap-3.5 p-4">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-10" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

function CardSkeleton({ i }: { i: number }) {
  return (
    <div className="dashboard-card flex gap-3.5 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className={i % 2 ? "h-4 w-2/3" : "h-4 w-3/4"} />
        <Skeleton className="h-3.5 w-full" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
      <div className="hidden w-44 shrink-0 flex-col items-end gap-2.5 md:flex">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
        <div className="flex gap-3.5">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

const COLS = ["w-10", "", "w-44", "w-19", "w-18", "w-34", "w-43", "w-16"];

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
        {COLS.map((w, i) => (
          <div key={i} className={`${w || "flex-1"} shrink-0 px-3 py-3`}>
            <Skeleton className={i === 0 ? "h-4 w-4 rounded" : "h-3 w-14"} />
          </div>
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, r) => (
        <div key={r} className="flex divide-x divide-dash border-b border-dash last:border-b-0">
          <div className="w-10 shrink-0 px-3 py-3.5">
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 px-3 py-3">
            <Skeleton className={r % 2 ? "h-3.5 w-48" : "h-3.5 w-64"} />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex w-44 shrink-0 items-center gap-2 px-3 py-3">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
          <div className="flex w-19 shrink-0 justify-center px-3 py-4">
            <Skeleton className="h-3.5 w-6" />
          </div>
          <div className="flex w-18 shrink-0 justify-center px-3 py-4">
            <Skeleton className="h-3.5 w-8" />
          </div>
          <div className="w-34 shrink-0 space-y-1.5 px-3 py-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex w-43 shrink-0 flex-wrap gap-1.5 px-3 py-3.5">
            <Skeleton className="h-5 w-16 rounded-md" />
            {r % 3 === 0 && <Skeleton className="h-5 w-14 rounded-md" />}
          </div>
          <div className="flex w-16 shrink-0 justify-center px-3 py-3.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-dash p-4">
        <Skeleton className="h-3.5 w-48" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarCardSkeleton({ rows, kind }: { rows: number; kind: "queue" | "people" | "chips" | "bars" }) {
  return (
    <div className="dashboard-card p-4">
      <div className="mb-3.5 flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>
      {kind === "chips" ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className={`h-7 rounded-full ${i % 3 === 0 ? "w-24" : i % 3 === 1 ? "w-16" : "w-20"}`} />
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {Array.from({ length: rows }).map((_, i) =>
            kind === "bars" ? (
              <div key={i} className="space-y-1.5 px-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ) : kind === "people" ? (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-8.5 w-8.5 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                </div>
                <Skeleton className="h-8.5 w-18 rounded-lg" />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/** Mirrors the Community page: header, 5 stat cards, health strip, main card (tabs, filters, cards or table) + right column. */
export function CommunityListSkeleton({ view = "list" }: { view?: CommunityListView }) {
  const sidebar = (
    <div className={view === "table" ? "grid grid-cols-1 gap-5 lg:grid-cols-2" : "flex flex-col gap-5"}>
      <SidebarCardSkeleton kind="queue" rows={3} />
      <SidebarCardSkeleton kind="people" rows={5} />
      <SidebarCardSkeleton kind="chips" rows={8} />
      <SidebarCardSkeleton kind="bars" rows={5} />
    </div>
  );
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading community">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-md max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-dash bg-white px-4 py-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-60" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className={view === "table" ? "space-y-5" : "grid grid-cols-1 items-start gap-5 xl:grid-cols-12"}>
        <div className={view === "table" ? "dashboard-card space-y-4 p-5" : "dashboard-card space-y-4 p-5 xl:col-span-8"}>
          <div className="flex w-fit max-w-full gap-1.5 overflow-hidden rounded-2xl border border-dash bg-gray-bg p-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={`h-9 shrink-0 rounded-xl ${i === 2 ? "w-44" : "w-24"}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
          {view === "table" ? (
            <TableSkeleton />
          ) : (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} i={i} />
              ))}
            </div>
          )}
        </div>
        <div className={view === "table" ? "" : "xl:col-span-4"}>{sidebar}</div>
      </div>
    </div>
  );
}

export default CommunityListSkeleton;
