"use client";

import React, { Suspense } from "react";
import { LiveClassesListView } from "@/components/live-classes/list/LiveClassesListView";
import { LiveClassesListSkeleton } from "@/components/live-classes/list/LiveClassesListSkeleton";

export default function LiveClassesPage() {
  return (
    <Suspense fallback={<LiveClassesListSkeleton />}>
      <LiveClassesListView />
    </Suspense>
  );
}
