"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AiProgressStep {
  title: string;
  description: string;
}

export interface AiProgressStepsProps {
  steps: AiProgressStep[];
  /** Number of completed steps; the step at this index is the current one. */
  completed: number;
}

function StepCircle({ state }: { state: "done" | "current" | "upcoming" }) {
  if (state === "done") {
    return (
      <motion.span
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-purple text-white shadow-sm"
      >
        <Check className="h-5 w-5" strokeWidth={3} />
      </motion.span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple bg-white">
        <motion.span
          className="absolute inset-0 rounded-full bg-purple-14"
          animate={{ scale: [1, 1.45], opacity: [0.9, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="h-3 w-3 rounded-full bg-purple"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    );
  }
  return <span className="h-10 w-10 rounded-full border border-dash bg-slate-100" />;
}

/** Horizontal 4-step progress with a purple fill line between circles. */
export function AiProgressSteps({ steps, completed }: AiProgressStepsProps) {
  return (
    <ol className="flex w-full">
      {steps.map((step, i) => {
        const state = i < completed ? "done" : i === completed ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex min-w-0 flex-1 flex-col items-center px-1 text-center">
            {!isLast && (
              <span className="absolute left-1/2 top-5 h-0.5 w-full -translate-y-1/2 overflow-hidden bg-slate-200">
                <motion.span
                  className="block h-full origin-left bg-purple"
                  initial={false}
                  animate={{ scaleX: i < completed ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                />
              </span>
            )}
            <span className="relative z-10">
              <StepCircle state={state} />
            </span>
            <p
              className={cn(
                "mt-3 body-sm-medium",
                state === "upcoming" ? "text-primary-300" : "text-primary-500"
              )}
            >
              {step.title}
            </p>
            <p className="mt-1 hidden body-xsm-regular text-primary-300 sm:block">{step.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

export default AiProgressSteps;
