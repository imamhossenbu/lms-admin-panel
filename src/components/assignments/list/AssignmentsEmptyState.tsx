"use client";

import React from "react";
import { FileSearch, FileText } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { EMPTY_TAB_COPY, type AssignmentListTab } from "./assignmentListUtils";

export interface AssignmentsEmptyStateProps {
  tab: AssignmentListTab;
  isFiltered: boolean;
  onReset: () => void;
  onCreate: () => void;
}

/** Empty state for a tab (nothing there yet) or for filters that match nothing. */
export function AssignmentsEmptyState({ tab, isFiltered, onReset, onCreate }: AssignmentsEmptyStateProps) {
  const copy = isFiltered
    ? { title: "No assignments match your filters", text: "Try a different search term, module, status or type." }
    : EMPTY_TAB_COPY[tab];
  return (
    <div className="flex flex-col items-center text-center gap-2 py-12 px-4">
      <span className="w-12 h-12 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center">
        {isFiltered ? <FileSearch className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
      </span>
      <p className="body-medium font-semibold! text-primary-500">{copy.title}</p>
      <p className="body-sm-regular text-primary-300 max-w-sm">{copy.text}</p>
      {isFiltered ? (
        <PrimaryButton size="sm" variant="outline" className="mt-2" onClick={onReset}>
          Reset Filters
        </PrimaryButton>
      ) : (
        (tab === "all" || tab === "drafts") && (
          <PrimaryButton size="sm" className="mt-2" onClick={onCreate}>
            Create Assignment
          </PrimaryButton>
        )
      )}
    </div>
  );
}

export default AssignmentsEmptyState;
