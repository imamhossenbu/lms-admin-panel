import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CertificatesTab } from "./certificateListUtils";

function StatSkeleton() {
  return (
    <div className="dashboard-card flex items-start gap-3 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

const ISSUED_COLS = ["w-10", "flex-1", "w-48", "w-36", "w-24", "w-24", "w-16", "w-22", "w-14"];

function IssuedSkeleton() {
  return (
    <div className="space-y-5">
      <div className="dashboard-card space-y-4 p-5">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-dash">
          <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
            {ISSUED_COLS.map((w, i) => (
              <div key={i} className={`${w} shrink-0 px-2.5 py-3`}>
                <Skeleton className={i === 0 ? "h-4 w-4 rounded" : "h-3 w-14"} />
              </div>
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, r) => (
            <div key={r} className="flex divide-x divide-dash border-b border-dash last:border-b-0">
              <div className="w-10 shrink-0 px-2.5 py-4">
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5 px-2.5 py-3">
                <Skeleton className="h-3.5 w-40 max-w-full" />
                <Skeleton className="h-3 w-28 max-w-full" />
              </div>
              <div className="flex w-48 shrink-0 items-center gap-2.5 px-2.5 py-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32 max-w-full" />
                </div>
              </div>
              <div className="w-36 shrink-0 px-2.5 py-4">
                <Skeleton className={r % 2 ? "h-3.5 w-24" : "h-3.5 w-28"} />
              </div>
              <div className="w-24 shrink-0 space-y-1.5 px-2.5 py-3">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="w-24 shrink-0 px-2.5 py-4">
                <Skeleton className={r % 3 === 0 ? "h-5 w-20 rounded-md" : "h-3.5 w-14"} />
              </div>
              <div className="flex w-16 shrink-0 justify-center px-2.5 py-4">
                <Skeleton className="h-3.5 w-8" />
              </div>
              <div className="flex w-22 shrink-0 justify-center px-2.5 py-3.5">
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
              <div className="flex w-14 shrink-0 justify-center px-2.5 py-3">
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-dash p-4">
            <Skeleton className="h-3.5 w-40" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <div className="dashboard-card space-y-4 p-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex h-48 items-end gap-4 border-b border-dash px-2">
            {["h-1/3", "h-1/2", "h-2/3", "h-2/5", "h-3/4", "h-1/2"].map((h, i) => (
              <Skeleton key={i} className={`${h} flex-1 rounded-t-md rounded-b-none`} />
            ))}
          </div>
        </div>
        <div className="dashboard-card space-y-3 p-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5 px-2 py-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="dashboard-card space-y-3 p-4 lg:col-span-2 2xl:col-span-1">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1">
              <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-44 max-w-full" />
              </div>
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Template card: mini certificate (frame, heading, name, body lines, signers + seal), then meta + actions. */
function TemplateCardSkeleton() {
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex aspect-10/7 items-center justify-center border-b border-dash bg-gray-bg p-4">
        <div className="flex aspect-10/7 w-full flex-col items-center justify-between rounded-sm border-4 border-double border-slate-200 bg-white p-4">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-4 w-1/2" />
          <div className="w-3/4 space-y-1">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-4/5" />
          </div>
          <div className="flex w-full items-end justify-between">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-2.5 w-14" />
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex justify-between gap-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="space-y-1.5 rounded-lg bg-gray-bg px-3 py-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-48 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8.5 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <TemplateCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EligibleSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dashboard-card space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8.5 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
        <div className="overflow-hidden rounded-lg border border-dash">
          {Array.from({ length: 7 }).map((_, r) => (
            <div key={r} className={`flex divide-x divide-dash border-b border-dash last:border-b-0 ${r === 0 ? "bg-slate-50" : ""}`}>
              <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-3">
                {r === 0 ? <Skeleton className="h-3 w-14" /> : <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
                {r > 0 && (
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                )}
              </div>
              <div className="w-48 shrink-0 px-2.5 py-3.5">
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="flex w-36 shrink-0 items-center gap-2 px-2.5 py-3.5">
                <Skeleton className="h-1.5 flex-1 rounded-full" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex w-24 shrink-0 justify-center px-2.5 py-3.5">
                <Skeleton className="h-3.5 w-8" />
              </div>
              <div className="w-28 shrink-0 px-2.5 py-3.5">
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex w-26 shrink-0 justify-center px-2.5 py-3">
                <Skeleton className={r === 0 ? "h-3 w-10" : "h-8 w-18 rounded-lg"} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mirrors the Certificates page: header, 5 stat tiles, insight strip, tab bar, then the active tab's content. */
export function CertificatesListSkeleton({ tab = "issued" }: { tab?: CertificatesTab }) {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading certificates">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-44 rounded-xl" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-wrap gap-5 rounded-xl border border-dash bg-gray-bg px-4 py-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex w-fit gap-1.5 rounded-2xl border border-dash bg-gray-bg p-1.5">
        {["w-28", "w-32", "w-28"].map((w, i) => (
          <Skeleton key={i} className={`h-9 ${w} rounded-xl`} />
        ))}
      </div>
      {tab === "templates" ? <TemplatesSkeleton /> : tab === "eligible" ? <EligibleSkeleton /> : <IssuedSkeleton />}
    </div>
  );
}

export default CertificatesListSkeleton;
