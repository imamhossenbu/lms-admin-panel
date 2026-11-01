"use client";

import React, { Suspense } from "react";
import { LiveClassesListView } from "@/components/live-classes/list/LiveClassesListView";
import { PlanGate } from "@/components/plan-gate/PlanGate";
import { LiveClassesListSkeleton } from "@/components/live-classes/list/LiveClassesListSkeleton";

export default function LiveClassesPage() {
  return (
    <Suspense fallback={<LiveClassesListSkeleton />}>
      <PlanGate feature="liveClasses" loading={<LiveClassesListSkeleton />}>
        <LiveClassesListView />
      </PlanGate>
    </Suspense>
  );
}
