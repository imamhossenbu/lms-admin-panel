import {
  EMPTY_LESSON_FORM,
  lessonDurationMinutes,
  type LessonFormValues,
} from "@/validations/lessonFormSchema";
import type { AiOutlineLesson } from "../aiOutline";

/** Fresh copy of the empty form (no shared nested objects / arrays between opens). */
const emptyForm = (): LessonFormValues => ({
  ...EMPTY_LESSON_FORM,
  video: { ...EMPTY_LESSON_FORM.video },
  quiz: { ...EMPTY_LESSON_FORM.quiz, questions: [] },
  resourceFiles: [],
  resourceLinks: [],
  tags: [],
});

/**
 * Outline lesson → Add/Edit Lesson form values. Uses the saved `details` when present, otherwise
 * falls back to the outline basics (title, type, summary, duration in minutes).
 */
export function lessonToFormValues(lesson?: AiOutlineLesson): LessonFormValues {
  const base = emptyForm();
  if (!lesson) return base;

  if (lesson.details) {
    const d = lesson.details;
    return {
      ...base,
      ...d,
      video: { ...base.video, ...d.video },
      // Drafts saved before the quiz builder existed have no `quiz`.
      quiz: d.quiz
        ? { ...base.quiz, ...d.quiz, questions: d.quiz.questions.map((q) => ({ ...q, options: [...q.options] })) }
        : base.quiz,
      resourceFiles: d.resourceFiles.map((f) => ({ ...f })),
      resourceLinks: d.resourceLinks.map((l) => ({ ...l })),
      tags: [...d.tags],
      title: lesson.title,
      type: lesson.type,
      summary: lesson.summary ?? "",
    };
  }

  return {
    ...base,
    title: lesson.title,
    type: lesson.type,
    summary: lesson.summary ?? "",
    duration: Math.min(600, Math.max(1, Math.round(lesson.durationMinutes || base.duration))),
    durationUnit: "minutes",
  };
}

/** Form values → outline lesson (without id). Everything beyond title/type/summary goes into `details`. */
export function formValuesToLesson(values: LessonFormValues): Omit<AiOutlineLesson, "id"> {
  const { title, type, summary, ...details } = values;
  const cleanSummary = summary.trim();
  return {
    title: title.trim(),
    type,
    durationMinutes: lessonDurationMinutes(values),
    summary: cleanSummary || undefined,
    details,
  };
}
