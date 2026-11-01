import type { QuizAttempt, QuizCourseRef, QuizDifficulty, QuizItem, QuizStatus } from "@/types/quiz";
import type { Tone } from "@/components/ui/ToneBadge";

/** Display helpers for the Quiz Details page (labels, tones, dates). */

export const QUIZ_STATUS_LABEL: Record<QuizStatus, string> = { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" };
export const QUIZ_STATUS_TONE: Record<QuizStatus, Tone> = { PUBLISHED: "green", DRAFT: "gray", ARCHIVED: "yellow" };
export const QUIZ_DIFFICULTY_LABEL: Record<QuizDifficulty, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" };
export const QUIZ_DIFFICULTY_TONE: Record<QuizDifficulty, Tone> = { BEGINNER: "green", INTERMEDIATE: "yellow", ADVANCED: "red" };

/** "Module 1: Getting Started" + "HTML Fundamentals". */
export function quizLocation(quiz: QuizItem, course: QuizCourseRef | undefined) {
  const mod = course?.modules.find((m) => m.id === quiz.moduleId);
  return { moduleLabel: mod ? `Module ${mod.order}: ${mod.title}` : "", courseLabel: course?.title ?? "" };
}

export const formatDate = (iso: string) =>
  iso ? new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";
export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
export const formatDateTime = (iso: string) => `${formatDate(iso)} ${formatTime(iso)}`;

/** "Just now" / "5 min ago" / "3 hours ago" / "2 days ago" / date. */
export function relativeTime(iso: string, now: Date = new Date()) {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

/** 1 → "1st", 2 → "2nd", 11 → "11th". */
export function ordinal(n: number) {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

export type AttemptResult = "passed" | "failed" | "incomplete";
export const attemptResult = (a: QuizAttempt): AttemptResult => (!a.completed ? "incomplete" : a.passed ? "passed" : "failed");
export const ATTEMPT_RESULT_LABEL: Record<AttemptResult, string> = { passed: "Passed", failed: "Failed", incomplete: "Incomplete" };
export const ATTEMPT_RESULT_TONE: Record<AttemptResult, Tone> = { passed: "green", failed: "red", incomplete: "gray" };

/** Drops a trailing ".0" (37.0 → "37", 37.4 → "37.4"). */
export const formatNumber = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "quiz";

export const quizShareUrl = (quiz: Pick<QuizItem, "title">) => `https://edupro.com/quiz/${slugify(quiz.title.replace(/\bquiz\b/gi, ""))}`;

export const timeLimitLabel = (quiz: QuizItem) => (quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} Minutes` : "No time limit");
export const attemptsLabel = (quiz: QuizItem) =>
  quiz.maxAttempts === "UNLIMITED" ? "Unlimited" : `${quiz.maxAttempts} Attempt${quiz.maxAttempts === "1" ? "" : "s"}`;
export function availabilityLabel(quiz: QuizItem) {
  if (quiz.startDate && quiz.endDate) return `${formatDate(quiz.startDate)} - ${formatDate(quiz.endDate)}`;
  if (quiz.startDate) return `From ${formatDate(quiz.startDate)}`;
  if (quiz.endDate) return `Until ${formatDate(quiz.endDate)}`;
  return "Always available";
}

/** Strips tags + basic entities from question HTML for one-line display. */
export const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Attempts submitted in the last `days` days (null = all time). */
export function withinDays<T extends { submittedAt: string }>(rows: T[], days: number | null, now: Date = new Date()) {
  if (days === null) return rows;
  const since = now.getTime() - days * 86400000;
  return rows.filter((r) => new Date(r.submittedAt).getTime() > since);
}

export const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
