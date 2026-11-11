"use client";

import React, { Suspense } from "react";
import { TeacherProfileView } from "@/components/teacher/profile/TeacherProfileView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherProfileView />
    </Suspense>
  );
}
