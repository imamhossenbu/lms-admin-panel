"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { WIZARD_RUBRIC_DESCRIPTION_MAX, WIZARD_RUBRIC_TITLE_MAX, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

/** "Rubric Title *" (x/100) and "Rubric Description (Optional)" (x/300). */
export function RubricInfoFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [title, description] = useWatch({ control, name: ["rubricTitle", "rubricDescription"] });

  return (
    <div className="space-y-4">
      <div>
        <InputField
          id="wizard-rubric-title"
          label="Rubric Title"
          required
          placeholder="e.g. HTML Page Evaluation Rubric"
          className="h-11"
          error={errors.rubricTitle?.message}
          {...register("rubricTitle")}
        />
        <CharCounter count={(title ?? "").length} max={WIZARD_RUBRIC_TITLE_MAX} className="mt-1" />
      </div>
      <WizardField label="Rubric Description" htmlFor="wizard-rubric-description" optional>
        <TextAreaField
          id="wizard-rubric-description"
          rows={3}
          placeholder="Explain how this rubric will be used to evaluate submissions."
          error={errors.rubricDescription?.message}
          {...register("rubricDescription")}
        />
        <CharCounter count={(description ?? "").length} max={WIZARD_RUBRIC_DESCRIPTION_MAX} className="mt-1" />
      </WizardField>
    </div>
  );
}

export default RubricInfoFields;
