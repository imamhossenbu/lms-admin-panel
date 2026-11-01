"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { LiveClassDetailsView } from "@/components/live-classes/details/LiveClassDetailsView";
import { LiveClassDetailsSkeleton } from "@/components/live-classes/details/LiveClassDetailsSkeleton";

/** Live Class Details: Overview, Students, Attendance, Q&A, Resources, Activity and Settings tabs (`?tab=`). */
function LiveClassDetailsContent() {
  const params = useParams<{ id: string }>();
  return <LiveClassDetailsView key={params.id} classId={params.id} />;
}

export default function LiveClassDetailsPage() {
  return (
    <Suspense fallback={<LiveClassDetailsSkeleton />}>
      <LiveClassDetailsContent />
    </Suspense>
  );
}
