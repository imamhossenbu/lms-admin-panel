"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InputField } from "@/components/ui/InputField";

export interface NumberStepperInputProps {
  id: string;
  name: string;
  /** NaN represents an empty input (lets zod report "Enter a number"). */
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  error?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

/** Whole-number input with up/down stepper buttons. */
export function NumberStepperInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  placeholder,
  error,
  className,
  inputRef,
}: NumberStepperInputProps) {
  const current = Number.isFinite(value) ? value : min;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const stepButton = (direction: 1 | -1) => (
    <motion.button
      type="button"
      tabIndex={-1}
      whileTap={{ scale: 0.92 }}
      aria-label={direction === 1 ? "Increase" : "Decrease"}
      disabled={direction === 1 ? current >= max : current <= min}
      onClick={() => onChange(clamp(current + direction * step))}
      className="flex h-3.5 w-5 items-center justify-center text-primary-300 hover:text-brand-orange disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
    >
      {direction === 1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
    </motion.button>
  );

  return (
    <InputField
      id={id}
      name={name}
      ref={inputRef}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      value={Number.isNaN(value) ? "" : value}
      onChange={(e) => onChange(e.target.value === "" ? Number.NaN : e.target.valueAsNumber)}
      onBlur={onBlur}
      error={error}
      aria-invalid={!!error}
      containerClassName={className}
      className="no-spinner"
      rightElement={
        <span className="flex flex-col">
          {stepButton(1)}
          {stepButton(-1)}
        </span>
      }
    />
  );
}

export default NumberStepperInput;
