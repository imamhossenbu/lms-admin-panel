"use client";

import React from "react";
import { useFormState } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorLessonRef } from "@/types/lessonEditor";
import { useLeaveGuard } from "../../hooks/useLeaveGuard";
import { UnsavedChangesModal } from "../../UnsavedChangesModal";

export interface LessonNavigationProps {
  courseId: string;
  lessonId: string;
  lessons: LessonEditorLessonRef[];
}

/** "← Previous Lesson" / "Next Lesson →" — opens the neighbouring lesson's editor, keeping ?tab. */
export function LessonNavigation({ courseId, lessonId, lessons }: LessonNavigationProps) {
  const { isDirty } = useFormState<LessonEditorValues>();
  const searchParams = useSearchParams();
  const leave = useLeaveGuard(isDirty);

  const index = lessons.findIndex((l) => l.id === lessonId);
  const prev = index > 0 ? lessons[index - 1] : undefined;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined;
  const query = searchParams.toString();
  const hrefOf = (lesson: LessonEditorLessonRef) => `/courses/${courseId}/lessons/${lesson.id}/edit${query ? `?${query}` : ""}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SecondaryButton
        size="lg"
        leftIcon={<ArrowLeft />}
        disabled={!prev}
        title={prev ? prev.title : "This is the first lesson"}
        onClick={() => prev && leave.navigate(hrefOf(prev))}
      >
        Previous Lesson
      </SecondaryButton>
      <SecondaryButton
        size="lg"
        rightIcon={<ArrowRight />}
        disabled={!next}
        title={next ? next.title : "This is the last lesson"}
        onClick={() => next && leave.navigate(hrefOf(next))}
      >
        Next Lesson
      </SecondaryButton>
      <UnsavedChangesModal isOpen={leave.isConfirmOpen} onClose={leave.cancelLeave} onConfirm={leave.confirmLeave} />
    </div>
  );
}

export default LessonNavigation;
