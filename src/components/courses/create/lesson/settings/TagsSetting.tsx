"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TagsInput } from "@/components/ui/TagsInput";
import { LESSON_TAGS_MAX, type LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";

export function TagsSetting() {
  const { control } = useFormContext<LessonFormValues>();
  return (
    <SettingsRow title="Lesson Tags" optional description="Add tags to help organize your content." htmlFor="lesson-tags">
      <Controller
        control={control}
        name="tags"
        render={({ field, fieldState }) => (
          <TagsInput
            id="lesson-tags"
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. HTML, Basics, Web Development"
            maxTags={LESSON_TAGS_MAX}
            error={fieldState.error?.message}
          />
        )}
      />
      <p className="body-xsm-regular text-primary-300 mt-1.5">Press Enter to add multiple tags</p>
    </SettingsRow>
  );
}

export default TagsSetting;
