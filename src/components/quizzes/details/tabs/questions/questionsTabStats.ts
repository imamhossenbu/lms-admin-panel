import type { Tone } from "@/components/ui/ToneBadge";
import type { QuizQuestionKind, QuizQuestionItem } from "@/types/quiz";
import { QUESTION_KINDS } from "@/components/quizzes/wizard/steps/questions/questionKinds";

export type QuestionPerf = { questionId: string; index: number; text: string; answered: number; correctPct: number };

/** Green ≥ 80 %, yellow ≥ 60 %, red otherwise. */
export const correctRateTone = (pct: number): Tone => (pct >= 80 ? "green" : pct >= 60 ? "yellow" : "red");

export function questionSummary(questions: QuizQuestionItem[]) {
  const byKind = QUESTION_KINDS.map((kind) => ({ kind, count: questions.filter((q) => q.kind === kind).length }));
  const totalMarks = questions.reduce((s, q) => s + q.points, 0);
  const avgPoints = questions.length ? Math.round((totalMarks / questions.length) * 10) / 10 : 0;
  return { count: questions.length, byKind, totalMarks, avgPoints } as {
    count: number;
    byKind: { kind: QuizQuestionKind; count: number }[];
    totalMarks: number;
    avgPoints: number;
  };
}

/** The `n` answered questions with the lowest correct rate. */
export const hardestQuestions = (perf: QuestionPerf[], n = 3) =>
  perf.filter((p) => p.answered > 0).sort((a, b) => a.correctPct - b.correctPct || a.index - b.index).slice(0, n);
