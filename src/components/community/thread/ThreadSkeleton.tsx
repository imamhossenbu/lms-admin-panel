import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function CardHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

function AuthorSkeleton({ size = "h-10 w-10" }: { size?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className={`${size} rounded-full`} />
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/** Mirrors one reply card (author, body lines, action bar), optionally with a nested child. */
function ReplySkeleton({ nested = false, staff = false }: { nested?: boolean; staff?: boolean }) {
  return (
    <div className={`rounded-xl border border-dash bg-white p-4 ${staff ? "border-l-4 border-l-slate-200!" : ""}`}>
      <AuthorSkeleton size={nested ? "h-7.5 w-7.5" : "h-9 w-9"} />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-3.5 flex items-center gap-2 border-t border-dash pt-3">
        <Skeleton className="h-8.5 w-20 rounded-lg" />
        <Skeleton className="h-8.5 w-32 rounded-lg" />
        <Skeleton className="ml-auto h-7 w-7 rounded-lg" />
      </div>
    </div>
  );
}

/** Mirrors the Discussion tab: post card, replies with a nested thread, composer, and the right info column. */
export function DiscussionTabSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-8">
        <div className="dashboard-card space-y-4 p-5">
          <AuthorSkeleton />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex gap-1.5">
            {["w-16", "w-20", "w-14"].map((w) => (
              <Skeleton key={w} className={`h-5 rounded-full ${w}`} />
            ))}
          </div>
          <div className="flex gap-4 border-t border-dash pt-3.5">
            {["w-16", "w-20", "w-18"].map((w) => (
              <Skeleton key={w} className={`h-4 ${w}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8.5 w-32 rounded-lg" />
        </div>
        <div className="space-y-3">
          <ReplySkeleton staff />
          <div className="ml-4 space-y-3 border-l-2 border-dash pl-4 sm:ml-6 sm:pl-6">
            <ReplySkeleton nested />
          </div>
          <ReplySkeleton />
        </div>
        <div className="dashboard-card space-y-4 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="overflow-hidden rounded-xl border border-dash">
            <div className="flex gap-1.5 border-b border-dash bg-gray-bg p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-7 rounded-md" />
              ))}
            </div>
            <div className="space-y-2 p-3.5">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3.5 w-1/3" />
              <div className="h-16" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="space-y-5 xl:col-span-4">
        <div className="dashboard-card space-y-1 p-5">
          <CardHeaderSkeleton />
          <div className="divide-y divide-dash pt-2">
            {["w-20", "w-32", "w-24", "w-24", "w-16", "w-10", "w-10", "w-10"].map((w, i) => (
              <div key={i} className="grid grid-cols-5 items-center gap-3 py-2.5">
                <Skeleton className="col-span-2 h-3.5 w-20" />
                <div className="col-span-3 flex justify-end">
                  <Skeleton className={`h-3.5 ${w}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card space-y-4 p-5">
          <CardHeaderSkeleton />
          <div className="flex -space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8.5 w-8.5 rounded-full ring-2 ring-white" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-7.5 w-7.5 rounded-full" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
        <div className="dashboard-card space-y-4 p-5">
          <CardHeaderSkeleton />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Loading state for the thread page: breadcrumb, title + badges, actions, tab bar and the Discussion layout. */
export function ThreadSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading discussion">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-9 w-96 max-w-full" />
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-6 w-18 rounded-md" />
            </div>
            <Skeleton className="h-4 w-md max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["w-20", "w-20", "w-22", "w-10"].map((w, i) => (
              <Skeleton key={i} className={`h-10 rounded-lg ${w}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-fit gap-2 rounded-2xl border border-dash bg-gray-bg p-1.5">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <DiscussionTabSkeleton />
    </div>
  );
}

export default ThreadSkeleton;
