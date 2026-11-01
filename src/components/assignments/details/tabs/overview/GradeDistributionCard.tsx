"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart as PieIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { AssignmentSubmission } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { gradeDistribution } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";

const BUCKET_COLOR: Record<string, { fill: string; dot: string }> = {
  A: { fill: "var(--color-green)", dot: "bg-green" },
  B: { fill: "var(--color-blue)", dot: "bg-blue" },
  C: { fill: "var(--color-yellow)", dot: "bg-yellow" },
  D: { fill: "var(--color-brand-orange)", dot: "bg-brand-orange" },
  F: { fill: "var(--color-red)", dot: "bg-red" },
};

export interface GradeDistributionCardProps {
  submissions: AssignmentSubmission[];
  totalPoints: number;
}

/** Letter-grade donut (graded submissions) with a count + % legend. */
export function GradeDistributionCard({
  submissions,
  totalPoints,
}: GradeDistributionCardProps) {
  const buckets = useMemo(
    () => gradeDistribution(submissions, totalPoints),
    [submissions, totalPoints],
  );
  const graded = buckets.reduce((sum, b) => sum + b.count, 0);
  const chartData = graded
    ? buckets.filter((b) => b.count > 0)
    : [{ key: "none", label: "None", count: 1 }];

  return (
    <IconSectionCard
      icon={<PieIcon className="h-5 w-5" />}
      title="Grade Distribution"
      tone="purple"
      className="h-full"
    >
      <div className="@container">
        <div className="flex flex-col items-center gap-5 @md:flex-row @md:gap-6">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={52}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  paddingAngle={graded ? 2 : 0}
                >
                  {chartData.map((b) => (
                    <Cell
                      key={b.key}
                      fill={BUCKET_COLOR[b.key]?.fill ?? "var(--color-gray-bg)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="heading-h4 font-bold! text-primary-500 leading-none">
                {graded}
              </span>
              <span className="mt-1 body-xsm-regular text-primary-300">
                Graded
              </span>
            </div>
          </div>
          <ul className="w-full min-w-0 flex-1 space-y-2.5">
            {buckets.map((b, i) => (
              <motion.li
                key={b.key}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-center gap-2.5 body-sm-regular"
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    BUCKET_COLOR[b.key].dot,
                  )}
                />
                <span className="whitespace-nowrap text-primary-400">
                  {b.label}
                </span>
                <span className="ml-auto whitespace-nowrap text-primary-500">
                  {b.count} ({b.pct}%)
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default GradeDistributionCard;
