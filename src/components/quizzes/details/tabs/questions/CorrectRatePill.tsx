import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { correctRateTone } from "./questionsTabStats";

export interface CorrectRatePillProps {
  pct: number;
  answered: number;
}

/** "82% correct" pill (green ≥ 80, yellow ≥ 60, red otherwise); grey "No attempts" when unanswered. */
export function CorrectRatePill({ pct, answered }: CorrectRatePillProps) {
  if (!answered)
    return (
      <ToneBadge tone="gray" size="sm" variant="pill">
        No attempts
      </ToneBadge>
    );
  return (
    <ToneBadge tone={correctRateTone(pct)} size="sm" variant="pill" dot>
      {pct}% correct
    </ToneBadge>
  );
}

export default CorrectRatePill;
