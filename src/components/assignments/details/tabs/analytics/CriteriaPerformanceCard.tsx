"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChartHorizontal } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { criteriaPerformance } from "@/lib/assignmentStats";
import type { AssignmentRubric, AssignmentSubmission } from "@/types/assignment";
import { CRITERIA_COLORS } from "@/components/ui/charts/chartTheme";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import type { CriteriaFilter } from "./useAnalyticsFilters";

/** Criteria at or above this % count as "strong". */
export const CRITERIA_TARGET_PCT = 80;

const FILTER_OPTIONS = [
  { value: "all", label: "All Criteria" },
  { value: "below", label: `Below ${CRITERIA_TARGET_PCT}%` },
  { value: "above", label: `${CRITERIA_TARGET_PCT}% and above` },
];

export interface CriteriaPerformanceCardProps {
  submissions: AssignmentSubmission[];
  rubric: AssignmentRubric;
  filter: CriteriaFilter;
  onFilterChange: (f: CriteriaFilter) => void;
}

/** Horizontal bars: average % per rubric criterion with "avg / max" points. */
export function CriteriaPerformanceCard({ submissions, rubric, filter, onFilterChange }: CriteriaPerformanceCardProps) {
  const all = useMemo(() => criteriaPerformance(submissions, rubric), [submissions, rubric]);
  const rows = all
    .map((c, i) => ({ ...c, color: CRITERIA_COLORS[i % CRITERIA_COLORS.length] }))
    .filter((c) => (filter === "all" ? true : filter === "below" ? c.pct < CRITERIA_TARGET_PCT : c.pct >= CRITERIA_TARGET_PCT));
  const hasScores = submissions.some((s) => s.status === "GRADED" && Object.keys(s.criterionScores).length > 0);

  return (
    <IconSectionCard
      icon={<BarChartHorizontal className="h-5 w-5" />}
      title="Performance by Criteria"
      action={all.length > 0 && <AppSelect size="sm" value={filter} onValueChange={(v) => onFilterChange(v as CriteriaFilter)} options={FILTER_OPTIONS} />}
    >
      {all.length === 0 ? (
        <ChartEmpty title="No rubric criteria" message="Add a rubric in the Rubric tab to see performance per criterion." />
      ) : !hasScores ? (
        <ChartEmpty title="No rubric scores yet" message="Criterion averages appear once submissions are graded with the rubric." />
      ) : rows.length === 0 ? (
        <ChartEmpty title="No matching criteria" message="No criteria match this filter. Choose All Criteria to see every one." />
      ) : (
        <ul className="space-y-4">
          {rows.map((c, i) => (
            <li key={c.id} className="grid grid-cols-12 items-center gap-3" title={`${c.title}: ${c.avg} of ${c.max} points on average`}>
              <span className="col-span-12 truncate body-sm-regular text-primary-400 sm:col-span-4">{c.title}</span>
              <div className="col-span-7 h-2.5 overflow-hidden rounded-full bg-gray-bg sm:col-span-5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, c.pct)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                />
              </div>
              <span className="col-span-2 text-right body-sm-medium text-primary-500 tabular-nums sm:col-span-1">{c.pct}%</span>
              <span className="col-span-3 text-right body-xsm-regular text-primary-300 tabular-nums sm:col-span-2">
                {c.avg} / {c.max}
              </span>
            </li>
          ))}
        </ul>
      )}
    </IconSectionCard>
  );
}

export default CriteriaPerformanceCard;
