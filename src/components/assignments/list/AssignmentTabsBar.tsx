"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/cn";
import { ASSIGNMENT_LIST_TABS, type AssignmentListTab } from "./assignmentListUtils";

export interface AssignmentTabsBarProps {
  active: AssignmentListTab;
  onChange: (tab: AssignmentListTab) => void;
  onCreate: () => void;
}

/** Underline tab bar (orange animated indicator) with the "+ Create Assignment" button on the right. */
export function AssignmentTabsBar({ active, onChange, onCreate }: AssignmentTabsBarProps) {
  const layoutId = useId();
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-b border-dash">
      <div role="tablist" className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {ASSIGNMENT_LIST_TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative px-4 py-3.5 body-medium whitespace-nowrap transition-colors cursor-pointer",
                isActive ? "text-brand-orange" : "text-primary-400 hover:text-primary-500"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId={`assignment-tab-${layoutId}`}
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-orange"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <PrimaryButton type="button" size="lg" onClick={onCreate} leftIcon={<Plus className="w-4 h-4" />} className="mb-2 self-start sm:self-auto">
        Create Assignment
      </PrimaryButton>
    </div>
  );
}

export default AssignmentTabsBar;
