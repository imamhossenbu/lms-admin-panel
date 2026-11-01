"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { BrainCircuit } from "lucide-react";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { WIZARD_AI_CRITERIA_MAX, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { ToggleBox } from "../submission/kit/ToggleBox";

/** "Enable AI Assisted Grading (Optional)" toggle + "AI Evaluation Criteria" textarea. */
export function AiGradingBox() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const criteria = useWatch({ control, name: "aiGradingCriteria" }) ?? "";

  return (
    <Controller
      control={control}
      name="aiGradingEnabled"
      render={({ field }) => (
        <ToggleBox
          icon={<BrainCircuit className="h-5 w-5" />}
          title="Enable AI Assisted Grading"
          hint="(Optional)"
          description="Use AI to help evaluate and suggest grades for student submissions."
          checked={field.value}
          onChange={field.onChange}
        >
          <label htmlFor="wizard-ai-criteria" className="mb-2 block body-sm-medium text-primary-500">
            AI Evaluation Criteria
          </label>
          <TextAreaField
            id="wizard-ai-criteria"
            rows={3}
            maxLength={WIZARD_AI_CRITERIA_MAX + 50}
            placeholder="e.g. Evaluate the HTML structure, use of proper tags, headings, paragraphs and hyperlinks."
            error={errors.aiGradingCriteria?.message}
            {...register("aiGradingCriteria")}
          />
          <CharCounter count={criteria.length} max={WIZARD_AI_CRITERIA_MAX} className="mt-1" />
        </ToggleBox>
      )}
    />
  );
}

export default AiGradingBox;
