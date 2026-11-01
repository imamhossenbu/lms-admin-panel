"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { SIGNUP_STEPS, type SignupStep } from "./signupSteps";

export interface SignupStepperProps {
  step: SignupStep;
  maxStep: SignupStep;
  /** Jump back to an already-reached step (never ahead). */
  onStepClick: (step: SignupStep) => void;
}

/** 1 — 2 — 3 — 4 progress row; reached steps are clickable, later ones are locked. */
export function SignupStepper({ step, maxStep, onStepClick }: SignupStepperProps) {
  const locked = step === 4;
  return (
    <ol className="flex items-start gap-2" aria-label="Signup progress">
      {SIGNUP_STEPS.map((s, i) => {
        const done = s.id < step;
        const active = s.id === step;
        const clickable = !locked && s.id <= maxStep && s.id !== step && s.id !== 4;
        return (
          <li key={s.id} className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(s.id)}
                whileTap={clickable ? { scale: 0.92 } : undefined}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${s.id}: ${s.label}`}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border body-xsm-medium transition-colors",
                  done && "border-green bg-green text-white",
                  active && "border-brand-orange bg-brand-orange text-white",
                  !done && !active && "border-dash bg-white text-primary-300",
                  clickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.id}
              </motion.button>
              {i < SIGNUP_STEPS.length - 1 && (
                <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-green"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 pr-2">
              <p className={cn("truncate body-xsm-medium", active ? "text-primary-500" : "text-primary-300")}>{s.label}</p>
              <p className="hidden truncate body-2xsm-regular text-primary-300 sm:block">{s.hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default SignupStepper;
