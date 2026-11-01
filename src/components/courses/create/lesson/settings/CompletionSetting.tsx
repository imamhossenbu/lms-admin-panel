"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";
import { COMPLETION_OPTIONS } from "./settingsOptions";

export function CompletionSetting() {
  const { control } = useFormContext<LessonFormValues>();
  return (
    <SettingsRow title="Completion Settings" description="Define how this lesson will be marked as completed.">
      <Controller
        control={control}
        name="completion"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Completion settings"
            value={field.value}
            onChange={field.onChange}
            options={COMPLETION_OPTIONS}
            columns={3}
          />
        )}
      />
    </SettingsRow>
  );
}

export default CompletionSetting;
