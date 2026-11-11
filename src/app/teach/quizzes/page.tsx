"use client";

import React, { Suspense } from "react";
import { TeacherQuizzesView } from "@/components/teacher/quizzes/TeacherQuizzesView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={3} />}>
      <TeacherQuizzesView />
    </Suspense>
  );
}
