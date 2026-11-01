"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { EditQuizWizard } from "@/components/quizzes/wizard/EditQuizWizard";
import { QuizWizardSkeleton } from "@/components/quizzes/wizard/shell/QuizWizardSkeleton";

function EditQuizContent() {
  const params = useParams<{ id: string }>();
  return <EditQuizWizard key={params.id} quizId={params.id} />;
}

/** Edit Quiz — same 4-step wizard, every step reachable (`?step=settings` deep links). */
export default function EditQuizPage() {
  return (
    <Suspense fallback={<QuizWizardSkeleton />}>
      <EditQuizContent />
    </Suspense>
  );
}
