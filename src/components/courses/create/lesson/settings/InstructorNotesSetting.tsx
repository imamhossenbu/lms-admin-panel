"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { cn } from "@/lib/cn";
import { LESSON_NOTES_MAX, type LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";

export function InstructorNotesSetting() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<LessonFormValues>();
  const notes = useWatch({ control, name: "instructorNotes" }) ?? "";

  return (
    <SettingsRow
      title="Notes for Instructors"
      optional
      description="Add private notes for instructors (not visible to students)."
      htmlFor="lesson-instructor-notes"
    >
      <TextAreaField
        id="lesson-instructor-notes"
        rows={3}
        maxLength={LESSON_NOTES_MAX}
        placeholder="Add notes, reminders or guidelines for instructors..."
        className="resize-y"
        error={errors.instructorNotes?.message}
        {...register("instructorNotes")}
      />
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="body-xsm-regular text-primary-300">Add private notes for instructors (not visible to students).</p>
        <span
          className={cn(
            "body-xsm-regular shrink-0 tabular-nums",
            notes.length >= LESSON_NOTES_MAX ? "text-red" : "text-primary-300"
          )}
        >
          {notes.length}/{LESSON_NOTES_MAX}
        </span>
      </div>
    </SettingsRow>
  );
}

export default InstructorNotesSetting;
