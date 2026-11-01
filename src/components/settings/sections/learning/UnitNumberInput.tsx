"use client";

import React from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";

export interface UnitNumberInputProps {
  id: string;
  name: string;
  /** Suffix shown inside the input, e.g. "%" or "MB". */
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/** Numeric input with a unit suffix, registered as a number (empty → validation error). */
export function UnitNumberInput({ id, name, unit, min, max, step = 1, placeholder, error, disabled, className }: UnitNumberInputProps) {
  const { register } = useFormContext<FieldValues>();
  return (
    <InputField
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      error={error}
      containerClassName={className}
      className="no-spinner tabular-nums"
      rightElement={<span className="body-xsm-medium text-primary-300">{unit}</span>}
      {...register(name as Path<FieldValues>, { valueAsNumber: true })}
    />
  );
}

export default UnitNumberInput;
