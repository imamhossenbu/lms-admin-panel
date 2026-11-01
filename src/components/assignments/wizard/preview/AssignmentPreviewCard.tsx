"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { plainText } from "../wizardFormat";
import { PreviewCardShell } from "./PreviewCardShell";
import { PreviewMeta } from "./PreviewMeta";
import { PreviewChips } from "./PreviewChips";

export interface AssignmentPreviewCardProps {
  context: LessonEditorContext;
  badge?: "live" | "student";
}

/** Right-column "Assignment Preview": title, course/module meta, short description and chips — live from the form. */
export function AssignmentPreviewCard({ context, badge = "live" }: AssignmentPreviewCardProps) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const descriptionHtml = useWatch({ control, name: "shortDescriptionHtml" });
  const description = plainText(descriptionHtml);

  return (
    <PreviewCardShell title="Assignment Preview" badge={badge}>
      <PreviewMeta context={context} />
      <p className={description ? "mt-3 line-clamp-4 body-sm-regular text-primary-300" : "mt-3 body-sm-regular text-primary-300 italic"}>
        {description || "Your short description will appear here."}
      </p>
      <div className="mt-4">
        <PreviewChips />
      </div>
    </PreviewCardShell>
  );
}

export default AssignmentPreviewCard;
