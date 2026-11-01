"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { WIZARD_SHORT_DESCRIPTION_MAX, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { plainText } from "../../wizardFormat";
import { WizardField } from "../../shell/WizardField";

/** "Short Description *" rich-text editor with a live x/500 (plain text) counter. */
export function ShortDescriptionField() {
  const { control } = useFormContext<AssignmentWizardValues>();
  return (
    <Controller
      control={control}
      name="shortDescriptionHtml"
      render={({ field, fieldState }) => (
        <WizardField label="Short Description" required error={fieldState.error?.message}>
          <div onBlur={field.onBlur}>
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Summarise what students will build or learn in this assignment..."
              minHeight="120px"
            />
          </div>
          <CharCounter count={plainText(field.value).length} max={WIZARD_SHORT_DESCRIPTION_MAX} className="mt-1.5" />
        </WizardField>
      )}
    />
  );
}

export default ShortDescriptionField;
