"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { AssignmentFormMode } from "./assignmentFormConfig";

export interface AssignmentFormHeaderProps {
  mode: AssignmentFormMode;
  courseId: string;
  courseTitle: string;
  /** Edit mode: link the breadcrumb to the assignment. */
  assignment?: { id: string; title: string };
  isSaving: boolean;
  isUploading: boolean;
  onBack: () => void;
}

/** Breadcrumb, Create / Edit title + subtitle, "← Back to Assignments" and the submit button. */
export function AssignmentFormHeader({ mode, courseId, courseTitle, assignment, isSaving, isUploading, onBack }: AssignmentFormHeaderProps) {
  const isEdit = mode === "edit";
  return (
    <div className="space-y-3 text-left">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseId}` },
          { label: "Assignments", href: "/assignments" },
          ...(isEdit && assignment ? [{ label: assignment.title, href: `/assignments/${assignment.id}` }, { label: "Edit" }] : [{ label: "Create Assignment" }]),
        ]}
      />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">{isEdit ? "Edit Assignment" : "Create Assignment"}</h1>
          <p className="body-regular text-primary-400 mt-1">
            {isEdit
              ? "Update the details, deadlines and grading options of this assignment."
              : "Add a new assignment for this course. Set instructions, deadlines and grading options."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton type="button" variant="outline" size="lg" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />} className="text-blue!">
            Back to Assignments
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            size="lg"
            isLoading={isSaving}
            disabled={isSaving || isUploading}
            title={isUploading ? "Wait for uploads to finish" : undefined}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? "Saving..." : "Save Assignment"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default AssignmentFormHeader;
