"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { RefreshCw } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { SubSectionHeader } from "./kit/SubSectionHeader";
import { FieldError } from "./kit/FieldError";

type AttemptsMode = AssignmentWizardValues["attemptsMode"];

const OPTIONS: ChoiceOption<AttemptsMode>[] = [
  { value: "UNLIMITED", title: "Unlimited Attempts", description: "Students can resubmit multiple times" },
  { value: "LIMITED", title: "Limited Attempts", description: "Maximum number of attempts" },
  { value: "SINGLE", title: "Single Attempt", description: "Students can only submit once" },
];

/** "Submission Attempts": Unlimited / Limited (number, enabled only when selected) / Single. */
export function AttemptsSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const mode = useWatch({ control, name: "attemptsMode" });
  const limited = mode === "LIMITED";

  return (
    <section>
      <SubSectionHeader icon={<RefreshCw className="h-5 w-5" />} title="Submission Attempts" description="Set how many times students can submit their work." />
      <Controller
        control={control}
        name="attemptsMode"
        render={({ field }) => (
          <ChoiceCardGroup name="attempts-mode" aria-label="Submission Attempts" value={field.value} onChange={field.onChange} options={OPTIONS} columns={3} tone="blue" />
        )}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor="wizard-max-attempts" className={limited ? "body-sm-regular text-primary-400" : "body-sm-regular text-primary-300"}>
          Maximum attempts
        </label>
        <InputField
          id="wizard-max-attempts"
          type="number"
          min={2}
          max={10}
          // readOnly (not disabled): react-hook-form drops values of disabled inputs.
          readOnly={!limited}
          tabIndex={limited ? undefined : -1}
          aria-disabled={!limited}
          containerClassName="max-w-24"
          className={limited ? "" : "cursor-not-allowed opacity-50"}
          aria-invalid={limited && !!errors.maxAttempts}
          {...register("maxAttempts", { valueAsNumber: true })}
        />
        <span className="body-xsm-regular text-primary-300">{limited ? "Between 2 and 10." : "Select “Limited Attempts” to set a number."}</span>
      </div>
      {limited && <FieldError message={errors.maxAttempts?.message} />}
    </section>
  );
}

export default AttemptsSection;
