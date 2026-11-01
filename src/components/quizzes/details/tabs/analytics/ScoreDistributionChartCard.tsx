"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileBarChart } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { scoreDistribution, totalMarksOf } from "@/lib/quizStats";
import { AXIS_TICK, CHART, ChartEmpty, ChartTooltip } from "../../common/chart";

/** Histogram of completed-attempt scores in mark bands, counts on top of each bar. */
export function ScoreDistributionChartCard({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const total = totalMarksOf(quiz);
  const data = useMemo(() => scoreDistribution(attempts, total), [attempts, total]);
  const count = data.reduce((s, d) => s + d.count, 0);

  return (
    <IconSectionCard icon={<FileBarChart className="h-5 w-5" />} title="Score Distribution" className="h-full">
      {count === 0 ? (
        <ChartEmpty title="No completed attempts" message="Scores appear here once students finish this quiz." />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 4, left: -24, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} interval={0} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: "var(--color-gray-bg)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip title={`${row.label} marks`}>
                      {row.count} student{row.count === 1 ? "" : "s"} ({Math.round((row.count / count) * 100)}%)
                    </ChartTooltip>
                  );
                }}
              />
              <Bar dataKey="count" fill={CHART.blue} radius={[4, 4, 0, 0]} maxBarSize={48} animationDuration={600}>
                <LabelList dataKey="count" position="top" fill="var(--color-primary-500)" fontSize={12} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default ScoreDistributionChartCard;
