import { quizApi, type QuizItem, type QuizQuestionItem } from "@/lib/api";
import { EMPTY_LESSON_FORM, type LessonQuiz, type LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { normalizeQuestionType, quizTotalMarks } from "./quizUtils";

/**
 * Pure API helpers that move a lesson's quiz between the backend (`/quiz`) and the
 * lesson form's `quiz` field. No toasts here — callers own the user feedback.
 */

const isNotFound = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status === 404;

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
};

const parseOptions = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((o) => String(o ?? ""));
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((o) => String(o ?? ""));
    } catch {
      // Not JSON — treat as a single option below.
    }
    return value ? [value] : [];
  }
  return [];
};

const toFormQuestion = (q: QuizQuestionItem): LessonQuizQuestion => ({
  id: typeof q.id === "string" ? q.id : "",
  questionText: q.questionText ?? "",
  questionType: normalizeQuestionType(q.questionType),
  options: parseOptions(q.options),
  correctAnswer: q.correctAnswer ?? "",
  marks: toNumber(q.marks, 1),
  explanation: q.explanation ?? "",
});

/** Fetch the quiz attached to a lesson. Resolves `null` when the lesson has no quiz yet. */
export async function loadLessonQuiz(lessonId: string): Promise<LessonQuiz | null> {
  if (!lessonId) return null;
  let res: (QuizItem & { questions?: QuizQuestionItem[] }) | null | undefined;
  try {
    res = await quizApi.getByLesson(lessonId);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
  if (!res || typeof res !== "object" || !res.id) return null;

  const questions = [...(Array.isArray(res.questions) ? res.questions : [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(toFormQuestion);

  return {
    id: res.id,
    timeLimitMinutes: toNumber(res.timeLimitMinutes, EMPTY_LESSON_FORM.quiz.timeLimitMinutes),
    passingScore: Math.min(100, toNumber(res.passingScore, EMPTY_LESSON_FORM.quiz.passingScore)),
    questions,
  };
}

export interface SaveLessonQuizArgs {
  courseId: string;
  lessonId: string;
  title: string;
  description?: string;
  quiz: LessonQuiz;
}

/** Create or update the lesson's quiz. Errors are re-thrown so the caller can toast them. */
export async function saveLessonQuiz({ courseId, lessonId, title, description, quiz }: SaveLessonQuizArgs): Promise<void> {
  if (quiz.questions.length === 0 && !quiz.id) return;

  const payload: Partial<QuizItem> = {
    courseId,
    lessonId,
    title,
    description,
    timeLimitMinutes: quiz.timeLimitMinutes,
    passingScore: quiz.passingScore,
    totalMarks: quizTotalMarks(quiz.questions),
    questions: quiz.questions.map((q, i) => ({
      questionText: q.questionText,
      // Server convention: "MULTIPLE_CHOICE" (its default) / "TRUE_FALSE".
      questionType: q.questionType === "MCQ" ? "MULTIPLE_CHOICE" : q.questionType,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      explanation: q.explanation || undefined,
      order: i + 1,
    })),
  };

  if (quiz.id) await quizApi.update(quiz.id, payload);
  else await quizApi.create(payload);
}
