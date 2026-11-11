"use client";

import React, { Suspense } from "react";
import { TeacherQuestionsView } from "@/components/teacher/questions/TeacherQuestionsView";
import { PanelSkeleton } from "@/components/teacher/shared/PanelSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PanelSkeleton stats={0} />}>
      <TeacherQuestionsView />
    </Suspense>
  );
}
