import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function CardHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      {action && <Skeleton className="ml-auto h-6 w-10 rounded-md" />}
    </div>
  );
}

/** Certificate stage: bordered certificate with logo, heading, name line, body lines, signers and a QR corner. */
function CertificateStageSkeleton() {
  return (
    <div className="dashboard-card p-5">
      <div className="rounded-xl bg-gray-bg p-4 sm:p-8">
        <div className="mx-auto aspect-video w-full max-w-3xl rounded-lg border border-dash bg-white p-4 shadow-xs sm:p-6">
          <div className="flex h-full flex-col items-center rounded-md border-2 border-slate-100 p-4 sm:p-6">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="mt-3 h-5 w-1/2" />
            <Skeleton className="mt-2 h-3 w-1/4" />
            <Skeleton className="mt-5 h-7 w-2/5 bg-slate-200" />
            <div className="mt-4 w-3/4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mx-auto h-3 w-4/5" />
            </div>
            <div className="mt-auto flex w-full items-end justify-between gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-px w-28 bg-slate-200" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-px w-28 bg-slate-200" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Verification card: link field + copy, QR block, counters. */
export function CertificateVerificationSkeleton() {
  return (
    <div className="dashboard-card space-y-5 p-5">
      <CardHeaderSkeleton />
      <div className="flex flex-col gap-5 sm:flex-row">
        <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border border-dash p-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Right column: details rows, activity timeline and the revoke area. */
export function CertificateSidebarSkeleton() {
  return (
    <div className="space-y-5">
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton />
        <div className="flex items-center gap-3 rounded-xl border border-dash p-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="divide-y divide-dash">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className={`ml-auto h-4 rounded-md ${i % 3 === 0 ? "w-16" : "w-28"}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton action />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className={`h-3.5 ${i % 2 ? "w-32" : "w-44"}`} />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card space-y-4 p-5">
        <CardHeaderSkeleton />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
    </div>
  );
}

/** Loading state for the whole Certificate detail page (breadcrumb, header, certificate stage, verification, sidebar). */
export function CertificateDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading certificate">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-36" />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-96 max-w-full" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-12 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <CertificateStageSkeleton />
          <CertificateVerificationSkeleton />
        </div>
        <div className="xl:col-span-4">
          <CertificateSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

export default CertificateDetailSkeleton;
