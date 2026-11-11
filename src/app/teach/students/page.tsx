"use client";

import React, { Suspense } from "react";
import { TeacherStudentsView } from "@/components/teacher/students/TeacherStudentsView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherStudentsView />
    </Suspense>
  );
}
