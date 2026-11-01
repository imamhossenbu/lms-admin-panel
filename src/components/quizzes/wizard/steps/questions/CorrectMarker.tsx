"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CorrectMarkerProps {
  /** "radio" for single-answer kinds, "checkbox" for Multiple Select. */
  variant: "radio" | "checkbox";
  checked: boolean;
  label: string;
  onToggle?: () => void;
  /** Read-only look (student preview): never filled, not clickable. */
  readOnly?: boolean;
}

/** Orange radio / checkbox used to mark the correct option(s) — and, unselected, in the student preview. */
export function CorrectMarker({ variant, checked, label, onToggle, readOnly }: CorrectMarkerProps) {
  const shape = variant === "radio" ? "rounded-full" : "rounded-md";
  if (readOnly) return <span aria-hidden className={cn("h-5 w-5 shrink-0 border border-dash bg-white", shape)} />;

  return (
    <motion.button
      type="button"
      role={variant}
      aria-checked={checked}
      aria-label={label}
      title={checked ? "Correct answer" : "Mark as correct"}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={cn(
        "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border transition-colors",
        shape,
        checked
          ? variant === "radio"
            ? "border-brand-orange bg-white"
            : "border-brand-orange bg-brand-orange text-white"
          : "border-dash bg-white hover:border-primary-300"
      )}
    >
      {checked && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex items-center justify-center"
        >
          {variant === "radio" ? <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" /> : <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </motion.span>
      )}
    </motion.button>
  );
}

export default CorrectMarker;
