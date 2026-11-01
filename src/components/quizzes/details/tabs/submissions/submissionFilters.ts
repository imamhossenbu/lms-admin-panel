import type { QuizAttempt } from "@/types/quiz";
import { isInDateRange } from "@/components/ui/DateRangeFilter";
import { attemptResult } from "../../quizFormat";

export const RESULT_OPTIONS = [
  { value: "All", label: "All Results" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "incomplete", label: "Incomplete" },
] as const;

export const ATTEMPT_OPTIONS = [
  { value: "All", label: "All Attempts" },
  { value: "1", label: "1st Attempt" },
  { value: "2", label: "2nd Attempt" },
  { value: "3", label: "3rd+ Attempts" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "score", label: "Highest Score" },
  { value: "score-asc", label: "Lowest Score" },
  { value: "fastest", label: "Fastest" },
] as const;

export const SUBMISSION_PAGE_SIZES = [10, 20, 50];

export interface SubmissionFilters {
  q: string;
  result: string;
  attempt: string;
  from: string;
  to: string;
  sort: string;
}

const SORTERS: Record<string, (a: QuizAttempt, b: QuizAttempt) => number> = {
  newest: (a, b) => b.submittedAt.localeCompare(a.submittedAt),
  oldest: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
  score: (a, b) => b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds,
  "score-asc": (a, b) => a.score - b.score,
  fastest: (a, b) => a.timeTakenSeconds - b.timeTakenSeconds,
};

/** Applies search / result / attempt / date-range filters and the sort order. */
export function filterAttempts(attempts: QuizAttempt[], f: SubmissionFilters) {
  const q = f.q.trim().toLowerCase();
  const range = { from: f.from || undefined, to: f.to || undefined };
  return attempts
    .filter((a) => !q || a.student.name.toLowerCase().includes(q) || a.student.email.toLowerCase().includes(q))
    .filter((a) => f.result === "All" || attemptResult(a) === f.result)
    .filter((a) => f.attempt === "All" || (f.attempt === "3" ? a.attemptNumber >= 3 : a.attemptNumber === Number(f.attempt)))
    .filter((a) => isInDateRange(a.submittedAt, range))
    .sort(SORTERS[f.sort] ?? SORTERS.newest);
}
