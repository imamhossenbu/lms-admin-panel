"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BookOpen, FolderOpen } from "lucide-react";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { wizardCourseTitle, wizardModuleLabel } from "../wizardFormat";

/** Title (or placeholder) + "{Course} • Module N: Title" line ("Select a course" before one is chosen), read live from the form. */
export function PreviewMeta({ context }: { context: LessonEditorContext }) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [title, moduleId] = useWatch({ control, name: ["title", "moduleId"] });
  const moduleLabel = wizardModuleLabel(context, moduleId);

  return (
    <div className="min-w-0">
      <h4 className={title?.trim() ? "heading-h6 font-bold! text-primary-500 break-words" : "heading-h6 text-primary-300 italic"}>
        {title?.trim() || "Untitled assignment"}
      </h4>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 body-xsm-regular text-primary-300">
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          {wizardCourseTitle(context)}
        </span>
        {moduleLabel && (
          <>
            <span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              {moduleLabel}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default PreviewMeta;
