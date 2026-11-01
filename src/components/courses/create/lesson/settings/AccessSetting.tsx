"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";
import { ACCESS_OPTIONS } from "./settingsOptions";

export function AccessSetting() {
  const { control } = useFormContext<LessonFormValues>();
  return (
    <SettingsRow title="Lesson Access" optional description="Restrict access to specific plans or groups.">
      <Controller
        control={control}
        name="access"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Lesson access"
            variant="inline"
            value={field.value}
            onChange={field.onChange}
            options={ACCESS_OPTIONS}
            className="md:pt-1"
          />
        )}
      />
    </SettingsRow>
  );
}

export default AccessSetting;
