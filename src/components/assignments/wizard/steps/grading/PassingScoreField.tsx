"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

/** "Passing Score (Optional)" — empty input = null (no passing score). */
export function PassingScoreField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [total, passing] = useWatch({ control, name: ["totalPoints", "passingScore"] });
  const totalLabel = Number.isFinite(total) ? total : "—";

  return (
    <WizardField label="Passing Score" htmlFor="wizard-passing-score" optional>
      <Controller
        control={control}
        name="passingScore"
        render={({ field }) => (
          <InputField
            id="wizard-passing-score"
            type="number"
            min={0}
            placeholder="No passing score"
            className="h-11 pr-24!"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errors.passingScore?.message}
            rightElement={<span className="whitespace-nowrap body-sm-regular text-primary-300">out of {totalLabel}</span>}
          />
        )}
      />
      {!errors.passingScore && (
        <p className="mt-1.5 body-xsm-regular text-primary-300">
          {passing === null || passing === undefined ? "Leave empty if there is no passing score." : `Students must score at least ${passing} points to pass.`}
        </p>
      )}
    </WizardField>
  );
}

export default PassingScoreField;
