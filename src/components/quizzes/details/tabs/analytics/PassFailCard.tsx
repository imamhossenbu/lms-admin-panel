"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { attemptMetrics } from "@/lib/quizStats";
import { cn } from "@/lib/cn";
import { CHART, ChartEmpty, ChartTooltip } from "../../common/chart";

/** Donut of passed vs failed submissions with a count + % legend. */
export function PassFailCard({ attempts }: { attempts: QuizAttempt[] }) {
  const m = attemptMetrics(attempts);
  const slices = [
    { key: "passed", name: "Passed", value: m.passed, pct: m.passRate, color: CHART.green, dot: "bg-green" },
    { key: "failed", name: "Failed", value: m.failed, pct: m.failRate, color: CHART.red, dot: "bg-red" },
  ];

  return (
    <IconSectionCard icon={<UserCheck className="h-5 w-5" />} title="Pass vs Fail" className="h-full" bodyClassName="@container">
      {m.total === 0 ? (
        <ChartEmpty title="No submissions yet" message="The pass / fail split appears once students take this quiz." />
      ) : (
        <div className="flex flex-col items-center gap-5 @xs:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices.filter((s) => s.value > 0)} dataKey="value" innerRadius={56} outerRadius={80} startAngle={90} endAngle={-270} stroke="white" strokeWidth={2} animationDuration={700}>
                  {slices
                    .filter((s) => s.value > 0)
                    .map((s) => (
                      <Cell key={s.key} fill={s.color} />
                    ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const s = payload[0].payload as (typeof slices)[number];
                    return (
                      <ChartTooltip title={s.name}>
                        {s.value} submission{s.value === 1 ? "" : "s"} ({s.pct}%)
                      </ChartTooltip>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="heading-h4 font-bold! text-primary-500">{m.total}</span>
              <span className="body-2xsm-regular text-primary-300">Submissions</span>
            </div>
          </div>
          <ul className="w-full min-w-0 flex-1 space-y-4">
            {slices.map((s, i) => (
              <motion.li key={s.key} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }} className="flex items-start gap-2.5">
                <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm", s.dot)} />
                <div>
                  <p className="body-sm-regular text-primary-400">{s.name}</p>
                  <p className="body-sm-medium font-semibold! text-primary-500 whitespace-nowrap">
                    {s.value} ({s.pct}%)
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </IconSectionCard>
  );
}

export default PassFailCard;
