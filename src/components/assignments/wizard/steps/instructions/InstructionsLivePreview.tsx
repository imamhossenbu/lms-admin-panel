"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { RichTextContent } from "@/components/ui/RichTextContent";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { plainText } from "../../wizardFormat";
import { PreviewCardShell } from "../../preview/PreviewCardShell";
import { PreviewMeta } from "../../preview/PreviewMeta";
import { PreviewChips } from "../../preview/PreviewChips";

/** "Live Preview" (Student View): title, meta, chips and the sanitized instructions as students will see them. */
export function InstructionsLivePreview({ context }: { context: LessonEditorContext }) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const html = useWatch({ control, name: "instructionsHtml" }) ?? "";
  const hasContent = plainText(html).length > 0;

  return (
    <PreviewCardShell title="Live Preview" badge="student">
      <PreviewMeta context={context} />
      <div className="mt-3 max-h-80 overflow-y-auto pr-1">
        {hasContent ? (
          <RichTextContent html={html} className="body-xsm-regular" />
        ) : (
          <p className="body-sm-regular italic text-primary-300">Your instructions will appear here as students see them.</p>
        )}
      </div>
      <div className="mt-4">
        <PreviewChips />
      </div>
    </PreviewCardShell>
  );
}

export default InstructionsLivePreview;
