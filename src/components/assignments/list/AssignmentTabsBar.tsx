"use client";

import React from "react";
import { Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { PillTabs } from "@/components/ui/PillTabs";
import { ASSIGNMENT_LIST_TABS, type AssignmentListTab } from "./assignmentListUtils";

export interface AssignmentTabsBarProps {
  active: AssignmentListTab;
  onChange: (tab: AssignmentListTab) => void;
  onCreate: () => void;
}

/** Shared capsule PillTabs with the "+ Create Assignment" button on the right. */
export function AssignmentTabsBar({ active, onChange, onCreate }: AssignmentTabsBarProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
      <PillTabs
        ariaLabel="Assignment filters"
        activeId={active}
        onChange={onChange}
        tabs={ASSIGNMENT_LIST_TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
      />
      <PrimaryButton type="button" size="lg" onClick={onCreate} leftIcon={<Plus className="w-4 h-4" />} className="self-start sm:self-auto">
        Create Assignment
      </PrimaryButton>
    </div>
  );
}

export default AssignmentTabsBar;
