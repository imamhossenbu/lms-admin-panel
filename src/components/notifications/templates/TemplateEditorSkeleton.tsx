import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function CardHead() {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-60 max-w-full" />
      </div>
    </div>
  );
}

function Field({ tall }: { tall?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-24" />
      <div className={`rounded-lg border border-dash bg-white px-3.5 ${tall ? "h-44 space-y-2 py-3" : "flex h-10 items-center"}`}>
        <Skeleton className="h-3.5 w-2/5" />
        {tall && <Skeleton className="h-3.5 w-3/4" />}
        {tall && <Skeleton className="h-3.5 w-1/2" />}
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20 rounded-md" />
        ))}
      </div>
    </div>
  );
}

/** Mirrors the template editor: header, details + message cards, bottom bar, preview card. */
export function TemplateEditorSkeleton() {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading template">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-7">
          <div className="dashboard-card p-5">
            <CardHead />
            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-dash p-3.5">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-16" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-dash p-3.5">
                <Skeleton className="h-6 w-11 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-52" />
                  <Skeleton className="h-3 w-72 max-w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card space-y-5 p-5">
            <CardHead />
            <Field />
            <Field tall />
          </div>
          <div className="dashboard-card flex items-center justify-between p-4">
            <Skeleton className="h-3 w-48" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="dashboard-card p-5 xl:col-span-5">
          <CardHead />
          <div className="mb-4 flex gap-1.5 rounded-2xl border border-dash bg-gray-bg p-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 flex-1 rounded-xl" />
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-dash">
            <div className="space-y-2 border-b border-dash bg-gray-bg px-4 py-3">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateEditorSkeleton;
