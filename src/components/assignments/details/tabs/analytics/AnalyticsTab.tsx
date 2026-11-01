"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AssignmentTabProps } from "../../tabTypes";
import { AssignmentStatCards } from "../../AssignmentStatCards";
import { AssignmentDetailsCard } from "../../sidebar/AssignmentDetailsCard";
import { AssignmentQuickActions, type QuickActionKey } from "../../sidebar/AssignmentQuickActions";
import { ScoreDistributionCard } from "./ScoreDistributionCard";
import { ScoreTrendCard } from "./ScoreTrendCard";
import { SubmissionStatusCard } from "./SubmissionStatusCard";
import { CriteriaPerformanceCard } from "./CriteriaPerformanceCard";
import { TopPerformersCard } from "./TopPerformersCard";
import { NeedsAttentionCard } from "./NeedsAttentionCard";
import { InsightsCard } from "./InsightsCard";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { buildInsights } from "./analyticsInsights";
import { useAnalyticsFilters } from "./useAnalyticsFilters";

const QUICK_ACTIONS: QuickActionKey[] = ["viewSubmissions", "downloadReport", "exportCsv", "remind", "edit", "delete"];

/** Assignment Details → Analytics tab: stat cards, charts, top/attention tables, insights. */
export function AnalyticsTab({ assignment, submissions, onTabChange }: AssignmentTabProps) {
  const router = useRouter();
  const filters = useAnalyticsFilters();
  const gradedCount = submissions.filter((s) => s.status === "GRADED" && s.score !== null).length;
  const insights = useMemo(() => buildInsights(assignment, submissions, filters.range), [assignment, submissions, filters.range]);
  const toSubmissions = () => onTabChange("submissions");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <AssignmentStatCards submissions={submissions} />
        {gradedCount === 0 ? (
          <>
            <AnalyticsEmptyState isDraft={assignment.status === "DRAFT"} submitted={submissions.length} onViewSubmissions={toSubmissions} />
            {submissions.length > 0 && <NeedsAttentionCard submissions={submissions} onViewAll={toSubmissions} />}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ScoreDistributionCard submissions={submissions} totalPoints={assignment.totalPoints} scope={filters.scope} onScopeChange={filters.setScope} />
              <ScoreTrendCard submissions={submissions} totalPoints={assignment.totalPoints} range={filters.range} onRangeChange={filters.setRange} />
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <SubmissionStatusCard submissions={submissions} />
              <CriteriaPerformanceCard submissions={submissions} rubric={assignment.rubric} filter={filters.criteria} onFilterChange={filters.setCriteria} />
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <TopPerformersCard submissions={submissions} totalPoints={assignment.totalPoints} onViewAll={toSubmissions} />
              <NeedsAttentionCard submissions={submissions} onViewAll={toSubmissions} />
            </div>
          </>
        )}
      </div>
      <div className="min-w-0 space-y-5">
        <AssignmentDetailsCard assignment={assignment} onEdit={() => router.push(`/assignments/${assignment.id}/edit`)} />
        <AssignmentQuickActions assignment={assignment} submissions={submissions} actions={QUICK_ACTIONS} onTabChange={onTabChange} />
        <InsightsCard insights={insights} />
      </div>
    </motion.div>
  );
}

export default AnalyticsTab;
