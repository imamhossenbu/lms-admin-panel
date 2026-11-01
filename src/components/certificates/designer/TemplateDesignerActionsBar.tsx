"use client";

import React from "react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { TemplateSubmitButton } from "./TemplateDesignerHeader";
import type { DesignerMode } from "./designerUtils";

export interface TemplateDesignerActionsBarProps {
  mode: DesignerMode;
  isSubmitting: boolean;
  disabled?: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

/** Bottom of the main column: unsaved hint + Cancel + Create Template / Save Changes. */
export function TemplateDesignerActionsBar({ mode, isSubmitting, disabled, isDirty, onCancel }: TemplateDesignerActionsBarProps) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="body-xsm-regular text-primary-300">
        {disabled
          ? "A signature is still uploading…"
          : isDirty
            ? "You have unsaved changes. They are kept for this browser session."
            : "All fields marked * are required."}
      </p>
      <div className="flex items-center justify-end gap-3">
        <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
        <TemplateSubmitButton mode={mode} isSubmitting={isSubmitting} disabled={disabled} />
      </div>
    </div>
  );
}

export default TemplateDesignerActionsBar;
