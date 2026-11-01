import type { WizardCriterion } from "@/validations/assignmentWizardSchema";

/** useFieldArray item for `criteria` (keyName "fieldKey"). */
export type CriterionField = WizardCriterion & { fieldKey: string };
