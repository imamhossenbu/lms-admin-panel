"use client";

import React from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { CoursePreviewContent, type CoursePreviewContentProps } from "./preview/CoursePreviewContent";

interface CoursePreviewModalProps extends Omit<CoursePreviewContentProps, "size"> {
  isOpen: boolean;
  onClose: () => void;
}

/** Full-size preview of how students will see the course page. */
export function CoursePreviewModal({ isOpen, onClose, ...contentProps }: CoursePreviewModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Course Preview"
      subtitle="This is how students will see your course page."
      maxWidth="xl"
    >
      <CoursePreviewContent {...contentProps} size="large" />
    </ModalShell>
  );
}

export default CoursePreviewModal;
