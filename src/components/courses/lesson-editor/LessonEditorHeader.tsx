"use client";

import React from "react";
import { Eye, Pencil } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface LessonEditorHeaderProps {
  courseId: string;
  courseTitle: string;
  isSaving: boolean;
  isUploading: boolean;
  onPreview: () => void;
  onUpdate: () => void;
}

/** Breadcrumb, "Edit Lesson" title + subtitle and the Preview / Update Lesson actions. */
export function LessonEditorHeader({ courseId, courseTitle, isSaving, isUploading, onPreview, onUpdate }: LessonEditorHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseId}` },
          { label: "Lessons", href: `/courses/${courseId}?tab=syllabus` },
          { label: "Edit Lesson" },
        ]}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="heading-h2-bold text-primary-500">Edit Lesson</h1>
          <p className="mt-1.5 body-regular text-primary-300">Update lesson content, media, settings and more.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SecondaryButton leftIcon={<Eye />} onClick={onPreview}>
            Preview
          </SecondaryButton>
          <PrimaryButton
            leftIcon={<Pencil />}
            onClick={onUpdate}
            isLoading={isSaving}
            disabled={isSaving || isUploading}
            title={isUploading ? "Wait for uploads to finish" : undefined}
          >
            {isSaving ? "Updating..." : isUploading ? "Uploading..." : "Update Lesson"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default LessonEditorHeader;
