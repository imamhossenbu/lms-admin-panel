"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import type { ToggleState } from "@/lib/teamPermissions";
import { cn } from "@/lib/cn";

export interface PermissionCheckboxProps {
  state: ToggleState;
  onChange?: (on: boolean) => void;
  label: string;
  disabled?: boolean;
  /** Read-only display (no hover/press, keeps full colour). */
  readOnly?: boolean;
  size?: "sm" | "md";
  /** "role" = orange (granted by the role), "extra" = blue (extra permission on top of the role). */
  tone?: "role" | "extra";
}

/** Orange (role) / blue (extra) checkbox with a mixed state, used by the permission matrix (cells, row "All", column headers). */
export function PermissionCheckbox({ state, onChange, label, disabled, readOnly, size = "md", tone = "role" }: PermissionCheckboxProps) {
  const on = state !== "off";
  const box = size === "sm" ? "h-4.5 w-4.5 rounded" : "h-5 w-5 rounded-md";
  const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={state === "mixed" ? "mixed" : state === "on"}
      aria-label={label}
      title={label}
      disabled={disabled || readOnly}
      whileTap={disabled || readOnly ? undefined : { scale: 0.88 }}
      onClick={() => onChange?.(state !== "on")}
      className={cn(
        "inline-flex shrink-0 items-center justify-center border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40",
        box,
        on ? (tone === "extra" ? "border-blue bg-blue text-white" : "border-brand-orange bg-brand-orange text-white") : "border-slate-300 bg-white text-transparent",
        !readOnly && !disabled && "cursor-pointer",
        !readOnly && !disabled && !on && (tone === "extra" ? "hover:border-blue" : "hover:border-brand-orange"),
        disabled && !readOnly && "cursor-not-allowed opacity-50",
        readOnly && "cursor-default"
      )}
    >
      {state === "mixed" ? <Minus className={icon} strokeWidth={3} /> : <Check className={icon} strokeWidth={3} />}
    </motion.button>
  );
}

export default PermissionCheckbox;
