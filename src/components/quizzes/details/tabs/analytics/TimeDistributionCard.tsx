"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Timer } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { timeDistribution } from "@/lib/quizStats";
import { AXIS_TICK, CHART, ChartEmpty, ChartTooltip } from "../../common/chart";

/** Completed attempts bucketed by duration (< 5 / 5–10 / 10–20 / 20–30 / > 30 min). */
export function TimeDistributionCard({ attempts }: { attempts: QuizAttempt[] }) {
  const data = useMemo(() => timeDistribution(attempts), [attempts]);
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <IconSectionCard icon={<Timer className="h-5 w-5" />} title="Time Spent Distribution" className="h-full">
      {total === 0 ? (
        <ChartEmpty title="No completed attempts" message="Durations appear here once students finish this quiz." />
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 4, left: -24, bottom: 0 }} barCategoryGap="24%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} interval={0} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: "var(--color-gray-bg)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip title={row.label}>
                      {row.count} attempt{row.count === 1 ? "" : "s"} ({Math.round((row.count / total) * 100)}%)
                    </ChartTooltip>
                  );
                }}
              />
              <Bar dataKey="count" fill={CHART.blue} radius={[4, 4, 0, 0]} maxBarSize={64} animationDuration={600}>
                <LabelList dataKey="count" position="top" fill="var(--color-primary-500)" fontSize={12} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default TimeDistributionCard;
