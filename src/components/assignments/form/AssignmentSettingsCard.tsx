"use client";

import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { CalendarDays, Clock, Settings } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";
import { ATTEMPT_OPTIONS, LATE_OPTIONS } from "./assignmentFormConfig";
import { AssignmentSelectField } from "./AssignmentSelectField";

export interface AssignmentSettingsCardProps {
  form: UseFormReturn<AssignmentFormValues>;
}

/** Due Date / Due Time / Total Points / Submission Attempts / Late Submission. */
export function AssignmentSettingsCard({ form }: AssignmentSettingsCardProps) {
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <IconSectionCard icon={<Settings className="h-5 w-5" />} title="Assignment Settings" description="Configure deadlines, grading and other settings.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="assignment-due-date"
            type="date"
            label="Due Date"
            required
            leftElement={<CalendarDays className="h-4 w-4" />}
            error={errors.dueDate?.message}
            {...register("dueDate", { deps: ["dueTime"] })}
          />
          <InputField
            id="assignment-due-time"
            type="time"
            label="Due Time"
            required
            leftElement={<Clock className="h-4 w-4" />}
            error={errors.dueTime?.message}
            {...register("dueTime", { deps: ["dueDate"] })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputField
              id="assignment-points"
              type="number"
              inputMode="numeric"
              min={1}
              max={1000}
              label="Total Points"
              required
              className="no-spinner"
              error={errors.totalPoints?.message}
              {...register("totalPoints", { valueAsNumber: true })}
            />
            {!errors.totalPoints && <p className="mt-1.5 body-xsm-regular text-primary-300">Maximum points for this assignment.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="attempts"
            render={({ field }) => (
              <AssignmentSelectField
                label="Submission Attempts"
                value={field.value}
                onChange={field.onChange}
                options={ATTEMPT_OPTIONS}
                helper="Number of times a student can submit."
                error={errors.attempts?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="lateSubmission"
            render={({ field }) => (
              <AssignmentSelectField
                label="Late Submission"
                value={field.value}
                onChange={field.onChange}
                options={LATE_OPTIONS}
                helper="Allow or restrict late submissions."
                error={errors.lateSubmission?.message}
              />
            )}
          />
        </div>
      </div>
    </IconSectionCard>
  );
}

export default AssignmentSettingsCard;
