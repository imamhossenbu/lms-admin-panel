import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";

export const GRADING_METHOD_LABEL: Record<AssignmentWizardValues["gradingType"], string> = {
  POINTS: "Points Based",
  PASS_FAIL: "Pass / Fail",
  LETTER: "Letter Grade",
};

export const GRADE_DISPLAY_LABEL: Record<AssignmentWizardValues["gradeDisplay"], string> = {
  EXACT: "Exact Score",
  GRADE_ONLY: "Grade Only",
};

/** "24 (75%)" or "Not set". */
export function passingScoreLabel(passing: number | null, total: number) {
  if (passing === null || !Number.isFinite(passing)) return "Not set";
  if (!Number.isFinite(total) || total <= 0) return String(passing);
  return `${passing} (${Math.round((passing / total) * 100)}%)`;
}
