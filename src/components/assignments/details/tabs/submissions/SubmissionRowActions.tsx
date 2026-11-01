"use client";

import React from "react";
import { Download, Eye, Pencil } from "lucide-react";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { IconActionButton } from "./IconActionButton";

export interface SubmissionRowActionsProps {
  onView: () => void;
  onGrade: () => void;
  onDownload: () => void;
  canDownload: boolean;
}

/** View, Grade and ⋯ (View / Grade / Download) for one submission. */
export function SubmissionRowActions({ onView, onGrade, onDownload, canDownload }: SubmissionRowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <IconActionButton label="View submission" onClick={onView}>
        <Eye className="h-4 w-4" />
      </IconActionButton>
      <IconActionButton label="Grade submission" onClick={onGrade}>
        <Pencil className="h-4 w-4" />
      </IconActionButton>
      <RowMoreMenu
        items={[
          { key: "view", label: "View Submission", icon: <Eye className="h-4 w-4" />, onClick: onView },
          { key: "grade", label: "Grade Submission", icon: <Pencil className="h-4 w-4" />, onClick: onGrade },
          { key: "download", label: "Download File", icon: <Download className="h-4 w-4" />, onClick: onDownload, disabled: !canDownload },
        ]}
      />
    </div>
  );
}

export default SubmissionRowActions;
