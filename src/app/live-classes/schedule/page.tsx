"use client";

import React, { Suspense } from "react";
import { LiveClassFormView } from "@/components/live-classes/form/LiveClassFormView";
import { LiveClassFormSkeleton } from "@/components/live-classes/form/LiveClassFormSkeleton";

export default function ScheduleLiveClassPage() {
  return (
    <Suspense fallback={<LiveClassFormSkeleton />}>
      <LiveClassFormView mode="create" />
    </Suspense>
  );
}
