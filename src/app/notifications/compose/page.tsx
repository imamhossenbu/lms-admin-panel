"use client";

import React, { Suspense } from "react";
import { BroadcastComposeView } from "@/components/notifications/compose/BroadcastComposeView";
import { BroadcastComposeSkeleton } from "@/components/notifications/compose/BroadcastComposeSkeleton";

export default function ComposeBroadcastPage() {
  return (
    <Suspense fallback={<BroadcastComposeSkeleton />}>
      <BroadcastComposeView mode="create" />
    </Suspense>
  );
}
