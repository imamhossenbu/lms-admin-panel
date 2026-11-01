"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { submissionStats } from "@/lib/assignmentStats";
import type { AssignmentSubmission } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { CHART } from "@/components/ui/charts/chartTheme";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";

/** Donut of Graded vs Pending Review (late shown in the legend — it overlaps both). */
export function SubmissionStatusCard({ submissions }: { submissions: AssignmentSubmission[] }) {
  const s = submissionStats(submissions);
  const slices = [
    { key: "graded", name: "Graded", value: s.graded, color: CHART.green },
    { key: "pending", name: "Pending Review", value: s.pending, color: CHART.orange },
  ];
  const legend = [
    { name: "Graded", value: s.graded, pct: s.gradedPct, dot: "bg-green" },
    { name: "Pending Review", value: s.pending, pct: s.pendingPct, dot: "bg-brand-orange" },
    { name: "Late", value: s.late, pct: s.latePct, dot: "bg-red" },
  ];

  return (
    <IconSectionCard icon={<Settings2 className="h-5 w-5" />} title="Submission Status">
      {s.total === 0 ? (
        <ChartEmpty title="No submissions yet" message="The status breakdown appears once students start submitting." />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices.filter((d) => d.value > 0)} dataKey="value" innerRadius={58} outerRadius={80} startAngle={90} endAngle={-270} stroke="white" strokeWidth={2} animationDuration={700}>
                  {slices
                    .filter((d) => d.value > 0)
                    .map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as (typeof slices)[number];
                    return <ChartTooltip title={row.name}>{row.value} submission{row.value === 1 ? "" : "s"}</ChartTooltip>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="heading-h4 font-bold! text-primary-500">{s.total}</span>
              <span className="body-2xsm-regular text-primary-300">Submissions</span>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-3.5">
            {legend.map((l, i) => (
              <motion.li
                key={l.name}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2.5 body-sm-regular text-primary-400">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", l.dot)} />
                  {l.name}
                </span>
                <span className="body-sm-medium text-primary-500 tabular-nums">
                  {l.value} ({l.pct}%)
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </IconSectionCard>
  );
}

export default SubmissionStatusCard;
