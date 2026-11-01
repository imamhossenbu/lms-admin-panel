import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function SkeletonField({ tall = false }: { tall?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-28 rounded-md" />
      <div className={`rounded-lg border border-dash bg-white px-3.5 py-3 ${tall ? "h-28" : "h-10"}`}>
        <Skeleton className="h-3 w-1/2 rounded-md bg-slate-100" />
        {tall && <Skeleton className="mt-2.5 h-3 w-3/4 rounded-md bg-slate-100" />}
      </div>
    </div>
  );
}

function SkeletonCardHeader() {
  return (
    <div className="flex items-start gap-3.5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-3 w-56 max-w-full rounded-md bg-slate-100" />
      </div>
    </div>
  );
}

function MainCardSkeleton() {
  return (
    <div className="dashboard-card space-y-5 p-5">
      <SkeletonCardHeader />
      <SkeletonField />
      <SkeletonField tall />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-36 rounded-md" />
        <div className="rounded-lg border border-dash">
          <div className="flex gap-3 border-b border-dash px-3.5 py-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-md bg-slate-100" />
            ))}
          </div>
          <div className="space-y-2.5 p-3.5">
            <Skeleton className="h-3 w-full rounded-md bg-slate-100" />
            <Skeleton className="h-3 w-4/5 rounded-md bg-slate-100" />
            <Skeleton className="h-3 w-2/3 rounded-md bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCardSkeleton({ variant }: { variant: "radios" | "image" | "input" }) {
  return (
    <div className="dashboard-card space-y-4 p-5">
      <SkeletonCardHeader />
      {variant === "radios" && (
        <>
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SkeletonField />
            <SkeletonField />
          </div>
        </>
      )}
      {variant === "image" && (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-dash">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-2.5 w-28 rounded-md bg-slate-100" />
            <Skeleton className="h-2.5 w-20 rounded-md bg-slate-100" />
          </div>
        </div>
      )}
      {variant === "input" && <SkeletonField />}
    </div>
  );
}

/** Rich skeleton of the Edit Lesson page: header, course card, tab bar and the two-column tab body. */
export function LessonEditorSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading lesson editor">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          {[16, 28, 16, 20].map((w, i) => (
            <Skeleton key={i} className="h-3.5 rounded-md" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2.5">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md bg-slate-100" />
          </div>
          <div className="flex gap-2.5">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg bg-slate-300/70" />
          </div>
        </div>
      </div>

      <div className="dashboard-card flex flex-col gap-5 p-4 sm:flex-row sm:items-center">
        <Skeleton className="aspect-video w-full shrink-0 rounded-xl sm:w-64" />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-56 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-md bg-slate-100" />
          </div>
          <Skeleton className="h-4 w-72 max-w-full rounded-md bg-slate-100" />
        </div>
      </div>

      <div className="dashboard-card flex gap-6 overflow-hidden px-5 py-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-4.5 w-4.5 rounded-md" />
            <Skeleton className="h-3.5 w-16 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <MainCardSkeleton />
        </div>
        <div className="space-y-6">
          <SideCardSkeleton variant="radios" />
          <SideCardSkeleton variant="image" />
          <SideCardSkeleton variant="input" />
        </div>
      </div>
    </div>
  );
}

export default LessonEditorSkeleton;
