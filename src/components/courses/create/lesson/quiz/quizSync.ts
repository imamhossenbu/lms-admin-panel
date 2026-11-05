import { apiClient } from "@/lib/api";
import type { QuizItem, QuizQuestionItem } from "@/types/quiz";
import { EMPTY_LESSON_FORM, type LessonQuiz, type LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { quizTotalMarks, TRUE_FALSE_OPTIONS } from "./quizUtils";

/**
 * Moves a course-builder "Quiz" lesson's quiz between the Quizzes API (`/admin/quizzes`, one quiz per lesson via
 * `lessonId`) and the lesson form's `quiz` field. No toasts here — callers own the user feedback.
 */

const BASE = "/admin/quizzes";
const clip = (s: string, max: number) => s.trim().slice(0, max);
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toHtml = (s: string) => (s.trim() ? `<p>${escapeHtml(s.trim())}</p>` : "");
const toText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** API question → form question (the form knows MCQ and True / False with plain-text options). */
function toFormQuestion(q: QuizQuestionItem): LessonQuizQuestion {
  const options = q.options.map((o) => o.text);
  const correct = q.options.find((o) => q.correctOptionIds.includes(o.id))?.text ?? "";
  return {
    id: q.id,
    questionText: toText(q.questionHtml),
    questionType: q.kind === "TRUE_FALSE" ? "TRUE_FALSE" : "MCQ",
    options: q.kind === "TRUE_FALSE" && options.length === 0 ? [...TRUE_FALSE_OPTIONS] : options,
    correctAnswer: correct,
    marks: Math.max(1, q.points || 1),
    explanation: toText(q.explanationHtml),
  };
}

/** Form question → API question. Option ids are positional ("a", "b"…); the correct one is matched by text. */
function toApiQuestion(q: LessonQuizQuestion, index: number): QuizQuestionItem {
  const texts = (q.questionType === "TRUE_FALSE" ? TRUE_FALSE_OPTIONS : q.options).map((t) => clip(t, 200)).filter(Boolean);
  const options = texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));
  const correct = options.find((o) => o.text === q.correctAnswer.trim());
  return {
    id: /^[A-Za-z0-9_-]{1,64}$/.test(q.id) ? q.id : `q-${index + 1}`,
    kind: q.questionType === "TRUE_FALSE" ? "TRUE_FALSE" : "MULTIPLE_CHOICE",
    questionHtml: toHtml(clip(q.questionText, 500)),
    options,
    correctOptionIds: correct ? [correct.id] : [],
    acceptedAnswers: [],
    explanationHtml: toHtml(clip(q.explanation ?? "", 500)),
    points: Math.min(100, Math.max(1, Math.round(q.marks || 1))),
    timeLimitSeconds: null,
    required: true,
    shuffleOptions: false,
  };
}

/** The quiz attached to a lesson, or null when the lesson has none yet. */
async function findLessonQuiz(lessonId: string): Promise<QuizItem | null> {
  const { data } = await apiClient.get<{ data: QuizItem[] }>(BASE, { params: { lessonId, limit: 1 } });
  return data.data[0] ?? null;
}

/** Fetch the quiz attached to a lesson. Resolves `null` when the lesson has no quiz yet. */
export async function loadLessonQuiz(lessonId: string): Promise<LessonQuiz | null> {
  if (!lessonId) return null;
  const quiz = await findLessonQuiz(lessonId);
  if (!quiz) return null;
  const total = quiz.questions.reduce((s, q) => s + q.points, 0);
  return {
    id: quiz.id,
    timeLimitMinutes: quiz.timeLimitMinutes ?? EMPTY_LESSON_FORM.quiz.timeLimitMinutes,
    passingScore: total > 0 ? Math.min(100, Math.max(1, Math.round((quiz.passingMarks / total) * 100))) : EMPTY_LESSON_FORM.quiz.passingScore,
    questions: quiz.questions.map(toFormQuestion),
  };
}

export interface SaveLessonQuizArgs {
  courseId: string;
  lessonId: string;
  title: string;
  description?: string;
  quiz: LessonQuiz;
}

/**
 * Create or update the lesson's quiz (published while it has questions, a draft once they're all removed).
 * Errors are re-thrown so the caller can toast them.
 */
export async function saveLessonQuiz({ courseId, lessonId, title, description, quiz }: SaveLessonQuizArgs): Promise<void> {
  const existingId = quiz.id || (await findLessonQuiz(lessonId))?.id || "";
  if (quiz.questions.length === 0 && !existingId) return;

  const questions = quiz.questions.map(toApiQuestion);
  const total = quizTotalMarks(quiz.questions.map((q) => ({ marks: Math.min(100, Math.max(1, Math.round(q.marks || 1))) })));
  const about = clip(description ?? "", 1000);
  const payload = {
    title: clip(title, 120),
    courseId,
    lessonId,
    difficulty: "BEGINNER",
    descriptionHtml: toHtml(about.length >= 10 ? about : `Quiz for the lesson "${clip(title, 900)}".`),
    instructionsHtml: "",
    questions,
    passingMarks: Math.max(1, Math.min(Math.max(total, 1), Math.ceil((total * quiz.passingScore) / 100))),
    timeLimitMinutes: quiz.timeLimitMinutes,
    maxAttempts: "UNLIMITED",
    showCorrectAnswers: true,
    showExplanation: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    startDate: "",
    endDate: "",
    access: "ENROLLED",
    requirePreviousLessons: false,
    showImmediately: false,
    status: questions.length ? "PUBLISHED" : "DRAFT",
  };

  if (existingId) await apiClient.patch(`${BASE}/${encodeURIComponent(existingId)}`, payload);
  else await apiClient.post(BASE, payload);
}
