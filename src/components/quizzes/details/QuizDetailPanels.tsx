"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { QuizDetailTab, QuizTabProps } from "./quizTabTypes";
import { OverviewTab } from "./tabs/overview/OverviewTab";
import { QuestionsTab } from "./tabs/questions/QuestionsTab";
import { SubmissionsTab } from "./tabs/submissions/SubmissionsTab";
import { AnalyticsTab } from "./tabs/analytics/AnalyticsTab";
import { ActivityLogTab } from "./tabs/activity/ActivityLogTab";

const PANELS: Record<QuizDetailTab, React.ComponentType<QuizTabProps>> = {
  overview: OverviewTab,
  questions: QuestionsTab,
  submissions: SubmissionsTab,
  analytics: AnalyticsTab,
  activity: ActivityLogTab,
};

export interface QuizDetailPanelsProps extends QuizTabProps {
  activeTab: QuizDetailTab;
}

/** Renders the active tab body (each tab owns its main + right column) with a short cross-fade. */
export function QuizDetailPanels({ activeTab, ...props }: QuizDetailPanelsProps) {
  const Panel = PANELS[activeTab];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        id={`quiz-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`quiz-tab-${activeTab}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Panel {...props} />
      </motion.div>
    </AnimatePresence>
  );
}

export default QuizDetailPanels;
