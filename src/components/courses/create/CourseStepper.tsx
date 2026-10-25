"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { CREATE_COURSE_STEPS } from "./createCourseOptions";

interface CourseStepperProps {
  /** 1-based index of the current step. */
  activeStep: number;
}

/** Five-step progress header for the course creation flow. */
export function CourseStepper({ activeStep }: CourseStepperProps) {
  return (
    <motion.nav
      aria-label="Course creation steps"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
      className="dashboard-card shadow-2xs px-5 py-4 overflow-x-auto scrollbar-none"
    >
      <ol className="flex items-center gap-3 min-w-max">
        {CREATE_COURSE_STEPS.map((step, index) => {
          const number = index + 1;
          const isActive = number === activeStep;
          const isDone = number < activeStep;
          const isLast = number === CREATE_COURSE_STEPS.length;

          return (
            <li key={step.title} className={cn("flex items-center gap-3", !isLast && "flex-1")}>
              <div className="flex items-center gap-3 shrink-0" aria-current={isActive ? "step" : undefined}>
                <span className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                  {isActive ? (
                    <motion.span
                      layoutId="course-step-indicator"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 rounded-full bg-brand-orange edupro-glow-btn"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : isDone ? (
                    <span className="absolute inset-0 rounded-full bg-brand-orange" />
                  ) : (
                    <span className="absolute inset-0 rounded-full bg-gray-bg border border-dash" />
                  )}
                  <span
                    className={cn(
                      "relative body-md-medium font-semibold",
                      isActive || isDone ? "text-white" : "text-primary-400"
                    )}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : number}
                  </span>
                </span>
                <span className="text-left">
                  <span
                    className={cn(
                      "block body-sm-medium font-semibold whitespace-nowrap",
                      isActive ? "text-brand-orange" : "text-primary-500"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="block body-xsm-regular text-primary-300 whitespace-nowrap">{step.subtitle}</span>
                </span>
              </div>
              {!isLast && <span aria-hidden className="h-px flex-1 min-w-8 bg-slate-200" />}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

export default CourseStepper;
