"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WizardStep } from "@/validations/assignmentWizardSchema";
import type { WizardStepProps } from "../wizardTypes";
import { BasicInfoStep } from "../steps/basic/BasicInfoStep";
import { InstructionsStep } from "../steps/instructions/InstructionsStep";
import { SubmissionStep } from "../steps/submission/SubmissionStep";
import { GradingStep } from "../steps/grading/GradingStep";
import { RubricStep } from "../steps/rubric/RubricStep";
import { ScheduleStep } from "../steps/schedule/ScheduleStep";
import { ReviewStep } from "../steps/review/ReviewStep";

const STEP_COMPONENT: Record<WizardStep, React.ComponentType<WizardStepProps>> = {
  basic: BasicInfoStep,
  instructions: InstructionsStep,
  submission: SubmissionStep,
  grading: GradingStep,
  rubric: RubricStep,
  schedule: ScheduleStep,
  review: ReviewStep,
};

/** Renders the active step with a short slide/fade transition between steps. */
export function WizardStepContent({ step, ...props }: WizardStepProps & { step: WizardStep }) {
  const Step = STEP_COMPONENT[step];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Step {...props} />
      </motion.div>
    </AnimatePresence>
  );
}

export default WizardStepContent;
