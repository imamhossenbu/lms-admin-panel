import type { AppSelectOption } from "@/components/ui/AppSelect";
import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";

type Quiz = LessonEditorValues["quiz"];

export const QUIZ_TITLE_MAX = 100;
export const QUIZ_DESCRIPTION_MAX = 200;
export const QUIZ_QUESTIONS_MAX = 50;

export const QUESTION_TYPE_BADGE: Record<LessonQuizQuestion["questionType"], string> = {
  MCQ: "Multiple Choice",
  TRUE_FALSE: "True/False",
};

export const QUIZ_KIND_OPTIONS: ChoiceOption<Quiz["kind"]>[] = [
  { value: "GRADED", title: "Graded Quiz", description: "Students will get a score" },
  { value: "PRACTICE", title: "Practice Quiz", description: "No score, for self-assessment" },
];

export const QUESTION_ORDER_OPTIONS: AppSelectOption[] = [
  { value: "SEQUENTIAL", label: "Sequential Order" },
  { value: "RANDOM", label: "Random Order" },
];

export const QUESTION_ORDER_HELP: Record<Quiz["questionOrder"], string> = {
  SEQUENTIAL: "Questions will be shown in the order listed.",
  RANDOM: "Questions will be shown in random order.",
};

export const SHOW_RESULTS_OPTIONS: AppSelectOption[] = [
  { value: "AFTER_SUBMISSION", label: "After Submission" },
  { value: "AFTER_DEADLINE", label: "After Deadline" },
  { value: "NEVER", label: "Never" },
];

export const ATTEMPT_SELECT_OPTIONS: AppSelectOption[] = [
  { value: "UNLIMITED", label: "Unlimited" },
  { value: "1", label: "1 attempt" },
  { value: "2", label: "2 attempts" },
  { value: "3", label: "3 attempts" },
  { value: "5", label: "5 attempts" },
];

/** "" / null → null (no time limit), otherwise a number (zod validates range / integer). */
export const toNullableNumber = (value: unknown): number | null =>
  value === "" || value === null || value === undefined ? null : Number(value);
