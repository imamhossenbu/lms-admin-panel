import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function FieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-28" />
      {tall ? (
        <div className="overflow-hidden rounded-lg border border-dash">
          <div className="flex items-center gap-2 border-b border-dash p-2.5">
            <Skeleton className="h-6 w-24 rounded-md" />
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-6 rounded-md" />
            ))}
          </div>
          <div className="space-y-2 p-3.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ) : (
        <Skeleton className="h-11 w-full rounded-lg" />
      )}
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

/** Mirrors the quiz wizard: breadcrumb, title, 4-step stepper, Basic Information form + side cards + footer. */
export function QuizWizardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading quiz wizard">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="dashboard-card flex items-center gap-3 overflow-hidden px-5 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-2.5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
            {i < 3 && <Skeleton className="h-0.5 flex-1" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="dashboard-card space-y-5 p-5 xl:col-span-2">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-72" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <FieldSkeleton tall />
          <FieldSkeleton tall />
        </div>
        <div className="space-y-5">
          <div className="space-y-2.5 rounded-xl border border-dash bg-blue-14 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="space-y-2.5 rounded-xl border border-dash bg-brand-orange-light p-4">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className={i % 2 ? "h-3 w-3/4" : "h-3 w-5/6"} />
            ))}
          </div>
          <div className="dashboard-card space-y-1 p-4">
            <div className="mb-2 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-dash py-2.5 last:border-b-0">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className={i === 3 || i === 7 ? "h-6 w-20 rounded-md" : "h-3.5 w-28"} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between border-t border-dash pt-5">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>
    </div>
  );
}

export default QuizWizardSkeleton;
