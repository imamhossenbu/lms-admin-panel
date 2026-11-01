"use client";

import React from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { QuizWizardStep } from "@/validations/quizWizardSchema";

const SUBTITLE: Record<QuizWizardStep, string> = {
  basic: "Set up the basic information for your quiz.",
  questions: "Add and manage the questions for your quiz.",
  settings: "Configure quiz settings, scoring and rules.",
  review: "Review all information before publishing your quiz.",
};

export interface QuizWizardHeaderProps {
  mode: "create" | "edit";
  step: QuizWizardStep;
  /** Edit: the saved quiz (breadcrumb link back to its details page). */
  quiz?: { id: string; title: string };
}

/** Breadcrumb (Home › Quizzes › Create Quiz) + title + step-specific subtitle. */
export function QuizWizardHeader({ mode, step, quiz }: QuizWizardHeaderProps) {
  const isEdit = mode === "edit";
  return (
    <div className="space-y-3">
      <Breadcrumb
        items={[
          { label: "Quizzes", href: "/quizzes" },
          ...(isEdit && quiz ? [{ label: quiz.title, href: `/quizzes/${quiz.id}` }] : []),
          { label: isEdit ? "Edit Quiz" : "Create Quiz" },
        ]}
      />
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="min-w-0">
        <h1 className="heading-h2-bold text-primary-500">{isEdit ? "Edit Quiz" : "Create Quiz"}</h1>
        <p className="mt-1 truncate body-regular text-primary-300">{SUBTITLE[step]}</p>
      </motion.div>
    </div>
  );
}

export default QuizWizardHeader;
