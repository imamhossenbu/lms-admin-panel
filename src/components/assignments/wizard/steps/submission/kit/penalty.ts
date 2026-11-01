import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";

export const PENALTY_UNIT_OPTIONS = [
  { value: "PERCENT", label: "%" },
  { value: "POINTS", label: "points" },
];

/** "Deduct 10% from total points for late submissions." */
export function penaltySentence(penalty: number, unit: AssignmentWizardValues["latePenaltyUnit"]) {
  if (!Number.isFinite(penalty) || penalty <= 0) return "No points are deducted for late submissions.";
  return unit === "PERCENT"
    ? `Deduct ${penalty}% from total points for late submissions.`
    : `Deduct ${penalty} point${penalty === 1 ? "" : "s"} from the total for late submissions.`;
}
