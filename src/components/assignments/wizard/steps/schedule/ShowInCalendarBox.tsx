"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CalendarCheck } from "lucide-react";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { ToggleBox } from "../submission/kit/ToggleBox";

/** "Show in Calendar" toggle box. */
export function ShowInCalendarBox() {
  const { control } = useFormContext<AssignmentWizardValues>();
  return (
    <Controller
      control={control}
      name="showInCalendar"
      render={({ field }) => (
        <ToggleBox
          icon={<CalendarCheck className="h-5 w-5" />}
          title="Show in Calendar"
          description="Display this assignment in the course calendar for students."
          checked={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}

export default ShowInCalendarBox;
