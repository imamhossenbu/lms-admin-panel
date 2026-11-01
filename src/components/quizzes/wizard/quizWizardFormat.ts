import type { Tone } from "@/components/ui/ToneBadge";
import { htmlToText } from "@/lib/sanitizeHtml";
import type { QuizAccess, QuizCourseRef, QuizDifficulty, QuizQuestionKind, QuizStatus } from "@/types/quiz";

/** Display helpers shared by the Quizzes list and the Create / Edit wizard. */

export const QUIZ_DIFFICULTY_VIEW: Record<QuizDifficulty, { label: string; tone: Tone }> = {
  BEGINNER: { label: "Beginner", tone: "green" },
  INTERMEDIATE: { label: "Intermediate", tone: "blue" },
  ADVANCED: { label: "Advanced", tone: "purple" },
};

export const QUIZ_STATUS_VIEW: Record<QuizStatus, { label: string; tone: Tone }> = {
  PUBLISHED: { label: "Published", tone: "green" },
  DRAFT: { label: "Draft", tone: "yellow" },
  ARCHIVED: { label: "Archived", tone: "red" },
};

export const QUIZ_KIND_VIEW: Record<QuizQuestionKind, { label: string; tone: Tone }> = {
  MULTIPLE_CHOICE: { label: "Multiple Choice", tone: "blue" },
  MULTIPLE_SELECT: { label: "Multiple Select", tone: "orange" },
  TRUE_FALSE: { label: "True / False", tone: "green" },
  SHORT_ANSWER: { label: "Short Answer", tone: "purple" },
};

export const QUIZ_ACCESS_LABEL: Record<QuizAccess, string> = {
  ENROLLED: "Enrolled Students Only",
  ALL_STUDENTS: "All Students",
  SPECIFIC_GROUPS: "Specific Groups",
};

export const quizPlainText = (html: string) => htmlToText(html ?? "");

export const findCourse = (courses: QuizCourseRef[], courseId: string) => courses.find((c) => c.id === courseId);

/** "Module 1: Getting Started" ("" when unknown). */
export function quizModuleLabel(courses: QuizCourseRef[], courseId: string, moduleId: string) {
  const m = findCourse(courses, courseId)?.modules.find((x) => x.id === moduleId);
  return m ? `Module ${m.order}: ${m.title}` : "";
}

export const attemptsLabel = (maxAttempts: string) =>
  maxAttempts === "UNLIMITED" ? "Unlimited" : `${maxAttempts} Attempt${maxAttempts === "1" ? "" : "s"}`;

export const timeLimitLabel = (minutes: number | null | undefined) =>
  minutes ? `${minutes} Minute${minutes === 1 ? "" : "s"}` : "No time limit";

export const passPercent = (passing: number, total: number) => (total > 0 ? Math.round((passing / total) * 100) : 0);

/** "Oct 25, 2026" from "YYYY-MM-DD" (local, no timezone shift). */
export function formatDateOnly(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function availabilityLabel(start: string, end: string) {
  if (start && end) return `${formatDateOnly(start)} - ${formatDateOnly(end)}`;
  if (start) return `From ${formatDateOnly(start)}`;
  if (end) return `Until ${formatDateOnly(end)}`;
  return "Always available";
}
