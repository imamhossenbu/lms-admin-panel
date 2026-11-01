import type React from "react";
import type { QuizCourseRef } from "@/types/quiz";
import type { QuizWizardStep } from "@/validations/quizWizardSchema";

/**
 * Props every Quiz wizard step receives. Steps read/write the form with
 * `useFormContext<QuizWizardValues>()` and render their OWN body (main + right side cards).
 * Place `footer` at the bottom (full width under the step body): "← Previous" (or Cancel on step 1)
 * left, orange "Save & Continue →" right; on Review: "Save as Draft" + "Publish Quiz".
 */
export interface QuizStepProps {
  mode: "create" | "edit";
  courses: QuizCourseRef[];
  footer: React.ReactNode;
  onGoToStep: (step: QuizWizardStep) => void;
}
