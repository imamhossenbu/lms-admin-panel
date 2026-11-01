"use client";

import React from "react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { TemplateSaveButton } from "./TemplateEditorHeader";

export interface TemplateEditorActionsBarProps {
  isSubmitting: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

/** Bottom of the main column: hint + Cancel + Save Changes. */
export function TemplateEditorActionsBar({ isSubmitting, isDirty, onCancel }: TemplateEditorActionsBarProps) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="body-xsm-regular text-primary-300">{isDirty ? "You have unsaved changes." : "All fields marked * are required."}</p>
      <div className="flex items-center justify-end gap-3">
        <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
        <TemplateSaveButton isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}

export default TemplateEditorActionsBar;
