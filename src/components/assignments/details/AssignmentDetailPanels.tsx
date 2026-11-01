"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AssignmentDetailTab, AssignmentTabProps } from "./tabTypes";
import { OverviewTab } from "./tabs/overview/OverviewTab";
import { SubmissionsTab } from "./tabs/submissions/SubmissionsTab";
import { InstructionsTab } from "./tabs/instructions/InstructionsTab";
import { RubricTab } from "./tabs/rubric/RubricTab";
import { AnalyticsTab } from "./tabs/analytics/AnalyticsTab";

export interface AssignmentDetailPanelsProps extends AssignmentTabProps {
  activeTab: AssignmentDetailTab;
  /** Opens the "View as Student" modal (Overview quick action). */
  onPreview: () => void;
}

/** Renders the active tab body. Each tab owns its own two-column layout (main + sidebar). */
export function AssignmentDetailPanels({ activeTab, onPreview, ...props }: AssignmentDetailPanelsProps) {
  return (
    <motion.div
      key={activeTab}
      role="tabpanel"
      id={`assignment-panel-${activeTab}`}
      aria-labelledby={`assignment-tab-${activeTab}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {activeTab === "overview" && <OverviewTab {...props} onPreview={onPreview} />}
      {activeTab === "submissions" && <SubmissionsTab {...props} />}
      {activeTab === "instructions" && <InstructionsTab {...props} />}
      {activeTab === "rubric" && <RubricTab {...props} />}
      {activeTab === "analytics" && <AnalyticsTab {...props} />}
    </motion.div>
  );
}

export default AssignmentDetailPanels;
