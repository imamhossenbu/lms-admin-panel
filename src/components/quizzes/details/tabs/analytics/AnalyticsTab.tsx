"use client";

import React, { useMemo } from "react";
import { quizInsights } from "@/lib/quizStats";
import { useUrlParams } from "@/lib/useUrlParams";
import type { QuizTabProps } from "../../quizTabTypes";
import { InsightsCard } from "../../common/InsightsCard";
import { AnalyticsStatCards } from "./AnalyticsStatCards";
import { ScoreDistributionChartCard } from "./ScoreDistributionChartCard";
import { PassFailCard } from "./PassFailCard";
import { ScoreTrendCard } from "./ScoreTrendCard";
import { QuestionPerformanceCard } from "./QuestionPerformanceCard";
import { TimeDistributionCard } from "./TimeDistributionCard";
import { TopStudentsCard } from "./TopStudentsCard";

/** Analytics: 5 KPI cards, score/pass/trend charts, question performance, time spread, leaders, insights. */
export function AnalyticsTab({ quiz, attempts }: QuizTabProps) {
  const { set } = useUrlParams();
  const insights = useMemo(() => quizInsights(quiz, attempts), [quiz, attempts]);
  // "View All Students" → Submissions tab sorted by highest score.
  const viewAllStudents = () => {
    set({ tab: "submissions", ssort: "score", spage: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <AnalyticsStatCards quiz={quiz} attempts={attempts} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <ScoreDistributionChartCard quiz={quiz} attempts={attempts} />
        <PassFailCard attempts={attempts} />
        <div className="lg:col-span-2 2xl:col-span-1">
          <ScoreTrendCard quiz={quiz} attempts={attempts} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <QuestionPerformanceCard quiz={quiz} attempts={attempts} />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <TimeDistributionCard attempts={attempts} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <TopStudentsCard attempts={attempts} onViewAll={viewAllStudents} />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <InsightsCard title="Key Insights" insights={insights} className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
