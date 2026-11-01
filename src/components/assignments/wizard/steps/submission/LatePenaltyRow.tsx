"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Info } from "lucide-react";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { NumberStepper } from "./kit/NumberStepper";
import { PenaltyUnitSelect } from "./kit/PenaltyUnitSelect";
import { FieldError } from "./kit/FieldError";
import { penaltySentence } from "./kit/penalty";

/** "Late Submission Penalty (Optional)": − value + stepper, % / points, live sentence. */
export function LatePenaltyRow() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [penalty, unit, totalPoints] = useWatch({ control, name: ["latePenalty", "latePenaltyUnit", "totalPoints"] });
  const max = unit === "PERCENT" ? 100 : Math.max(1, totalPoints || 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-blue bg-blue-14 p-4 sm:flex-row sm:items-start">
      <Info className="mt-1 h-5 w-5 shrink-0 text-blue" />
      <div className="min-w-0 flex-1">
        <p className="mb-2 body-sm-medium text-primary-500">
          Late Submission Penalty <span className="body-sm-regular text-primary-300">(Optional)</span>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Controller
            control={control}
            name="latePenalty"
            render={({ field }) => (
              <NumberStepper
                aria-label="Late penalty"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={0}
                max={max}
                invalid={!!errors.latePenalty}
              />
            )}
          />
          <PenaltyUnitSelect className="w-28" />
          <p className="body-sm-regular text-primary-400">{penaltySentence(penalty, unit)}</p>
        </div>
        <FieldError message={errors.latePenalty?.message} />
      </div>
    </div>
  );
}

export default LatePenaltyRow;
