"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileBarChart } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { scoreHistogram } from "@/lib/assignmentStats";
import type { AssignmentSubmission } from "@/types/assignment";
import { AXIS_TICK, CHART, HISTOGRAM_COLORS } from "@/components/ui/charts/chartTheme";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import type { ScoreScope } from "./useAnalyticsFilters";

const SCOPE_OPTIONS = [
  { value: "all", label: "All Submissions" },
  { value: "ontime", label: "On-time" },
  { value: "late", label: "Late" },
];

export interface ScoreDistributionCardProps {
  submissions: AssignmentSubmission[];
  totalPoints: number;
  scope: ScoreScope;
  onScopeChange: (scope: ScoreScope) => void;
}

/** Histogram of graded scores in point ranges, filterable by on-time / late. */
export function ScoreDistributionCard({ submissions, totalPoints, scope, onScopeChange }: ScoreDistributionCardProps) {
  const data = useMemo(() => {
    const rows = scope === "all" ? submissions : submissions.filter((s) => (scope === "late" ? s.isLate : !s.isLate));
    return scoreHistogram(rows, totalPoints);
  }, [submissions, totalPoints, scope]);
  const graded = data.reduce((s, d) => s + d.count, 0);

  return (
    <IconSectionCard
      icon={<FileBarChart className="h-5 w-5" />}
      title="Score Distribution"
      description={`${graded} graded submission${graded === 1 ? "" : "s"}`}
      action={<AppSelect size="sm" value={scope} onValueChange={(v) => onScopeChange(v as ScoreScope)} options={SCOPE_OPTIONS} />}
    >
      {graded === 0 ? (
        <ChartEmpty title="No graded scores" message="Scores appear here once submissions in this group are graded." />
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 4, left: -24, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: "var(--color-gray-bg)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip title={`${row.label} points`}>
                      {row.count} student{row.count === 1 ? "" : "s"} ({Math.round((row.count / graded) * 100)}%)
                    </ChartTooltip>
                  );
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56} animationDuration={600}>
                {data.map((d, i) => (
                  <Cell key={d.label} fill={HISTOGRAM_COLORS[i % HISTOGRAM_COLORS.length]} />
                ))}
                <LabelList dataKey="count" position="top" fill="var(--color-primary-500)" fontSize={12} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default ScoreDistributionCard;
