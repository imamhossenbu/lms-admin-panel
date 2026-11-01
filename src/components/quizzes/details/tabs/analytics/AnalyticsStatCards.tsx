"use client";

import React from "react";
import { CircleCheck, Clock, FileCheck2, Trophy, Users } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { attemptMetrics, formatDuration, totalMarksOf, trendVsPrevious } from "@/lib/quizStats";
import { QuizStatCard } from "../../common/QuizStatCard";
import { formatNumber } from "../../quizFormat";
import { TREND_CAPTION } from "../overview/OverviewStatCards";

/** Total Submissions / Pass Rate / Average Score / Average Time / Completion Rate with 30-day changes. */
export function AnalyticsStatCards({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const m = attemptMetrics(attempts);
  const t = (metric: (xs: QuizAttempt[]) => number) => trendVsPrevious(attempts, metric);
  const tTotal = t((xs) => xs.length);
  const tPass = t((xs) => attemptMetrics(xs).passRate);
  const tScore = t((xs) => attemptMetrics(xs).avgScore);
  const tTime = t((xs) => attemptMetrics(xs).avgTimeSeconds);
  const tDone = t((xs) => attemptMetrics(xs).completionRate);
  const vs = (x: number | null) => (x === null ? undefined : TREND_CAPTION);

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-5">
        <QuizStatCard index={0} tone="blue" icon={Users} label="Total Submissions" value={m.total} trend={tTotal} caption={vs(tTotal)} />
        <QuizStatCard index={1} tone="green" icon={CircleCheck} label="Pass Rate" value={`${m.passRate}%`} trend={tPass} caption={`${m.passed} passed out of ${m.total}`} />
        <QuizStatCard index={2} tone="orange" icon={Trophy} label="Average Score" value={`${formatNumber(m.avgScore)}/${totalMarksOf(quiz)}`} trend={tScore} caption={vs(tScore)} />
        <QuizStatCard index={3} tone="red" icon={Clock} label="Average Time" value={formatDuration(m.avgTimeSeconds)} trend={tTime} caption={vs(tTime)} />
        <QuizStatCard index={4} tone="purple" icon={FileCheck2} label="Completion Rate" value={`${m.completionRate}%`} trend={tDone} caption={`${m.completed} completed`} />
      </div>
    </div>
  );
}

export default AnalyticsStatCards;
