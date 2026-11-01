"use client";

import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { dailyPerformance, totalMarksOf } from "@/lib/quizStats";
import { AXIS_TICK, CHART, ChartEmpty, ChartTooltip } from "../../common/chart";
import { RANGE_OPTIONS, useUrlChoice } from "../../hooks/useUrlChoice";

/** Daily average score line (days without completed attempts are skipped); range synced to `?trange`. */
export function ScoreTrendCard({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const [range, setRange] = useUrlChoice("trange", RANGE_OPTIONS, "30");
  const data = useMemo(() => dailyPerformance(attempts, Number(range)).filter((d) => d.avgScore !== null), [attempts, range]);
  const total = totalMarksOf(quiz);

  return (
    <IconSectionCard
      icon={<TrendingUp className="h-5 w-5" />}
      title="Average Score Trend"
      className="h-full"
      action={<AppSelect size="sm" value={range} onValueChange={setRange} options={[...RANGE_OPTIONS]} />}
    >
      {data.length === 0 ? (
        <ChartEmpty title="No scores in this period" message="The trend appears once students complete this quiz." />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="quizScoreTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={CHART.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={16} />
              <YAxis domain={[0, total || "auto"]} allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip title={row.label}>
                      <p>
                        Average: {row.avgScore}/{total}
                      </p>
                      <p>Attempts: {row.attempts}</p>
                    </ChartTooltip>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="avgScore"
                stroke={CHART.blue}
                strokeWidth={2}
                fill="url(#quizScoreTrendFill)"
                dot={{ r: 3.5, fill: "white", stroke: CHART.blue, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
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
