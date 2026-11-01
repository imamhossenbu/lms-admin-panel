"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BarChart3, CheckCircle2, LetterText } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

type GradingType = AssignmentWizardValues["gradingType"];

const OPTIONS: ChoiceOption<GradingType>[] = [
  { value: "POINTS", title: "Points Based", description: "Grade using total points", icon: <BarChart3 className="h-5 w-5 text-blue" /> },
  { value: "PASS_FAIL", title: "Pass / Fail", description: "Mark as pass or fail only", icon: <CheckCircle2 className="h-5 w-5 text-green" /> },
  { value: "LETTER", title: "Letter Grade", description: "Use letter grades (A, B, C, etc.)", icon: <LetterText className="h-5 w-5 text-blue" /> },
];

/** "Grading Method *" cards. */
export function GradingMethodField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  return (
    <WizardField label="Grading Method" required error={errors.gradingType?.message}>
      <Controller
        control={control}
        name="gradingType"
        render={({ field }) => (
          <ChoiceCardGroup name="grading-method" aria-label="Grading Method" value={field.value} onChange={field.onChange} options={OPTIONS} columns={3} tone="blue" />
        )}
      />
    </WizardField>
  );
}

export default GradingMethodField;
