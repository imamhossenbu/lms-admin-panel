"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { WIZARD_TITLE_MAX, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

/** "Assignment Title *" input with a live x/200 counter. */
export function BasicTitleField() {
  const { register, control, formState } = useFormContext<AssignmentWizardValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const error = formState.errors.title?.message;

  return (
    <WizardField label="Assignment Title" htmlFor="wizard-title" required error={error}>
      <InputField
        id="wizard-title"
        placeholder="e.g. Build a Simple HTML Page"
        maxLength={WIZARD_TITLE_MAX + 20}
        aria-invalid={!!error}
        className="h-11!"
        {...register("title")}
      />
      <CharCounter count={title.length} max={WIZARD_TITLE_MAX} className="mt-1.5" />
    </WizardField>
  );
}

export default BasicTitleField;
