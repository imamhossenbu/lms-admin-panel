"use client";

import React from "react";
import { motion } from "framer-motion";
import { WIZARD_STEPS, WIZARD_STEP_LABEL, type WizardStep } from "@/validations/assignmentWizardSchema";
import { cn } from "@/lib/cn";
import { WizardStepperItem } from "./WizardStepperItem";

/** Stepper labels match the design ("Grading & Points", not the short schema label). */
const STEPPER_LABEL: Partial<Record<WizardStep, string>> = { grading: "Grading & Points" };

export interface WizardStepperProps {
  current: WizardStep;
  completed: WizardStep[];
  isClickable: (step: WizardStep) => boolean;
  errorSteps?: WizardStep[];
  onSelect: (step: WizardStep) => void;
}

/** Horizontal 7-step stepper card with connector lines (scrolls horizontally on small screens). */
export function WizardStepper({ current, completed, isClickable, errorSteps = [], onSelect }: WizardStepperProps) {
  return (
    <motion.nav
      aria-label="Assignment steps"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs overflow-x-auto px-5 py-4"
    >
      <ol className="flex min-w-max items-center gap-3">
        {WIZARD_STEPS.map((step, i) => {
          const state = step === current ? "active" : completed.includes(step) ? "completed" : "upcoming";
          const done = completed.includes(step);
          return (
            <li key={step} className={cn("flex items-center gap-3", i < WIZARD_STEPS.length - 1 && "flex-1")}>
              <WizardStepperItem
                index={i}
                label={STEPPER_LABEL[step] ?? WIZARD_STEP_LABEL[step]}
                state={state}
                clickable={step !== current && isClickable(step)}
                hasError={errorSteps.includes(step)}
                onClick={() => onSelect(step)}
              />
              {i < WIZARD_STEPS.length - 1 && (
                <span aria-hidden className="relative h-0.5 min-w-6 flex-1 overflow-hidden rounded-full bg-gray-bg">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 origin-left bg-green"
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

export default WizardStepper;
