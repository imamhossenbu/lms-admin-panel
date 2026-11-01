"use client";

import React, { useMemo } from "react";
import { quizInsights } from "@/lib/quizStats";
import type { QuizTabProps } from "../../quizTabTypes";
import { QuizTabLayout } from "../../QuizTabLayout";
import { InsightsCard } from "../../common/InsightsCard";
import { SubmissionsStatCards } from "./SubmissionsStatCards";
import { SubmissionsTableCard } from "./SubmissionsTableCard";
import { SubmissionInsightsCard } from "./SubmissionInsightsCard";
import { ScoreBandsCard } from "./ScoreBandsCard";
import { AverageTimeCard } from "./AverageTimeCard";
import { ExportSubmissionsCard } from "./ExportSubmissionsCard";
import { filterAttempts } from "./submissionFilters";
import { useQuizSubmissionsFilters } from "./useQuizSubmissionsFilters";

/** Submissions: KPI cards, URL-synced filters + attempts table, and insight cards on the right. */
export function SubmissionsTab({ quiz, attempts }: QuizTabProps) {
  const f = useQuizSubmissionsFilters();
  const { q, result, attempt, from, to, sort } = f.filters;
  const filtered = useMemo(() => filterAttempts(attempts, { q, result, attempt, from, to, sort }), [attempts, q, result, attempt, from, to, sort]);
  const insights = useMemo(() => quizInsights(quiz, attempts), [quiz, attempts]);

  return (
    <QuizTabLayout
      main={
        <>
          <SubmissionsStatCards attempts={attempts} />
          <SubmissionsTableCard quiz={quiz} filtered={filtered} f={f} />
        </>
      }
      sidebar={
        <>
          <SubmissionInsightsCard attempts={attempts} />
          <ScoreBandsCard attempts={attempts} />
          <AverageTimeCard quiz={quiz} attempts={attempts} />
          <InsightsCard title="Tips & Insights" insights={insights} />
          <ExportSubmissionsCard quiz={quiz} attempts={attempts} filtered={filtered} />
        </>
      }
    />
  );
}

export default SubmissionsTab;
