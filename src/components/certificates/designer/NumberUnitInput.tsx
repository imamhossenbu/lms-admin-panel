"use client";

import React from "react";
import { InputField } from "@/components/ui/InputField";

export interface NumberUnitInputProps {
  id: string;
  value: number | null;
  onChange: (value: number) => void;
  onBlur?: () => void;
  unit: string;
  min: number;
  max: number;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/** Numeric input with a unit suffix ("%", "months"). Empty input → NaN (validated by the schema). */
export function NumberUnitInput({ id, value, onChange, onBlur, unit, min, max, placeholder, error, disabled }: NumberUnitInputProps) {
  return (
    <InputField
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      error={error}
      value={value === null || Number.isNaN(value) ? "" : value}
      onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
      onBlur={onBlur}
      rightElement={<span className="body-xsm-medium text-primary-300">{unit}</span>}
      className="disabled:opacity-60"
    />
  );
}

export default NumberUnitInput;
