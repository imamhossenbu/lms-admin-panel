"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { CREATE_COURSE_STEPS } from "./createCourseOptions";

interface CourseStepperProps {
  /** 1-based index of the current step. */
  activeStep: number;
  /** Navigates to a reachable step. */
  onStepClick?: (step: number) => void;
  /** Whether a step may be opened. Defaults to "only earlier steps". */
  isStepReachable?: (step: number) => boolean;
  /** Steps whose own "Continue" succeeded — shown with a check. */
  completedSteps?: readonly number[];
}

/** Five-step progress header for the course creation flow. */
export function CourseStepper({ activeStep, onStepClick, isStepReachable, completedSteps = [] }: CourseStepperProps) {
  const reachable = (n: number) => (isStepReachable ? isStepReachable(n) : n <= activeStep);

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
          const isReachable = reachable(number);
          const isCompleted = !isActive && completedSteps.includes(number);
          const isClickable = !!onStepClick && !isActive && isReachable;
          const isLocked = !isActive && !isReachable;
          const isLast = number === CREATE_COURSE_STEPS.length;

          return (
            <li key={step.title} className={cn("flex items-center gap-3", !isLast && "flex-1")}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 shrink-0 rounded-lg",
                  isClickable && "cursor-pointer hover:opacity-80",
                  isLocked && "cursor-not-allowed opacity-60"
                )}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={isLocked || undefined}
                title={isLocked ? "Finish the previous steps first" : undefined}
                role={isClickable || isLocked ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                whileTap={isClickable ? { scale: 0.96 } : undefined}
                onClick={isClickable ? () => onStepClick(number) : undefined}
                onKeyDown={
                  isClickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onStepClick(number);
                        }
                      }
                    : undefined
                }
              >
                <span className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                  {isActive ? (
                    <motion.span
                      layoutId="course-step-indicator"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 rounded-full bg-brand-orange edupro-glow-btn"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : isCompleted ? (
                    <span className="absolute inset-0 rounded-full bg-brand-orange-light border border-brand-orange" />
                  ) : isReachable ? (
                    <span className="absolute inset-0 rounded-full bg-white border border-dash" />
                  ) : (
                    <span className="absolute inset-0 rounded-full bg-gray-bg border border-dash" />
                  )}
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className="relative flex text-brand-orange"
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} aria-label={`Step ${number} completed`} />
                    </motion.span>
                  ) : (
                    <span
                      className={cn(
                        "relative body-md-medium",
                        isActive ? "text-white" : isReachable ? "text-primary-500" : "text-primary-400"
                      )}
                    >
                      {number}
                    </span>
                  )}
                </span>
                <span className="text-left">
                  <span
                    className={cn(
                      "block body-sm-medium whitespace-nowrap",
                      isActive ? "text-brand-orange" : "text-primary-500"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="block body-xsm-regular text-primary-300 whitespace-nowrap">{step.subtitle}</span>
                </span>
              </motion.div>
              {!isLast && (
                <span
                  aria-hidden
                  className={cn("h-px flex-1 min-w-8", completedSteps.includes(number) ? "bg-brand-orange" : "bg-slate-200")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

export default CourseStepper;
