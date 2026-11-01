"use client";

import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NumberStepperProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min: number;
  max: number;
  step?: number;
  /** Suffix shown inside the field ("chars", "min"). */
  unit?: string;
  error?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

/** − [ value unit ] + — numeric field with step buttons, clamped to min/max. Empty → NaN (schema reports it). */
export function NumberStepper({ id, value, onChange, onBlur, min, max, step = 1, unit, error, disabled, ...rest }: NumberStepperProps) {
  const current = Number.isFinite(value) ? value : min;
  const bump = (dir: 1 | -1) => onChange(Math.min(max, Math.max(min, current + dir * step)));

  const btn = "flex h-10 w-10 shrink-0 items-center justify-center text-primary-400 transition-colors hover:bg-slate-50 hover:text-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div>
      <div
        className={cn(
          "inline-flex items-stretch overflow-hidden rounded-lg border shadow-2xs transition-colors focus-within:border-brand-orange",
          error ? "border-red bg-red-14" : "border-dash bg-white",
          disabled && "opacity-60"
        )}
      >
        <motion.button type="button" whileTap={{ scale: 0.92 }} aria-label="Decrease" disabled={disabled || current <= min} onClick={() => bump(-1)} className={cn(btn, "border-r border-dash")}>
          <Minus className="h-4 w-4" />
        </motion.button>
        <label htmlFor={id} className="flex items-center gap-1.5 px-3">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label={rest["aria-label"]}
            aria-invalid={!!error}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
            onBlur={onBlur}
            className="w-12 bg-transparent text-center body-sm-medium font-semibold! tabular-nums text-primary-500 outline-none appearance-none"
          />
          {unit && <span className="body-xsm-medium text-primary-300 whitespace-nowrap">{unit}</span>}
        </label>
        <motion.button type="button" whileTap={{ scale: 0.92 }} aria-label="Increase" disabled={disabled || current >= max} onClick={() => bump(1)} className={cn(btn, "border-l border-dash")}>
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 body-xsm-regular text-red">
          {error}
        </p>
      )}
    </div>
  );
}

export default NumberStepper;
