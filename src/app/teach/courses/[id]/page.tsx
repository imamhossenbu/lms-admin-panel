"use client";

import React, { Suspense, use } from "react";
import { TeacherCourseDetailView } from "@/components/teacher/courses/TeacherCourseDetailView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<PanelSkeleton stats={4} />}>
      <TeacherCourseDetailView id={id} />
    </Suspense>
  );
}
