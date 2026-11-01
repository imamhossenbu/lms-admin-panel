import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { TimelineSkeleton } from "../shared/TeamSkeletonParts";

function CardHead({ actions = 0 }: { actions?: number }) {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3.5 w-52 max-w-full" />
      </div>
      {Array.from({ length: actions }).map((_, i) => (
        <Skeleton key={i} className="h-8.5 w-24 rounded-lg" />
      ))}
    </div>
  );
}

/** Mirrors /users/[id]: breadcrumb, profile banner (avatar, name, badges, meta, 3 buttons), access matrix, security + activity aside. */
export function MemberDetailSkeleton() {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading team member">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-28" />
      </div>
      <div className="dashboard-card flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="dashboard-card space-y-4 p-5 xl:col-span-8">
          <CardHead actions={3} />
          <div className="flex gap-3 rounded-xl border border-dash bg-gray-bg p-3.5">
            <Skeleton className="h-6 w-28 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-4">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="overflow-hidden rounded-lg border border-dash">
            <div className="flex divide-x divide-dash border-b border-dash bg-slate-50">
              <div className="flex-1 px-2 py-3">
                <Skeleton className="h-3.5 w-16" />
              </div>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-16 shrink-0 px-2 py-3">
                  <Skeleton className="mx-auto h-3 w-10" />
                </div>
              ))}
            </div>
            <div className="divide-y divide-dash">
              {Array.from({ length: 12 }).map((_, r) => (
                <div key={r} className="flex items-center divide-x divide-dash">
                  <div className="flex flex-1 items-center gap-2.5 px-2 py-1.5">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex w-16 shrink-0 justify-center px-2 py-2">
                      {(r + i) % 4 === 3 ? <Skeleton className="h-3 w-6" /> : <Skeleton className="h-4.5 w-4.5 rounded" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5 xl:col-span-4">
          <div className="dashboard-card space-y-4 p-5">
            <CardHead />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3.5 w-40" />
                </div>
              </div>
            ))}
            <div className="space-y-2 rounded-xl border border-dash p-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card space-y-4 p-5">
            <CardHead />
            <TimelineSkeleton groups={2} rows={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetailSkeleton;
