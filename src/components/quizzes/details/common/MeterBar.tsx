"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type MeterTone = "green" | "red" | "blue" | "yellow" | "orange";

const FILL: Record<MeterTone, string> = {
  green: "bg-green",
  red: "bg-red",
  blue: "bg-blue",
  yellow: "bg-yellow",
  orange: "bg-brand-orange",
};

export interface MeterBarProps {
  /** 0–100. */
  value: number;
  tone: MeterTone;
  className?: string;
  label?: string;
}

/** Thin animated progress track (pass/fail rates, correct %, insight bars). */
export function MeterBar({ value, tone, className, label }: MeterBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-gray-bg", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", FILL[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

export default MeterBar;
