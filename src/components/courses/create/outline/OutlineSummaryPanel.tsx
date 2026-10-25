import React from "react";
import type { OutlineStats } from "../aiOutline";
import { LessonTypesUsedCard } from "./LessonTypesUsedCard";
import { OutlineNextStepsCard } from "./OutlineNextStepsCard";
import { OutlineProTip } from "./OutlineProTip";
import { OutlineSummaryCard } from "./OutlineSummaryCard";

export interface OutlineSummaryPanelProps {
  stats: OutlineStats;
  durationWeeks: number;
}

/** Right column of the review modal. */
export function OutlineSummaryPanel({ stats, durationWeeks }: OutlineSummaryPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <OutlineSummaryCard stats={stats} durationWeeks={durationWeeks} />
      <LessonTypesUsedCard byType={stats.byType} />
      <OutlineNextStepsCard />
      <OutlineProTip />
    </div>
  );
}

export default OutlineSummaryPanel;
