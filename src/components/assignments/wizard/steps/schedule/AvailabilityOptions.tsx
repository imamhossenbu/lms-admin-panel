"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { SubSectionHeader } from "../submission/kit/SubSectionHeader";
import { Collapse } from "../submission/kit/Collapse";
import { DateTimeField } from "./DateTimeField";
import { formatMinutes } from "./scheduleFormat";

type Availability = AssignmentWizardValues["availability"];

const OPTIONS: ChoiceOption<Availability>[] = [
  { value: "UNTIL_DUE", title: "Available Until Due Date", description: "Students can submit anytime between release and due date." },
  { value: "TIME_LIMIT", title: "Time Limit", description: "Students have a limited time to complete after starting." },
  { value: "WINDOW", title: "Specific Availability Window", description: "Set custom start and end date for availability." },
];

/** "Availability Options" cards + time-limit minutes / custom window fields. */
export function AvailabilityOptions() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [mode, minutes] = useWatch({ control, name: ["availability", "timeLimitMinutes"] });

  return (
    <section>
      <SubSectionHeader title="Availability Options" description="Choose when and how long this assignment will be available." />
      <Controller
        control={control}
        name="availability"
        render={({ field }) => (
          <ChoiceCardGroup name="availability" aria-label="Availability Options" value={field.value} onChange={field.onChange} options={OPTIONS} columns={3} tone="blue" />
        )}
      />
      <Collapse open={mode === "TIME_LIMIT"} className="pt-4">
        <div className="flex flex-wrap items-start gap-3">
          <InputField
            id="wizard-time-limit"
            type="number"
            min={5}
            max={10080}
            label="Time Limit (minutes)"
            required
            containerClassName="max-w-56"
            error={errors.timeLimitMinutes?.message}
            {...register("timeLimitMinutes", { valueAsNumber: true })}
          />
          <p className="body-xsm-regular text-primary-300 sm:pt-10">
            Students get {formatMinutes(minutes)} after they start.
          </p>
        </div>
      </Collapse>
      <Collapse open={mode === "WINDOW"} className="pt-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <DateTimeField idPrefix="wizard-window-start" label="Window Start" required dateName="windowStartDate" timeName="windowStartTime" />
          <DateTimeField idPrefix="wizard-window-end" label="Window End" required dateName="windowEndDate" timeName="windowEndTime" />
        </div>
      </Collapse>
    </section>
  );
}

export default AvailabilityOptions;
