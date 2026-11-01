import type { AppSelectOption } from "@/components/ui/AppSelect";
import { totalMarksOf } from "@/lib/quizStats";
import type { QuizAttempt, QuizCourseRef, QuizItem } from "@/types/quiz";
import { QUIZ_DIFFICULTY_VIEW, QUIZ_STATUS_VIEW, findCourse, passPercent, quizModuleLabel, quizPlainText } from "../wizard/quizWizardFormat";

/** One table / grid row: the quiz plus everything derived for display (never hard-coded). */
export interface QuizRow {
  id: string;
  quiz: QuizItem;
  courseTitle: string;
  moduleLabel: string;
  description: string;
  questionCount: number;
  totalMarks: number;
  passPct: number;
  attempts: number;
}

export type UpdatedSort = "asc" | "desc";
export const parseUpdatedSort = (v: string): UpdatedSort => (v === "updated_asc" ? "asc" : "desc");

export const courseFilterOptions = (courses: QuizCourseRef[]): AppSelectOption[] => [
  { value: "All", label: "All Courses" },
  ...courses.map((c) => ({ value: c.id, label: c.title })),
];

/** Modules of the selected course (only "All Modules" until a course is picked). */
export const moduleFilterOptions = (courses: QuizCourseRef[], courseId: string): AppSelectOption[] => [
  { value: "All", label: "All Modules" },
  ...[...(findCourse(courses, courseId)?.modules ?? [])].sort((a, b) => a.order - b.order).map((m) => ({ value: m.id, label: `Module ${m.order}: ${m.title}` })),
];

export const STATUS_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Status" },
  ...(["PUBLISHED", "DRAFT", "ARCHIVED"] as const).map((s) => ({ value: s, label: QUIZ_STATUS_VIEW[s].label })),
];

export const DIFFICULTY_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Difficulty" },
  ...(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((d) => ({ value: d, label: QUIZ_DIFFICULTY_VIEW[d].label })),
];

export const countAttempts = (attempts: QuizAttempt[]) =>
  attempts.reduce<Record<string, number>>((acc, a) => {
    acc[a.quizId] = (acc[a.quizId] ?? 0) + 1;
    return acc;
  }, {});

export function toQuizRow(quiz: QuizItem, courses: QuizCourseRef[], attemptCounts: Record<string, number>): QuizRow {
  const totalMarks = totalMarksOf(quiz);
  return {
    id: quiz.id,
    quiz,
    courseTitle: findCourse(courses, quiz.courseId)?.title ?? "Unknown course",
    moduleLabel: quizModuleLabel(courses, quiz.courseId, quiz.moduleId) || "Unknown module",
    description: quizPlainText(quiz.descriptionHtml),
    questionCount: quiz.questions.length,
    totalMarks,
    passPct: passPercent(quiz.passingMarks, totalMarks),
    attempts: attemptCounts[quiz.id] ?? 0,
  };
}

export interface QuizListFilters {
  query: string;
  courseId: string;
  moduleId: string;
  status: string;
  difficulty: string;
}

export function filterRows(rows: QuizRow[], f: QuizListFilters, sort: UpdatedSort) {
  const q = f.query.toLowerCase().trim();
  return rows
    .filter((r) => {
      if (f.courseId !== "All" && r.quiz.courseId !== f.courseId) return false;
      if (f.moduleId !== "All" && r.quiz.moduleId !== f.moduleId) return false;
      if (f.status !== "All" && r.quiz.status !== f.status) return false;
      if (f.difficulty !== "All" && r.quiz.difficulty !== f.difficulty) return false;
      if (!q) return true;
      return [r.quiz.title, r.description, r.courseTitle, r.moduleLabel].some((s) => s.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const diff = new Date(a.quiz.updatedAt).getTime() - new Date(b.quiz.updatedAt).getTime();
      return sort === "asc" ? diff : -diff;
    });
}

export const formatUpdated = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};
