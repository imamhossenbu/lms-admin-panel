"use client";

import React from "react";
import { motion } from "framer-motion";
import { QUIZ_STEP_LABEL, QUIZ_WIZARD_STEPS, type QuizWizardStep } from "@/validations/quizWizardSchema";
import { cn } from "@/lib/cn";
import { QuizWizardStepperItem } from "./QuizWizardStepperItem";

export interface QuizWizardStepperProps {
  current: QuizWizardStep;
  completed: QuizWizardStep[];
  /** Create: completed + the next unfinished step; edit: all. */
  isReachable: (step: QuizWizardStep) => boolean;
  errorSteps?: QuizWizardStep[];
  onSelect: (step: QuizWizardStep) => void;
}

/** Horizontal 4-step stepper card with animated connector lines. */
export function QuizWizardStepper({ current, completed, isReachable, errorSteps = [], onSelect }: QuizWizardStepperProps) {
  return (
    <motion.nav
      aria-label="Quiz steps"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs overflow-x-auto px-5 py-4"
    >
      <ol className="flex min-w-max items-center gap-3">
        {QUIZ_WIZARD_STEPS.map((step, i) => {
          const done = completed.includes(step);
          const state = step === current ? "active" : done ? "completed" : "upcoming";
          const last = i === QUIZ_WIZARD_STEPS.length - 1;
          return (
            <li key={step} className={cn("flex items-center gap-3", !last && "flex-1")}>
              <QuizWizardStepperItem
                index={i}
                label={QUIZ_STEP_LABEL[step]}
                state={state}
                reachable={step === current || isReachable(step)}
                clickable={step !== current && isReachable(step)}
                hasError={errorSteps.includes(step)}
                onClick={() => onSelect(step)}
              />
              {!last && (
                <span aria-hidden className="relative h-0.5 min-w-6 flex-1 overflow-hidden rounded-full bg-gray-bg">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 origin-left bg-brand-orange"
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

export default QuizWizardStepper;
