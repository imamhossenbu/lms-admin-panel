"use client";

import React, { Suspense } from "react";
import { TeacherLiveView } from "@/components/teacher/live/TeacherLiveView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherLiveView />
    </Suspense>
  );
}
