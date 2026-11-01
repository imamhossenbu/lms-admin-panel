"use client";

import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { WIZARD_INSTRUCTIONS_MAX, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { plainText } from "../../wizardFormat";
import { WizardField } from "../../shell/WizardField";
import { INSTRUCTIONS_TEMPLATE } from "./instructionsTemplate";

/** "Detailed Instructions *" editor (x/5000). New, empty instructions are prefilled with a helpful template. */
export function DetailedInstructionsField({ prefill }: { prefill: boolean }) {
  const { control, getValues, setValue } = useFormContext<AssignmentWizardValues>();

  useEffect(() => {
    if (prefill && !plainText(getValues("instructionsHtml"))) setValue("instructionsHtml", INSTRUCTIONS_TEMPLATE, { shouldDirty: true });
  }, [prefill, getValues, setValue]);

  return (
    <Controller
      control={control}
      name="instructionsHtml"
      render={({ field, fieldState }) => (
        <WizardField label="Detailed Instructions" required error={fieldState.error?.message}>
          <div onBlur={field.onBlur}>
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Explain exactly what students need to do, the requirements and how to submit..."
              minHeight="360px"
            />
          </div>
          <CharCounter count={plainText(field.value).length} max={WIZARD_INSTRUCTIONS_MAX} className="mt-1.5" />
          <p className="mt-3 flex items-center gap-2.5 rounded-xl border border-blue/20 bg-blue-14 px-4 py-3 body-sm-regular text-primary-400">
            <Info className="h-4 w-4 shrink-0 text-blue" />
            You can use formatting, lists, links and images to make your instructions clearer.
          </p>
        </WizardField>
      )}
    />
  );
}

export default DetailedInstructionsField;
