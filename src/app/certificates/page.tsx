"use client";

import React, { Suspense } from "react";
import { CertificatesListView } from "@/components/certificates/list/CertificatesListView";
import { PlanGate } from "@/components/plan-gate/PlanGate";
import { CertificatesListSkeleton } from "@/components/certificates/list/CertificatesListSkeleton";

/** Certificates list (`?tab`, `?q`, `?course`, `?template`, `?status`, `?method`, `?from`, `?to`, `?ecourse`, `?page`, `?perPage` survive reloads). */
export default function CertificatesPage() {
  return (
    <Suspense fallback={<CertificatesListSkeleton />}>
      <PlanGate feature="certificates" loading={<CertificatesListSkeleton />}>
        <CertificatesListView />
      </PlanGate>
    </Suspense>
  );
}
