"use client";

import React from "react";
import { CircleCheck, CircleX, Clock, Users } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { attemptMetrics, formatDuration, trendVsPrevious } from "@/lib/quizStats";
import { QuizStatCard } from "../../common/QuizStatCard";
import { TREND_CAPTION } from "../overview/OverviewStatCards";

/** Total Submissions / Passed (+ rate bar) / Failed (+ rate bar) / Average Time. */
export function SubmissionsStatCards({ attempts }: { attempts: QuizAttempt[] }) {
  const m = attemptMetrics(attempts);
  const tTotal = trendVsPrevious(attempts, (xs) => xs.length);
  const tTime = trendVsPrevious(attempts, (xs) => attemptMetrics(xs).avgTimeSeconds);
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @3xl:grid-cols-4">
        <QuizStatCard index={0} tone="blue" icon={Users} label="Total Submissions" value={m.total} trend={tTotal} caption={tTotal === null ? undefined : TREND_CAPTION} />
        <QuizStatCard index={1} tone="green" icon={CircleCheck} label="Passed" value={m.passed} caption={`${m.passRate}% pass rate`} meter={{ value: m.passRate, tone: "green" }} />
        <QuizStatCard index={2} tone="red" icon={CircleX} label="Failed" value={m.failed} caption={`${m.failRate}% fail rate`} meter={{ value: m.failRate, tone: "red" }} />
        <QuizStatCard index={3} tone="orange" icon={Clock} label="Average Time" value={formatDuration(m.avgTimeSeconds)} trend={tTime} caption={tTime === null ? undefined : TREND_CAPTION} />
      </div>
    </div>
  );
}

export default SubmissionsStatCards;
