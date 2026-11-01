"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { dailyPerformance } from "@/lib/quizStats";
import { AXIS_TICK, CHART, ChartEmpty, ChartTooltip } from "../../common/chart";
import { LegendDot } from "../../common/LegendDot";
import { RANGE_OPTIONS, useUrlChoice } from "../../hooks/useUrlChoice";

/** Grouped bars per day: Average Score vs Total Attempts; range synced to `?range=` (7 / 30 days). */
export function PerformanceOverviewCard({ attempts }: { attempts: QuizAttempt[] }) {
  const [range, setRange] = useUrlChoice("range", RANGE_OPTIONS, "30");
  const data = useMemo(() => dailyPerformance(attempts, Number(range)), [attempts, range]);
  const hasData = data.some((d) => d.attempts > 0);

  return (
    <IconSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Performance Overview"
      action={<AppSelect size="sm" value={range} onValueChange={setRange} options={[...RANGE_OPTIONS]} />}
      bodyClassName="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
        <LegendDot colorClass="bg-blue" label="Average Score" />
        <LegendDot colorClass="bg-blue/30" label="Total Attempts" />
      </div>
      {!hasData ? (
        <ChartEmpty title="No attempts in this period" message="Daily scores and attempts appear once students take this quiz." />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barGap={3} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={16} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: "var(--color-gray-bg)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip title={row.label}>
                      <p>Average score: {row.avgScore ?? "—"}</p>
                      <p>Attempts: {row.attempts}</p>
                    </ChartTooltip>
                  );
                }}
              />
              <Bar dataKey="avgScore" name="Average Score" fill={CHART.blue} radius={[3, 3, 0, 0]} maxBarSize={12} animationDuration={600} />
              <Bar dataKey="attempts" name="Total Attempts" fill={CHART.blue} fillOpacity={0.3} radius={[3, 3, 0, 0]} maxBarSize={12} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default PerformanceOverviewCard;
