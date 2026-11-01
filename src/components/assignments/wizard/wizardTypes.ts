import type React from "react";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { WizardStep } from "@/validations/assignmentWizardSchema";

/**
 * Props every wizard step receives from AssignmentWizardView. Steps read/write the form with
 * `useFormContext<AssignmentWizardValues>()` and render their OWN two-column body
 * (main card(s) ~2/3 + right side cards ~1/3). Put `footer` at the bottom of the main column
 * (design: "← Previous" left, blue "Save & Continue →" right).
 */
export interface WizardStepProps {
  context: LessonEditorContext;
  mode: "create" | "edit";
  footer: React.ReactNode;
  /** Jump to another step (Review "Edit" buttons). */
  onGoToStep: (step: WizardStep) => void;
  /** Report uploads in progress so the shell can block navigation/saving. */
  onUploadingChange?: (uploading: boolean) => void;
}
