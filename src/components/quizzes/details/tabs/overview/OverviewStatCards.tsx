"use client";

import React from "react";
import { Clock, Trophy, Users, CircleCheck } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { attemptMetrics, formatDuration, totalMarksOf, trendVsPrevious } from "@/lib/quizStats";
import { QuizStatCard } from "../../common/QuizStatCard";
import { formatNumber } from "../../quizFormat";

export const TREND_CAPTION = "vs previous 30 days";

/** Total Attempts / Pass Rate / Average Score / Average Time, each with its 30-day change. */
export function OverviewStatCards({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const m = attemptMetrics(attempts);
  const trend = (metric: (xs: QuizAttempt[]) => number) => trendVsPrevious(attempts, metric);
  const tTotal = trend((xs) => xs.length);
  const tPass = trend((xs) => attemptMetrics(xs).passRate);
  const tScore = trend((xs) => attemptMetrics(xs).avgScore);
  const tTime = trend((xs) => attemptMetrics(xs).avgTimeSeconds);
  const caption = (t: number | null) => (t === null ? undefined : TREND_CAPTION);

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @3xl:grid-cols-4">
        <QuizStatCard index={0} tone="blue" icon={Users} label="Total Attempts" value={m.total} trend={tTotal} caption={caption(tTotal)} />
        <QuizStatCard index={1} tone="green" icon={CircleCheck} label="Pass Rate" value={`${m.passRate}%`} trend={tPass} caption={caption(tPass)} />
        <QuizStatCard
          index={2}
          tone="orange"
          icon={Trophy}
          label="Average Score"
          value={`${formatNumber(m.avgScore)}/${totalMarksOf(quiz)}`}
          trend={tScore}
          caption={caption(tScore)}
        />
        <QuizStatCard index={3} tone="red" icon={Clock} label="Average Time" value={formatDuration(m.avgTimeSeconds)} trend={tTime} caption={caption(tTime)} />
      </div>
    </div>
  );
}

export default OverviewStatCards;
