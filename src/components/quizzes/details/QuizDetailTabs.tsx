"use client";

import React from "react";
import { PillTabs } from "@/components/ui/PillTabs";
import { QUIZ_DETAIL_TABS, QUIZ_DETAIL_TAB_LABEL, type QuizDetailTab } from "./quizTabTypes";

export interface QuizDetailTabsProps {
  activeTab: QuizDetailTab;
  onChange: (tab: QuizDetailTab) => void;
  /** Optional counts shown in the pills (e.g. questions, submissions). */
  counts?: Partial<Record<QuizDetailTab, number>>;
}

/** Overview / Questions / Submissions / Analytics / Activity Log — the shared capsule PillTabs. */
export function QuizDetailTabs({ activeTab, onChange, counts }: QuizDetailTabsProps) {
  return (
    <PillTabs
      ariaLabel="Quiz sections"
      idPrefix="quiz"
      activeId={activeTab}
      onChange={onChange}
      tabs={QUIZ_DETAIL_TABS.map((id) => ({ id, label: QUIZ_DETAIL_TAB_LABEL[id], count: counts?.[id] }))}
    />
  );
}

export default QuizDetailTabs;
