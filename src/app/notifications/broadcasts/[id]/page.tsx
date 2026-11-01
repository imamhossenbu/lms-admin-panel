"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { BroadcastDetailView } from "@/components/notifications/broadcasts/BroadcastDetailView";
import { BroadcastDetailSkeleton } from "@/components/notifications/broadcasts/BroadcastSkeletons";

/** Broadcast detail: delivery analytics, recipients, message preview and details. */
function BroadcastDetailContent() {
  const params = useParams<{ id: string }>();
  return <BroadcastDetailView key={params.id} broadcastId={params.id} />;
}

export default function BroadcastDetailPage() {
  return (
    <Suspense fallback={<BroadcastDetailSkeleton />}>
      <BroadcastDetailContent />
    </Suspense>
  );
}
