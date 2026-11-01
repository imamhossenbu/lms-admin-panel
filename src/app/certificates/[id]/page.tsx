"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { CertificateDetailView } from "@/components/certificates/detail/CertificateDetailView";
import { CertificateDetailSkeleton } from "@/components/certificates/detail/CertificateDetailSkeleton";

/** Certificate detail: rendered certificate, verification, details, activity and revoke / restore. */
function CertificateDetailContent() {
  const params = useParams<{ id: string }>();
  return <CertificateDetailView key={params.id} certificateId={params.id} />;
}

export default function CertificateDetailPage() {
  return (
    <Suspense fallback={<CertificateDetailSkeleton />}>
      <CertificateDetailContent />
    </Suspense>
  );
}
