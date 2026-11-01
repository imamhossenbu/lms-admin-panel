"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { BroadcastComposeView } from "@/components/notifications/compose/BroadcastComposeView";
import { BroadcastComposeSkeleton } from "@/components/notifications/compose/BroadcastComposeSkeleton";

function EditBroadcastContent() {
  const params = useParams<{ id: string }>();
  return <BroadcastComposeView key={params.id} mode="edit" broadcastId={params.id} />;
}

export default function EditBroadcastPage() {
  return (
    <Suspense fallback={<BroadcastComposeSkeleton />}>
      <EditBroadcastContent />
    </Suspense>
  );
}
