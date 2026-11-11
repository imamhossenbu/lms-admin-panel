"use client";

import React, { Suspense } from "react";
import { TeacherCoursesView } from "@/components/teacher/courses/TeacherCoursesView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherCoursesView />
    </Suspense>
  );
}
