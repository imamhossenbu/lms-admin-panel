"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type StepperItemState = "active" | "completed" | "upcoming";

export interface WizardStepperItemProps {
  index: number;
  label: string;
  state: StepperItemState;
  clickable: boolean;
  hasError?: boolean;
  onClick: () => void;
}

/** One stepper node: circle (number / green check) + label. Completed/visited steps are clickable. */
export function WizardStepperItem({ index, label, state, clickable, hasError, onClick }: WizardStepperItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      aria-current={state === "active" ? "step" : undefined}
      aria-label={`Step ${index + 1}: ${label}${state === "completed" ? " (completed)" : ""}`}
      className={cn("group flex shrink-0 items-center gap-2.5 rounded-full pr-1 disabled:cursor-default", clickable && "cursor-pointer")}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        {state === "active" && (
          <motion.span
            layoutId="wizard-step-active"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-0 rounded-full bg-blue shadow-md"
          />
        )}
        {state === "completed" && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn("absolute inset-0 flex items-center justify-center rounded-full", hasError ? "bg-red-14" : "bg-green-bg")}
          >
            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-white", hasError ? "bg-red" : "bg-green")}>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </motion.span>
        )}
        {state === "upcoming" && (
          <span className={cn("absolute inset-0 rounded-full border bg-gray-bg", hasError ? "border-red" : "border-dash")} />
        )}
        {state !== "completed" && (
          <span className={cn("relative body-sm-medium font-semibold!", state === "active" ? "text-white" : "text-primary-400")}>{index + 1}</span>
        )}
      </span>
      <span
        className={cn(
          "whitespace-nowrap body-sm-medium transition-colors",
          state === "active" ? "font-semibold! text-primary-500" : "text-primary-300",
          clickable && state !== "active" && "group-hover:text-blue"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}

export default WizardStepperItem;
