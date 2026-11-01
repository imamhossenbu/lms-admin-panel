"use client";

import React, { Suspense } from "react";
import { QuizzesListView } from "@/components/quizzes/list/QuizzesListView";
import { QuizzesListSkeleton } from "@/components/quizzes/list/QuizzesListSkeleton";

/** Quizzes list (`?q`, `?course`, `?module`, `?status`, `?difficulty`, `?page`, `?perPage`, `?view`, `?sort` survive reloads). */
export default function QuizzesPage() {
  return (
    <Suspense fallback={<QuizzesListSkeleton />}>
      <QuizzesListView />
    </Suspense>
  );
}
