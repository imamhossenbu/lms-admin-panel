"use client";

import React from "react";
import { useController, useFormContext, type FieldPathByValue } from "react-hook-form";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { SettingToggleRow } from "../shared/SettingToggleRow";

export interface ControlledToggleRowProps {
  /** Boolean field of the Edit Lesson form, e.g. "quiz.showCorrectAnswers". */
  name: FieldPathByValue<LessonEditorValues, boolean>;
  title: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** SettingToggleRow bound to a boolean field of the page form. */
export function ControlledToggleRow({ name, title, description, disabled, className }: ControlledToggleRowProps) {
  const { control } = useFormContext<LessonEditorValues>();
  const { field } = useController({ control, name });
  return (
    <SettingToggleRow
      id={`lesson-editor-${name.replace(/\./g, "-")}`}
      title={title}
      description={description}
      checked={Boolean(field.value)}
      onChange={field.onChange}
      disabled={disabled}
      className={className}
    />
  );
}

export default ControlledToggleRow;
