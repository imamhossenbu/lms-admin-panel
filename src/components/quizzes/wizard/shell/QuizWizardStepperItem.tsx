"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type QuizStepperItemState = "active" | "completed" | "upcoming";

export interface QuizWizardStepperItemProps {
  index: number;
  label: string;
  state: QuizStepperItemState;
  /** False → locked (previous steps unfinished): rendered disabled. */
  reachable: boolean;
  /** Reachable and not the current step. */
  clickable: boolean;
  hasError?: boolean;
  onClick: () => void;
}

/** One stepper node: orange filled circle (active) / orange check (completed) / muted number (upcoming) + label. */
export function QuizWizardStepperItem({ index, label, state, reachable, clickable, hasError, onClick }: QuizWizardStepperItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      aria-disabled={!reachable || undefined}
      title={reachable ? undefined : "Finish the previous steps first"}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      aria-current={state === "active" ? "step" : undefined}
      aria-label={`Step ${index + 1}: ${label}${state === "completed" ? " (completed)" : reachable ? "" : " (locked)"}`}
      className={cn(
        "group flex shrink-0 items-center gap-2.5 rounded-full pr-1 transition-opacity",
        clickable ? "cursor-pointer" : reachable ? "cursor-default" : "cursor-not-allowed opacity-50"
      )}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        {state === "active" && (
          <motion.span
            layoutId="quiz-wizard-step-active"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={cn("absolute inset-0 rounded-full edupro-glow-btn", hasError ? "bg-red" : "bg-brand-orange")}
          />
        )}
        {state === "completed" && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn("absolute inset-0 flex items-center justify-center rounded-full", hasError ? "bg-red-14" : "bg-brand-orange-light")}
          >
            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-white", hasError ? "bg-red" : "bg-brand-orange")}>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </motion.span>
        )}
        {state === "upcoming" && <span className={cn("absolute inset-0 rounded-full border bg-gray-bg", hasError ? "border-red" : "border-dash")} />}
        {state !== "completed" && (
          <span className={cn("relative body-sm-medium font-semibold!", state === "active" ? "text-white" : "text-primary-400")}>{index + 1}</span>
        )}
      </span>
      <span
        className={cn(
          "whitespace-nowrap body-sm-medium transition-colors",
          state === "active" ? "font-semibold! text-brand-orange" : "text-primary-300",
          clickable && state !== "active" && "group-hover:text-brand-orange"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}

export default QuizWizardStepperItem;
