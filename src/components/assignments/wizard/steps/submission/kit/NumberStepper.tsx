"use client";

import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NumberStepperProps {
  id?: string;
  /** NaN = empty input. */
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  "aria-label"?: string;
  className?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** "−  [ 10 ]  +" number input. Empty input reports NaN so zod shows the field error. */
export function NumberStepper({ id, value, onChange, onBlur, min = 0, max = 1000, step = 1, disabled, invalid, className, ...rest }: NumberStepperProps) {
  const current = Number.isFinite(value) ? value : min;
  const btn =
    "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:bg-gray-bg disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        aria-label="Decrease"
        disabled={disabled || current <= min}
        onClick={() => onChange(clamp(current - step, min, max))}
        className={btn}
      >
        <Minus className="h-4 w-4" />
      </motion.button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={rest["aria-label"]}
        aria-invalid={invalid}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
        onBlur={onBlur}
        className={cn(
          "h-10 w-20 rounded-lg border px-3 body-sm-regular text-primary-500 shadow-xs outline-none transition-colors focus:border-blue disabled:opacity-50",
          invalid ? "border-red bg-red-14" : "border-dash bg-white"
        )}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        aria-label="Increase"
        disabled={disabled || current >= max}
        onClick={() => onChange(clamp(current + step, min, max))}
        className={btn}
      >
        <Plus className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export default NumberStepper;
