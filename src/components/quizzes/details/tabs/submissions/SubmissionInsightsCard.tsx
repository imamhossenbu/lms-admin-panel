"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, CircleCheck, CircleX, Users } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { attemptMetrics } from "@/lib/quizStats";
import { cn } from "@/lib/cn";
import { MeterBar, type MeterTone } from "../../common/MeterBar";
import { withinDays } from "../../quizFormat";
import { INSIGHT_RANGE_OPTIONS, useUrlChoice } from "../../hooks/useUrlChoice";

const TILE: Record<MeterTone, string> = {
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  red: "bg-red-14 text-red",
  yellow: "bg-yellow-bg text-yellow",
  orange: "bg-brand-orange-light text-brand-orange",
};

function InsightRow({ icon: Icon, tone, value, label, pct, index }: { icon: typeof Users; tone: MeterTone; value: number; label: string; pct: number; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="grid grid-cols-1 items-center gap-2 @xs:grid-cols-2 @xs:gap-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TILE[tone])}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <p className="body-medium font-semibold! text-primary-500 leading-tight">{value}</p>
          <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{label}</p>
        </div>
      </div>
      <MeterBar value={pct} tone={tone} className="h-2" label={label} />
    </motion.li>
  );
}

/** Total / Passed / Failed counts with rate bars for a selectable period (`?irange`). */
export function SubmissionInsightsCard({ attempts }: { attempts: QuizAttempt[] }) {
  const [range, setRange] = useUrlChoice("irange", INSIGHT_RANGE_OPTIONS, "30");
  const m = attemptMetrics(withinDays(attempts, range === "all" ? null : Number(range)));
  return (
    <IconSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Submission Insights"
      action={<AppSelect size="sm" value={range} onValueChange={setRange} options={[...INSIGHT_RANGE_OPTIONS]} />}
      bodyClassName="@container"
    >
      {m.total === 0 ? (
        <p className="rounded-xl border border-dashed border-dash p-5 text-center body-sm-regular text-primary-300">No submissions in this period.</p>
      ) : (
        <ul className="space-y-4">
          <InsightRow index={0} icon={Users} tone="blue" value={m.total} label="Total Submissions" pct={100} />
          <InsightRow index={1} icon={CircleCheck} tone="green" value={m.passed} label={`Passed (${m.passRate}%)`} pct={m.passRate} />
          <InsightRow index={2} icon={CircleX} tone="red" value={m.failed} label={`Failed (${m.failRate}%)`} pct={m.failRate} />
        </ul>
      )}
    </IconSectionCard>
  );
}

export default SubmissionInsightsCard;
