"use client";

import React from "react";
import { PillTabs } from "@/components/ui/PillTabs";
import { ASSIGNMENT_DETAIL_TABS, type AssignmentDetailTab } from "./tabTypes";

export const ASSIGNMENT_DETAIL_TAB_LABEL: Record<AssignmentDetailTab, string> = {
  overview: "Overview",
  submissions: "Submissions",
  instructions: "Instructions",
  rubric: "Rubric",
  analytics: "Analytics",
};

export interface AssignmentDetailTabsProps {
  activeTab: AssignmentDetailTab;
  onChange: (tab: AssignmentDetailTab) => void;
}

/** Overview / Submissions / Instructions / Rubric / Analytics — the shared capsule PillTabs. */
export function AssignmentDetailTabs({ activeTab, onChange }: AssignmentDetailTabsProps) {
  return (
    <PillTabs
      ariaLabel="Assignment sections"
      idPrefix="assignment"
      activeId={activeTab}
      onChange={onChange}
      tabs={ASSIGNMENT_DETAIL_TABS.map((id) => ({ id, label: ASSIGNMENT_DETAIL_TAB_LABEL[id] }))}
    />
  );
}

export default AssignmentDetailTabs;
