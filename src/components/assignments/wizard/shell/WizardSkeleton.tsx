import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className={wide ? "h-28 w-full rounded-lg" : "h-10 w-full rounded-lg"} />
    </div>
  );
}

function SideCardSkeleton({ lines }: { lines: number }) {
  return (
    <div className="dashboard-card space-y-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="ml-auto h-6 w-20 rounded-md" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className={i % 2 ? "h-3.5 w-3/4" : "h-3.5 w-2/3"} />
        </div>
      ))}
    </div>
  );
}

/** Mirrors the wizard: breadcrumb, back button + title, 7-step stepper, form card + side cards. */
export function WizardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading assignment wizard">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
      <div className="dashboard-card flex items-center gap-3 overflow-hidden px-5 py-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-2.5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
            {i < 6 && <Skeleton className="h-0.5 flex-1" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="dashboard-card space-y-5 p-5 xl:col-span-2">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </div>
          <FieldSkeleton />
          <FieldSkeleton wide />
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <div className="flex justify-between border-t border-dash pt-5">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-44 rounded-xl" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="dashboard-card space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="ml-auto h-6 w-20 rounded-md" />
            </div>
            <div className="space-y-3 rounded-xl border border-dash p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
            </div>
          </div>
          <SideCardSkeleton lines={5} />
        </div>
      </div>
    </div>
  );
}

export default WizardSkeleton;
