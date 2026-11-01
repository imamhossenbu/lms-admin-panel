"use client";

import React from "react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { DiscussionSubmitButton } from "./DiscussionFormHeader";
import type { ThreadFormMode } from "./threadFormUtils";

export interface DiscussionFormActionsBarProps {
  mode: ThreadFormMode;
  isSubmitting: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

/** Bottom of the main column: Cancel + Publish Discussion / Save Changes. */
export function DiscussionFormActionsBar({ mode, isSubmitting, isDirty, onCancel }: DiscussionFormActionsBarProps) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="body-xsm-regular text-primary-300">
        {isDirty ? "You have unsaved changes. They are kept for this browser session." : "All fields marked * are required."}
      </p>
      <div className="flex items-center justify-end gap-3">
        <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
        <DiscussionSubmitButton mode={mode} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}

export default DiscussionFormActionsBar;
