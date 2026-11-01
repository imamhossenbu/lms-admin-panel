"use client";

import React, { Suspense } from "react";
import { CertificatesListView } from "@/components/certificates/list/CertificatesListView";
import { CertificatesListSkeleton } from "@/components/certificates/list/CertificatesListSkeleton";

/** Certificates list (`?tab`, `?q`, `?course`, `?template`, `?status`, `?method`, `?from`, `?to`, `?ecourse`, `?page`, `?perPage` survive reloads). */
export default function CertificatesPage() {
  return (
    <Suspense fallback={<CertificatesListSkeleton />}>
      <CertificatesListView />
    </Suspense>
  );
}
