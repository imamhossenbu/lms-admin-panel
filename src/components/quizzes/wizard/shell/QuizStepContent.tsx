"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { QuizWizardStep } from "@/validations/quizWizardSchema";
import type { QuizStepProps } from "../quizWizardTypes";
import { BasicInfoStep } from "../steps/basic/BasicInfoStep";
import { QuestionsStep } from "../steps/questions/QuestionsStep";
import { SettingsStep } from "../steps/settings/SettingsStep";
import { ReviewStep } from "../steps/review/ReviewStep";

const STEP_COMPONENT: Record<QuizWizardStep, React.ComponentType<QuizStepProps>> = {
  basic: BasicInfoStep,
  questions: QuestionsStep,
  settings: SettingsStep,
  review: ReviewStep,
};

/** Renders the active step with a short slide/fade transition between steps. */
export function QuizStepContent({ step, ...props }: QuizStepProps & { step: QuizWizardStep }) {
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

export default QuizStepContent;
