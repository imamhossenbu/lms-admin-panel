"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { SettingsRow } from "./SettingsRow";
import { DRIP_UNIT_OPTIONS } from "./settingsOptions";

/** Drip duration (number + Days/Weeks). Only editable when release type is "Drip Content". */
export function DripDurationField() {
  const { control } = useFormContext<LessonFormValues>();
  const releaseType = useWatch({ control, name: "releaseType" });
  const disabled = releaseType !== "DRIP";

  return (
    <SettingsRow
      title="Drip Duration"
      description="Set when this lesson will be released after enrollment."
      htmlFor="lesson-drip-value"
      muted={disabled}
    >
      <div className="flex items-start gap-3">
        <Controller
          control={control}
          name="dripValue"
          render={({ field, fieldState }) => (
            <InputField
              id="lesson-drip-value"
              type="number"
              inputMode="numeric"
              min={1}
              max={365}
              step={1}
              disabled={disabled}
              aria-label="Drip duration"
              containerClassName="max-w-32"
              className="disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-primary-300"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={Number.isNaN(field.value) ? "" : field.value}
              onChange={(e) => field.onChange(e.target.value === "" ? Number.NaN : e.target.valueAsNumber)}
              error={disabled ? undefined : fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="dripUnit"
          render={({ field }) => (
            <AppSelect
              value={field.value}
              onValueChange={field.onChange}
              options={DRIP_UNIT_OPTIONS}
              disabled={disabled}
              className="w-36"
              fullWidth
              triggerClassName="disabled:bg-slate-50"
            />
          )}
        />
      </div>
    </SettingsRow>
  );
}

export default DripDurationField;
