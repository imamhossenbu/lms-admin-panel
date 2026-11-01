"use client";

import React, { Suspense } from "react";
import { CommunityListView } from "@/components/community/list/CommunityListView";
import { PlanGate } from "@/components/plan-gate/PlanGate";
import { CommunityListSkeleton } from "@/components/community/list/CommunityListSkeleton";

/** Community list (`?tab`, `?q`, `?course`, `?category`, `?from`, `?to`, `?sort`, `?page`, `?perPage`, `?view` survive reloads). */
export default function CommunityPage() {
  return (
    <Suspense fallback={<CommunityListSkeleton />}>
      <PlanGate feature="community" loading={<CommunityListSkeleton />}>
        <CommunityListView />
      </PlanGate>
    </Suspense>
  );
}
