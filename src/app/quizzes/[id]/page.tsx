"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { QuizDetailsView } from "@/components/quizzes/details/QuizDetailsView";
import { QuizDetailsSkeleton } from "@/components/quizzes/details/QuizDetailsSkeleton";

/** Quiz Details: Overview, Questions, Submissions, Analytics and Activity Log tabs (`?tab=`). */
function QuizDetailsContent() {
  const params = useParams<{ id: string }>();
  return <QuizDetailsView key={params.id} quizId={params.id} />;
}

export default function QuizDetailsPage() {
  return (
    <Suspense fallback={<QuizDetailsSkeleton />}>
      <QuizDetailsContent />
    </Suspense>
  );
}
