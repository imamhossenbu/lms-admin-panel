"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { LESSON_SUMMARY_MAX, LESSON_TITLE_MAX, type LessonFormValues } from "@/validations/lessonFormSchema";
import { FieldLabel } from "../../basic/FieldLabel";

/** Lesson Title (x/200) + Short Description (x/500). */
export function LessonTextFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LessonFormValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const summary = useWatch({ control, name: "summary" }) ?? "";

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="lesson-title" label="Lesson Title" required count={title.length} max={LESSON_TITLE_MAX} />
        <InputField
          id="lesson-title"
          placeholder="e.g. What is HTML?"
          maxLength={LESSON_TITLE_MAX}
          autoFocus
          aria-invalid={!!errors.title}
          error={errors.title?.message}
          {...register("title")}
        />
      </div>
      <div>
        <FieldLabel htmlFor="lesson-summary" label="Short Description" count={summary.length} max={LESSON_SUMMARY_MAX} />
        <TextAreaField
          id="lesson-summary"
          rows={3}
          maxLength={LESSON_SUMMARY_MAX}
          placeholder="Briefly describe what students will learn in this lesson"
          error={errors.summary?.message}
          className="resize-y"
          {...register("summary")}
        />
      </div>
    </div>
  );
}

export default LessonTextFields;
