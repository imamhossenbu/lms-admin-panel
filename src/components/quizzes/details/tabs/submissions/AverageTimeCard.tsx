"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { attemptMetrics, formatDuration, trendVsPrevious } from "@/lib/quizStats";
import { TrendPill } from "../../common/TrendPill";
import { TREND_CAPTION } from "../overview/OverviewStatCards";

/** Average completion time with its 30-day change (and the time limit for context). */
export function AverageTimeCard({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const m = attemptMetrics(attempts);
  const trend = trendVsPrevious(attempts, (xs) => attemptMetrics(xs).avgTimeSeconds);
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="@container dashboard-card shadow-2xs p-5"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">
          <Clock className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-sm-regular text-primary-300">Average Time Taken</p>
          <p className="heading-h4 font-bold! text-primary-500 leading-tight whitespace-nowrap">{formatDuration(m.avgTimeSeconds)}</p>
        </div>
        {trend !== null && (
          <div className="flex flex-col items-start gap-1 @xs:items-end">
            <TrendPill value={trend} />
            <span className="body-xsm-regular text-primary-300 whitespace-nowrap">{TREND_CAPTION}</span>
          </div>
        )}
      </div>
      {quiz.timeLimitMinutes && <p className="mt-3 body-xsm-regular text-primary-300">Time limit: {quiz.timeLimitMinutes} minutes</p>}
    </motion.section>
  );
}

export default AverageTimeCard;
