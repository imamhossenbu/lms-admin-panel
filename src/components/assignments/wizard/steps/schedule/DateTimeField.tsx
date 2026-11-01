"use client";

import React from "react";
import { CalendarDays, Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

type DateKey = "releaseDate" | "dueDate" | "windowStartDate" | "windowEndDate";
type TimeKey = "releaseTime" | "dueTime" | "windowStartTime" | "windowEndTime";

export interface DateTimeFieldProps {
  idPrefix: string;
  label: string;
  required?: boolean;
  dateName: DateKey;
  timeName: TimeKey;
  helper?: string;
}

/** Label + date input + time input (+ helper / errors) bound to two wizard fields. */
export function DateTimeField({ idPrefix, label, required, dateName, timeName, helper }: DateTimeFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const dateError = errors[dateName]?.message;
  const timeError = errors[timeName]?.message;

  return (
    <WizardField label={label} htmlFor={`${idPrefix}-date`} required={required} error={dateError ?? timeError}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <InputField
          id={`${idPrefix}-date`}
          type="date"
          aria-label={`${label} date`}
          aria-invalid={!!dateError}
          className={dateError ? "h-11 border-red bg-red-14" : "h-11"}
          leftElement={<CalendarDays className="h-4 w-4" />}
          {...register(dateName)}
        />
        <InputField
          id={`${idPrefix}-time`}
          type="time"
          aria-label={`${label} time`}
          aria-invalid={!!timeError}
          className={timeError ? "h-11 border-red bg-red-14" : "h-11"}
          leftElement={<Clock className="h-4 w-4" />}
          {...register(timeName)}
        />
      </div>
      {helper && !dateError && !timeError && <p className="mt-1.5 body-xsm-regular text-primary-300">{helper}</p>}
    </WizardField>
  );
}

export default DateTimeField;
