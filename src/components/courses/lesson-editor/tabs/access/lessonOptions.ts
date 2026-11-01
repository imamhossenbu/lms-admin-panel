import { useMemo } from "react";
import type { AiLessonType } from "@/components/courses/create/aiOutline";
import type { LessonEditorContext } from "@/types/lessonEditor";

/** A course lesson as shown in prerequisite pickers ("2. What is HTML?" / "Module 1: Getting Started"). */
export interface LessonOption {
  id: string;
  title: string;
  type: AiLessonType;
  label: string;
  moduleLabel: string;
}

export function buildLessonOptions(context: LessonEditorContext, excludeLessonId?: string): LessonOption[] {
  const moduleOrder = new Map(context.modules.map((m) => [m.id, m.order]));
  return context.lessons
    .filter((lesson) => lesson.id !== excludeLessonId)
    .map((lesson) => {
      const order = moduleOrder.get(lesson.moduleId);
      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        label: `${lesson.order}. ${lesson.title}`,
        moduleLabel: order ? `Module ${order}: ${lesson.moduleTitle}` : lesson.moduleTitle,
      };
    });
}

/** Every lesson of the course except the one being edited. */
export function useLessonOptions(context: LessonEditorContext, excludeLessonId?: string): LessonOption[] {
  return useMemo(() => buildLessonOptions(context, excludeLessonId), [context, excludeLessonId]);
}
