"use client";

import React from "react";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { cn } from "@/lib/cn";

export interface FormSelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  helper?: string;
  className?: string;
}

/** Label + AppSelect + error / helper line (react-hook-form friendly). */
export function FormSelectField({ id, label, required, value, onChange, options, placeholder, error, disabled, helper, className }: FormSelectFieldProps) {
  return (
    <div className={cn("w-full", className)} id={id}>
      <FieldLabel label={label} required={required} />
      <AppSelect
        value={value}
        onValueChange={onChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
        triggerClassName={cn("w-full body-sm-regular", error ? "border-red bg-red-14" : "bg-white", !value && "text-primary-300")}
      />
      {error ? <FieldError message={error} /> : helper ? <p className="mt-1.5 body-xsm-regular text-primary-300">{helper}</p> : null}
    </div>
  );
}

export default FormSelectField;
