"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, Clock } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { Collapse } from "./Collapse";
import { SettingToggleRow } from "../../shared/SettingToggleRow";

/** "Enrollment & Date Restrictions": toggle + start/end date and time. */
export function DateRestrictionCard() {
  const { control, register, formState } = useFormContext<LessonEditorValues>();
  const enabled = useWatch({ control, name: "access.dateRestriction.enabled" });
  const errors = formState.errors.access?.dateRestriction;
  const calendar = <CalendarDays className="h-4 w-4" />;
  const clock = <Clock className="h-4 w-4" />;

  return (
    <EditorSectionCard icon={<CalendarDays className="h-5 w-5" />} title="Enrollment & Date Restrictions" description="Set time-based access rules for this lesson.">
      <Controller
        control={control}
        name="access.dateRestriction.enabled"
        render={({ field }) => (
          <SettingToggleRow
            id="access-date-restriction"
            checked={field.value}
            onChange={field.onChange}
            title="Enable date restriction"
            description="Students can only access this lesson within a specific date range."
          />
        )}
      />
      <Collapse show={enabled} className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">
        <InputField id="access-start-date" type="date" label="Start Date" leftElement={calendar} error={errors?.startDate?.message} {...register("access.dateRestriction.startDate")} />
        <InputField id="access-start-time" type="time" label="Start Time" leftElement={clock} error={errors?.startTime?.message} {...register("access.dateRestriction.startTime")} />
        <InputField id="access-end-date" type="date" label="End Date" leftElement={calendar} error={errors?.endDate?.message} {...register("access.dateRestriction.endDate")} />
        <InputField id="access-end-time" type="time" label="End Time" leftElement={clock} error={errors?.endTime?.message} {...register("access.dateRestriction.endTime")} />
      </Collapse>
    </EditorSectionCard>
  );
}

export default DateRestrictionCard;
