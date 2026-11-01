"use client";

import React, { useMemo } from "react";
import { BarChart3, Check, CircleAlert, FileText, X } from "lucide-react";
import type { AssignmentSubmission } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { dailySubmissions, submissionStats } from "@/lib/assignmentStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { StatChip } from "./StatChip";
import { DailySubmissionsChart } from "./DailySubmissionsChart";

const RANGE_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
];

/** Graded / Pending / Late / Total chips + daily submissions bar chart; range synced to `?range=`. */
export function SubmissionStatisticsCard({ submissions }: { submissions: AssignmentSubmission[] }) {
  const { get, set } = useUrlParams();
  const rawRange = get("range", "7");
  const range = RANGE_OPTIONS.some((o) => o.value === rawRange) ? rawRange : "7";
  const days = Number(range);

  const inRange = useMemo(() => {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - (days - 1));
    return submissions.filter((s) => new Date(s.submittedAt).getTime() >= from.getTime());
  }, [submissions, days]);
  const stats = submissionStats(inRange);
  const chartData = useMemo(() => dailySubmissions(submissions, days), [submissions, days]);

  return (
    <IconSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Submission Statistics"
      action={
        <AppSelect
          size="sm"
          value={range}
          onValueChange={(v) => set({ range: v === "7" ? null : v })}
          options={RANGE_OPTIONS}
        />
      }
      className="h-full"
      bodyClassName="@container space-y-5"
    >
      <div className="grid grid-cols-2 gap-2.5 @lg:grid-cols-4">
        <StatChip tone="green" icon={<Check className="h-4 w-4" />} value={stats.graded} label="Graded" />
        <StatChip tone="orange" icon={<CircleAlert className="h-4 w-4" />} value={stats.pending} label="Pending" />
        <StatChip tone="red" icon={<X className="h-4 w-4" />} value={stats.late} label="Late" />
        <StatChip tone="blue" icon={<FileText className="h-4 w-4" />} value={stats.total} label="Total" />
      </div>
      <DailySubmissionsChart data={chartData} />
    </IconSectionCard>
  );
}

export default SubmissionStatisticsCard;
