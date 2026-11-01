"use client";

import { useMemo } from "react";
import { quizStepOfField, quizWizardSchema, type QuizWizardStep, type QuizWizardValues } from "@/validations/quizWizardSchema";

/** Steps whose current values fail validation (computed live, so Review flags them before saving). */
export function useReviewIssues(values: QuizWizardValues) {
  return useMemo(() => {
    const parsed = quizWizardSchema.safeParse(values);
    const steps = new Set<QuizWizardStep>();
    if (!parsed.success) parsed.error.issues.forEach((i) => steps.add(quizStepOfField(String(i.path[0] ?? "title"))));
    return steps;
  }, [values]);
}

export default useReviewIssues;
