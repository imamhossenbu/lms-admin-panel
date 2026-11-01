"use client";

import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { dailyAverageScore } from "@/lib/assignmentStats";
import type { AssignmentSubmission } from "@/types/assignment";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import type { TrendRange } from "./useAnalyticsFilters";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
];

export interface ScoreTrendCardProps {
  submissions: AssignmentSubmission[];
  totalPoints: number;
  range: TrendRange;
  onRangeChange: (range: TrendRange) => void;
}

/** Average % score per day (graded work); days without grades are skipped (line connects across them). */
export function ScoreTrendCard({ submissions, totalPoints, range, onRangeChange }: ScoreTrendCardProps) {
  const data = useMemo(() => dailyAverageScore(submissions, totalPoints, range), [submissions, totalPoints, range]);
  const hasData = data.some((d) => d.avgPct !== null);

  return (
    <IconSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Average Score Trend"
      description="Average score (%) by submission day"
      action={<AppSelect size="sm" value={String(range)} onValueChange={(v) => onRangeChange(Number(v) as TrendRange)} options={RANGE_OPTIONS} />}
    >
      {!hasData ? (
        <ChartEmpty title="No scores in this period" message="Try a longer range, or grade some submissions first." />
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="score-trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={CHART.blue} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} interval="preserveStartEnd" minTickGap={16} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return <ChartTooltip title={row.label}>{row.avgPct === null ? "No graded work" : `Average score: ${row.avgPct}%`}</ChartTooltip>;
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPct"
                connectNulls
                stroke={CHART.blue}
                strokeWidth={2}
                fill="url(#score-trend-fill)"
                dot={{ r: 4, fill: CHART.blue, stroke: "white", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: CHART.blue, stroke: "white", strokeWidth: 2 }}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default ScoreTrendCard;
