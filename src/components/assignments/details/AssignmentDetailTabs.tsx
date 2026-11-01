"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
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

/** Overview / Submissions / Instructions / Rubric / Analytics with an animated orange underline. */
export function AssignmentDetailTabs({ activeTab, onChange }: AssignmentDetailTabsProps) {
  return (
    <nav aria-label="Assignment sections" className="dashboard-card shadow-2xs overflow-x-auto px-2">
      <div role="tablist" className="flex min-w-max items-center">
        {ASSIGNMENT_DETAIL_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <motion.button
              key={tab}
              type="button"
              role="tab"
              id={`assignment-tab-${tab}`}
              aria-selected={isActive}
              aria-controls={`assignment-panel-${tab}`}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(tab)}
              className={cn(
                "relative cursor-pointer whitespace-nowrap px-5 py-4 body-medium transition-colors",
                isActive ? "text-brand-orange" : "text-primary-400 hover:text-primary-500"
              )}
            >
              {ASSIGNMENT_DETAIL_TAB_LABEL[tab]}
              {isActive && (
                <motion.span
                  layoutId="assignment-detail-tab-underline"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-orange"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default AssignmentDetailTabs;
