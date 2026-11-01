"use client";

import React from "react";
import type { QuizTabProps } from "../../quizTabTypes";
import { QuizTabLayout } from "../../QuizTabLayout";
import { useQuizDetailsActions } from "../../QuizDetailsContext";
import { OverviewStatCards } from "./OverviewStatCards";
import { RecentSubmissionsCard } from "./RecentSubmissionsCard";
import { PerformanceOverviewCard } from "./PerformanceOverviewCard";
import { QuizInformationCard } from "./QuizInformationCard";
import { QuizQuickActionsCard } from "./QuizQuickActionsCard";
import { ShareQuizLinkCard } from "./ShareQuizLinkCard";

/** Overview: KPI cards, recent submissions, daily performance chart + info / quick actions / share link. */
export function OverviewTab({ quiz, attempts, course, onTabChange }: QuizTabProps) {
  const act = useQuizDetailsActions();
  return (
    <QuizTabLayout
      main={
        <>
          <OverviewStatCards quiz={quiz} attempts={attempts} />
          <RecentSubmissionsCard quiz={quiz} attempts={attempts} onViewAll={() => onTabChange("submissions")} />
          <PerformanceOverviewCard attempts={attempts} />
        </>
      }
      sidebar={
        <>
          <QuizInformationCard quiz={quiz} course={course} onEdit={act.editQuiz} />
          <QuizQuickActionsCard quiz={quiz} />
          <ShareQuizLinkCard quiz={quiz} />
        </>
      }
    />
  );
}

export default OverviewTab;
