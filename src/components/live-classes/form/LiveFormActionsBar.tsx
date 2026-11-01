"use client";

import React from "react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { LiveFormSubmitButton } from "./LiveClassFormHeader";
import type { LiveFormMode } from "./liveFormUtils";

export interface LiveFormActionsBarProps {
  mode: LiveFormMode;
  isSubmitting: boolean;
  disabled?: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

/** Bottom of the main column: Cancel + Schedule Class / Save Changes. */
export function LiveFormActionsBar({ mode, isSubmitting, disabled, isDirty, onCancel }: LiveFormActionsBarProps) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="body-xsm-regular text-primary-300">
        {isDirty ? "You have unsaved changes. They are kept for this browser session." : "All fields marked * are required."}
      </p>
      <div className="flex items-center justify-end gap-3">
        <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
        <LiveFormSubmitButton mode={mode} isSubmitting={isSubmitting} disabled={disabled} />
      </div>
    </div>
  );
}

export default LiveFormActionsBar;
