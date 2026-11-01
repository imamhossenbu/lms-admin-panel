"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";
import { ScheduledAtField } from "./ScheduledAtField";
import { VISIBILITY_OPTIONS } from "./settingsOptions";

export function VisibilitySetting() {
  const { control, clearErrors } = useFormContext<LessonFormValues>();
  const visibility = useWatch({ control, name: "visibility" });

  return (
    <SettingsRow title="Visibility" description="Control who can access this lesson.">
      <Controller
        control={control}
        name="visibility"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Visibility"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              if (value !== "SCHEDULED") clearErrors("scheduledAt");
            }}
            options={VISIBILITY_OPTIONS}
            columns={3}
          />
        )}
      />
      <AnimatePresence initial={false}>{visibility === "SCHEDULED" && <ScheduledAtField key="scheduled" />}</AnimatePresence>
    </SettingsRow>
  );
}

export default VisibilitySetting;
