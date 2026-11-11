"use client";

import React, { Suspense } from "react";
import { TeacherGradingView } from "@/components/teacher/grading/TeacherGradingView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherGradingView />
    </Suspense>
  );
}
