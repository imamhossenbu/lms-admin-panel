"use client";

import React from "react";
import { useController, useFormContext, type FieldPathByValue } from "react-hook-form";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";

export interface ControlledSelectFieldProps {
  name: FieldPathByValue<LessonEditorValues, string>;
  label: string;
  options: AppSelectOption[];
  /** Helper under the select; may depend on the current value. */
  helper?: React.ReactNode | ((value: string) => React.ReactNode);
  disabled?: boolean;
}

/** AppSelect bound to a string / enum field of the page form, with label + helper text. */
export function ControlledSelectField({ name, label, options, helper, disabled }: ControlledSelectFieldProps) {
  const { control } = useFormContext<LessonEditorValues>();
  const { field, fieldState } = useController({ control, name });
  const value = String(field.value ?? "");
  const helperNode = typeof helper === "function" ? helper(value) : helper;
  return (
    <div className="min-w-0">
      <FieldLabel label={label} />
      <AppSelect value={value} onValueChange={field.onChange} options={options} fullWidth disabled={disabled} />
      {fieldState.error?.message ? (
        <p className="mt-1.5 body-xsm-regular text-red">{fieldState.error.message}</p>
      ) : (
        helperNode && <p className="mt-1.5 body-xsm-regular text-primary-300">{helperNode}</p>
      )}
    </div>
  );
}

export default ControlledSelectField;
