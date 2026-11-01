"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Clock } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";
import { SelectController } from "./SelectController";
import { difficultyOptions, unitOptions } from "./basicOptions";

/** Difficulty Level (Optional) select + Estimated Time (Optional) number with Hours/Minutes unit. */
export function DifficultyTimeFields() {
  const { register, control, formState } = useFormContext<AssignmentWizardValues>();
  const timeError = formState.errors.estimatedTime?.message;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <SelectController name="difficulty" label="Difficulty Level" optional options={difficultyOptions} />
      <WizardField label="Estimated Time" htmlFor="wizard-estimated-time" optional error={timeError}>
        <div className="flex gap-3">
          <InputField
            id="wizard-estimated-time"
            type="number"
            min={0}
            max={1000}
            step="any"
            inputMode="decimal"
            aria-invalid={!!timeError}
            leftElement={<Clock className="h-4 w-4" />}
            containerClassName="flex-1"
            className="h-11!"
            {...register("estimatedTime", { valueAsNumber: true })}
          />
          <Controller
            control={control}
            name="estimatedUnit"
            render={({ field }) => (
              <AppSelect value={field.value} onValueChange={field.onChange} options={unitOptions} className="w-36" fullWidth triggerClassName="h-11" />
            )}
          />
        </div>
      </WizardField>
    </div>
  );
}

export default DifficultyTimeFields;
