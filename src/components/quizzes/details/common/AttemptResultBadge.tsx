import React from "react";
import type { QuizAttempt } from "@/types/quiz";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ATTEMPT_RESULT_LABEL, ATTEMPT_RESULT_TONE, attemptResult } from "../quizFormat";

/** Passed (green) / Failed (red) / Incomplete (gray) result badge for an attempt. */
export function AttemptResultBadge({ attempt, size = "md" }: { attempt: QuizAttempt; size?: "sm" | "md" }) {
  const result = attemptResult(attempt);
  return (
    <ToneBadge tone={ATTEMPT_RESULT_TONE[result]} size={size}>
      {ATTEMPT_RESULT_LABEL[result]}
    </ToneBadge>
  );
}

export default AttemptResultBadge;
