"use client";

import React, { createContext, useContext } from "react";
import type { QuizStatus } from "@/types/quiz";

export type QuizPublishChoice = Extract<QuizStatus, "PUBLISHED" | "DRAFT"> | "ARCHIVED";

export interface QuizWizardContextValue {
  mode: "create" | "edit";
  /** Saved status of the quiz (edit) — "DRAFT" while creating. */
  currentStatus: QuizStatus;
  /** Status the Review step will save with (Publishing Options). */
  publishChoice: QuizPublishChoice;
  setPublishChoice: (choice: QuizPublishChoice) => void;
}

const QuizWizardContext = createContext<QuizWizardContextValue>({
  mode: "create",
  currentStatus: "DRAFT",
  publishChoice: "PUBLISHED",
  setPublishChoice: () => undefined,
});

/** Wizard-level info that isn't part of the form values (mode, saved status, publish choice). */
export function QuizWizardProvider({ value, children }: { value: QuizWizardContextValue; children: React.ReactNode }) {
  return <QuizWizardContext.Provider value={value}>{children}</QuizWizardContext.Provider>;
}

export const useQuizWizardContext = () => useContext(QuizWizardContext);

export default QuizWizardProvider;
