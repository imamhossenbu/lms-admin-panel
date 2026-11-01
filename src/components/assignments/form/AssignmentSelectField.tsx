"use client";

import React from "react";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { EditorFieldLabel } from "@/components/courses/lesson-editor/fields/FieldLabel";
import { FieldError } from "@/components/courses/lesson-editor/fields/FieldError";
import { cn } from "@/lib/cn";

export interface AssignmentSelectFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
}

/** Label + AppSelect + helper text / field error. */
export function AssignmentSelectField({ label, required, value, onChange, options, placeholder, helper, error, disabled }: AssignmentSelectFieldProps) {
  return (
    <div className="min-w-0">
      <EditorFieldLabel required={required}>{label}</EditorFieldLabel>
      <AppSelect
        value={value}
        onValueChange={onChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
        triggerClassName={cn("w-full", error ? "border-red bg-red-14" : "bg-white")}
      />
      {error ? <FieldError message={error} /> : helper && <p className="mt-1.5 body-xsm-regular text-primary-300">{helper}</p>}
    </div>
  );
}

export default AssignmentSelectField;
