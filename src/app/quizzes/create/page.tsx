"use client";

import React, { Suspense } from "react";
import { CreateQuizWizard } from "@/components/quizzes/wizard/CreateQuizWizard";
import { QuizWizardSkeleton } from "@/components/quizzes/wizard/shell/QuizWizardSkeleton";

/** Create Quiz — 4-step wizard (`?step=` keeps the current step across reloads). */
export default function CreateQuizPage() {
  return (
    <Suspense fallback={<QuizWizardSkeleton />}>
      <CreateQuizWizard />
    </Suspense>
  );
}
