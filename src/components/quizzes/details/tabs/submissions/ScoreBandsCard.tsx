"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { PieChart as PieIcon } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { percentBands } from "@/lib/quizStats";
import { cn } from "@/lib/cn";
import { CHART, ChartEmpty, ChartTooltip } from "../../common/chart";

const BAND_STYLE: Record<string, { fill: string; opacity: number; dot: string }> = {
  excellent: { fill: CHART.green, opacity: 1, dot: "bg-green" },
  good: { fill: CHART.green, opacity: 0.4, dot: "bg-green/40" },
  fair: { fill: CHART.yellow, opacity: 1, dot: "bg-yellow" },
  low: { fill: CHART.red, opacity: 1, dot: "bg-red" },
};

/** Donut of completed attempts by percentage band (90–100 / 70–89 / 50–69 / 0–49) + legend. */
export function ScoreBandsCard({ attempts }: { attempts: QuizAttempt[] }) {
  const bands = percentBands(attempts);
  const total = bands.reduce((s, b) => s + b.count, 0);
  const slices = bands.filter((b) => b.count > 0);

  return (
    <IconSectionCard icon={<PieIcon className="h-5 w-5" />} title="Score Distribution" tone="green" bodyClassName="@container">
      {total === 0 ? (
        <ChartEmpty title="No completed attempts" message="The score breakdown appears once students finish this quiz." />
      ) : (
        <div className="flex flex-col items-center gap-5 @xs:flex-row">
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="count" nameKey="label" innerRadius={50} outerRadius={74} startAngle={90} endAngle={-270} stroke="white" strokeWidth={2} animationDuration={700}>
                  {slices.map((b) => (
                    <Cell key={b.key} fill={BAND_STYLE[b.key].fill} fillOpacity={BAND_STYLE[b.key].opacity} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const b = payload[0].payload as (typeof bands)[number];
                    return (
                      <ChartTooltip title={`${b.label}%`}>
                        {b.count} attempt{b.count === 1 ? "" : "s"} ({b.pct}%)
                      </ChartTooltip>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="heading-h4 font-bold! text-primary-500">{total}</span>
              <span className="body-2xsm-regular text-primary-300">Completed</span>
            </div>
          </div>
          <ul className="w-full min-w-0 flex-1 space-y-3">
            {bands.map((b, i) => (
              <motion.li
                key={b.key}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2.5 body-sm-regular text-primary-400 whitespace-nowrap">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", BAND_STYLE[b.key].dot)} />
                  {b.label}%
                </span>
                <span className="body-sm-medium text-primary-500 tabular-nums whitespace-nowrap">
                  {b.count} ({b.pct}%)
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </IconSectionCard>
  );
}

export default ScoreBandsCard;
