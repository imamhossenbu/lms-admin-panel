"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { EMPTY_LESSON_FORM, type LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";
import { RELEASE_OPTIONS } from "./settingsOptions";

export function ReleaseSetting() {
  const { control, getValues, setValue } = useFormContext<LessonFormValues>();

  /** Leaving Drip with an invalid duration would otherwise block saving through a disabled field. */
  const resetInvalidDrip = () => {
    const drip = getValues("dripValue");
    if (!Number.isInteger(drip) || drip < 1 || drip > 365) {
      setValue("dripValue", EMPTY_LESSON_FORM.dripValue, { shouldValidate: true });
    }
  };

  return (
    <SettingsRow title="Release Type" description="When should this lesson be available?">
      <Controller
        control={control}
        name="releaseType"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Release type"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              if (value !== "DRIP") resetInvalidDrip();
            }}
            options={RELEASE_OPTIONS}
            columns={3}
          />
        )}
      />
    </SettingsRow>
  );
}

export default ReleaseSetting;
