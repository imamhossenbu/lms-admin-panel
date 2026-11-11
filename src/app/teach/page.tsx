"use client";

import React, { Suspense } from "react";
import { TeacherDashboardView } from "@/components/teacher/dashboard/TeacherDashboardView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={4} />}>
      <TeacherDashboardView />
    </Suspense>
  );
}
