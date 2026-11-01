import type { QuizQuestionKind } from "@/types/quiz";
import type { QuizQuestionValues } from "@/validations/quizWizardSchema";
import { newQuizQuestion } from "@/lib/quizWizardMapping";
import { hasShuffle } from "./questionKinds";

type Answers = Pick<QuizQuestionValues, "kind" | "options" | "correctOptionIds" | "acceptedAnswers" | "shuffleOptions">;

/** True when the question already has answer content the user typed. */
export function hasAnswerContent(q: Answers) {
  if (q.kind === "SHORT_ANSWER") return q.acceptedAnswers.length > 0;
  if (q.kind === "TRUE_FALSE") return q.correctOptionIds.length > 0;
  return q.options.some((o) => o.text.trim()) || q.correctOptionIds.length > 0;
}

/**
 * Answer fields after switching a question to `next`. Multiple Choice ⇄ Multiple Select keep the
 * options (MS → MC keeps only the first correct answer); every other switch starts fresh answers.
 * `lossy` = something the user entered would be discarded (ask before applying).
 */
export function convertQuestionKind(q: Answers & { id: string }, next: QuizQuestionKind): { values: Answers; lossy: boolean } {
  const choiceSwap =
    (q.kind === "MULTIPLE_CHOICE" && next === "MULTIPLE_SELECT") || (q.kind === "MULTIPLE_SELECT" && next === "MULTIPLE_CHOICE");

  if (choiceSwap) {
    const valid = q.correctOptionIds.filter((id) => q.options.some((o) => o.id === id));
    const correct = next === "MULTIPLE_CHOICE" ? valid.slice(0, 1) : valid;
    return {
      values: { kind: next, options: q.options, correctOptionIds: correct, acceptedAnswers: q.acceptedAnswers, shuffleOptions: q.shuffleOptions },
      lossy: correct.length < valid.length,
    };
  }

  const fresh = newQuizQuestion(next);
  // Re-key fresh options under the existing question id (ids must stay unique per question).
  const options = fresh.options.map((o, i) => ({ id: `${q.id}-${next === "TRUE_FALSE" ? (i === 0 ? "t" : "f") : `n${Date.now().toString(36)}${i}`}`, text: o.text }));
  return {
    values: {
      kind: next,
      options,
      correctOptionIds: [],
      acceptedAnswers: next === "SHORT_ANSWER" ? q.acceptedAnswers : [],
      shuffleOptions: hasShuffle(next) ? q.shuffleOptions : false,
    },
    lossy: hasAnswerContent(q),
  };
}
