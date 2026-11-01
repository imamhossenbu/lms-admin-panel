"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { plainText } from "../../wizardFormat";
import { PreviewCardShell } from "../../preview/PreviewCardShell";
import { PreviewMeta } from "../../preview/PreviewMeta";
import { PreviewChips } from "../../preview/PreviewChips";
import { instructionsOutline } from "./instructionsOutline";

/** Student-view preview on the Review step: chips incl. points, overview text and the requirements list. */
export function ReviewPreviewCard({ context }: { context: LessonEditorContext }) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [instructionsHtml, shortDescriptionHtml] = useWatch({ control, name: ["instructionsHtml", "shortDescriptionHtml"] });
  const outline = instructionsOutline(instructionsHtml ?? "");
  const overview = outline.overview || plainText(shortDescriptionHtml ?? "");

  return (
    <PreviewCardShell title="Assignment Preview" badge="student">
      <PreviewMeta context={context} />
      <div className="mt-4 border-b border-dash pb-4">
        <PreviewChips showPoints />
      </div>
      <h5 className="mt-4 body-md-medium font-semibold! text-primary-500">Assignment Overview</h5>
      <p className="mt-1.5 body-xsm-regular text-primary-400">{overview || "No overview provided yet."}</p>
      {outline.requirements.length > 0 && (
        <>
          <h5 className="mt-4 body-md-medium font-semibold! text-primary-500">Requirements</h5>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 body-xsm-regular text-primary-400">
            {outline.requirements.map((r, i) => (
              <li key={`${i}-${r}`}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </PreviewCardShell>
  );
}

export default ReviewPreviewCard;
