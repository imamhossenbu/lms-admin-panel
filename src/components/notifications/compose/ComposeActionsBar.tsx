"use client";

import React from "react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ComposeActionButtons, type ComposeBusy } from "./ComposeActionButtons";

export interface ComposeActionsBarProps {
  busy: ComposeBusy;
  isDirty: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
}

/** Bottom of the main column: Cancel, Save as Draft and Send Now / Schedule Broadcast. */
export function ComposeActionsBar({ busy, isDirty, onCancel, onSaveDraft }: ComposeActionsBarProps) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="body-xsm-regular text-primary-300">
        {isDirty ? "You have unsaved changes. They are kept for this browser session." : "All fields marked * are required."}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <SecondaryButton type="button" onClick={onCancel} disabled={!!busy}>
          Cancel
        </SecondaryButton>
        <ComposeActionButtons busy={busy} onSaveDraft={onSaveDraft} />
      </div>
    </div>
  );
}

export default ComposeActionsBar;
