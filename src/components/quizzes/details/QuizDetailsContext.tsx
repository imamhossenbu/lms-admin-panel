"use client";

import React, { createContext, useContext } from "react";
import type { QuizActions } from "./hooks/useQuizActions";

const QuizDetailsActionsContext = createContext<QuizActions | null>(null);

/** Shares the page-level quiz actions (preview, edit, duplicate, archive …) with every tab body. */
export function QuizDetailsActionsProvider({ value, children }: { value: QuizActions; children: React.ReactNode }) {
  return <QuizDetailsActionsContext.Provider value={value}>{children}</QuizDetailsActionsContext.Provider>;
}

export function useQuizDetailsActions() {
  const ctx = useContext(QuizDetailsActionsContext);
  if (!ctx) throw new Error("useQuizDetailsActions must be used inside QuizDetailsActionsProvider");
  return ctx;
}

export default QuizDetailsActionsProvider;
