import React from "react";
import { CheckSquare, CircleDot, ToggleLeft, Type } from "lucide-react";
import type { Tone } from "@/components/ui/ToneBadge";
import type { QuizQuestionKind } from "@/types/quiz";
import { htmlToText } from "@/lib/sanitizeHtml";

/** Shared labels / helpers for the quiz Questions step and the Questions details tab. */

export const QUESTION_KINDS: QuizQuestionKind[] = ["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE", "SHORT_ANSWER"];

export const QUESTION_KIND_LABEL: Record<QuizQuestionKind, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  MULTIPLE_SELECT: "Multiple Select",
  TRUE_FALSE: "True or False",
  SHORT_ANSWER: "Short Answer",
};

export const QUESTION_KIND_TONE: Record<QuizQuestionKind, Tone> = {
  MULTIPLE_CHOICE: "blue",
  MULTIPLE_SELECT: "purple",
  TRUE_FALSE: "orange",
  SHORT_ANSWER: "green",
};

const KIND_ICON: Record<QuizQuestionKind, React.ComponentType<{ className?: string }>> = {
  MULTIPLE_CHOICE: CircleDot,
  MULTIPLE_SELECT: CheckSquare,
  TRUE_FALSE: ToggleLeft,
  SHORT_ANSWER: Type,
};

export function QuestionKindIcon({ kind, className = "h-4 w-4" }: { kind: QuizQuestionKind; className?: string }) {
  const Icon = KIND_ICON[kind];
  return <Icon className={className} />;
}

export const OPTIONS_MIN = 2;
export const OPTIONS_MAX = 8;
export const ACCEPTED_ANSWERS_MAX = 10;

export const optionLetter = (index: number) => String.fromCharCode(65 + index);
export const isChoiceKind = (kind: QuizQuestionKind) => kind !== "SHORT_ANSWER";
export const isSingleAnswerKind = (kind: QuizQuestionKind) => kind === "MULTIPLE_CHOICE" || kind === "TRUE_FALSE";
export const hasShuffle = (kind: QuizQuestionKind) => kind === "MULTIPLE_CHOICE" || kind === "MULTIPLE_SELECT";

export const questionPlainText = (html: string) => htmlToText(html ?? "");

export const newOptionId = (questionId: string) =>
  `${questionId}-o${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * framer-motion Reorder hands back the whole new key order; translate it into a single move(from, to).
 * Returns null when nothing moved.
 */
export function reorderToMove(prev: string[], next: string[]): [number, number] | null {
  const first = next.findIndex((k, i) => k !== prev[i]);
  if (first < 0) return null;
  let last = next.length - 1;
  while (last > first && next[last] === prev[last]) last--;
  return next[last] === prev[first] ? [first, last] : [last, first];
}
