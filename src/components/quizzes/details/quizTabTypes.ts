import type { QuizActivity, QuizAttempt, QuizCourseRef, QuizItem } from "@/types/quiz";

export const QUIZ_DETAIL_TABS = ["overview", "questions", "submissions", "analytics", "activity"] as const;
export type QuizDetailTab = (typeof QUIZ_DETAIL_TABS)[number];
export const QUIZ_DETAIL_TAB_LABEL: Record<QuizDetailTab, string> = {
  overview: "Overview",
  questions: "Questions",
  submissions: "Submissions",
  analytics: "Analytics",
  activity: "Activity Log",
};

/** Props every Quiz Details tab receives from QuizDetailsView. Each tab renders its own body (main + right column). */
export interface QuizTabProps {
  quiz: QuizItem;
  attempts: QuizAttempt[];
  activity: QuizActivity[];
  course: QuizCourseRef | undefined;
  onQuizChange: (next: QuizItem) => void;
  onTabChange: (tab: QuizDetailTab) => void;
}
