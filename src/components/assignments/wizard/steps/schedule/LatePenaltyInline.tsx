"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { PenaltyUnitSelect } from "../submission/kit/PenaltyUnitSelect";
import { FieldError } from "../submission/kit/FieldError";
import { penaltySentence } from "../submission/kit/penalty";

/**
 * "Late Penalty (Optional)" value + unit. Empty / 0 → ALLOW; a value > 0 → ALLOW_WITH_PENALTY
 * (same fields as step 3: lateSubmission / latePenalty / latePenaltyUnit).
 */
export function LatePenaltyInline() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [policy, penalty, unit] = useWatch({ control, name: ["lateSubmission", "latePenalty", "latePenaltyUnit"] });
  const withPenalty = policy === "ALLOW_WITH_PENALTY";

  const onChange = (raw: string) => {
    const n = raw === "" ? NaN : Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
      setValue("lateSubmission", "ALLOW", { shouldDirty: true });
      return;
    }
    setValue("latePenalty", n, { shouldDirty: true, shouldValidate: !!errors.latePenalty });
    setValue("lateSubmission", "ALLOW_WITH_PENALTY", { shouldDirty: true });
  };

  return (
    <div className="min-w-0">
      <label htmlFor="wizard-late-penalty" className="mb-2 block body-sm-medium text-primary-500">
        Late Penalty <span className="body-sm-regular text-primary-300">(Optional)</span>
      </label>
      <div className="flex items-center gap-2.5">
        <input
          id="wizard-late-penalty"
          type="number"
          min={0}
          placeholder="No penalty"
          value={withPenalty && Number.isFinite(penalty) ? penalty : ""}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!errors.latePenalty}
          className={
            "h-10 w-full min-w-0 rounded-lg border px-3.5 body-sm-regular text-primary-500 shadow-xs outline-none transition-colors placeholder:text-primary-300 focus:border-blue " +
            (errors.latePenalty ? "border-red bg-red-14" : "border-dash bg-white")
          }
        />
        <PenaltyUnitSelect className="w-32 shrink-0" />
      </div>
      <FieldError message={errors.latePenalty?.message} />
      <p className="mt-1.5 body-xsm-regular text-primary-300">{penaltySentence(withPenalty ? penalty : 0, unit)}</p>
    </div>
  );
}

export default LatePenaltyInline;
