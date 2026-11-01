"use client";

import React, { useMemo } from "react";
import type { QuizTabProps } from "../../quizTabTypes";
import { QuizTabLayout } from "../../QuizTabLayout";
import { useUrlParams } from "@/lib/useUrlParams";
import { ActivityTimelineCard } from "./ActivityTimelineCard";
import { ActivitySummaryCard } from "./ActivitySummaryCard";
import { ACTIVITY_KINDS, ACTIVITY_META } from "./activityMeta";

/** Activity Log: filterable (`?akind`) timeline + summary card. */
export function ActivityLogTab({ quiz, activity }: QuizTabProps) {
  const { get, set } = useUrlParams();
  const raw = get("akind", "All");
  const kind = raw === "All" || (ACTIVITY_KINDS as string[]).includes(raw) ? raw : "All";

  const sorted = useMemo(() => [...activity].sort((a, b) => b.at.localeCompare(a.at)), [activity]);
  const items = useMemo(() => (kind === "All" ? sorted : sorted.filter((a) => a.kind === kind)), [sorted, kind]);
  const kindOptions = useMemo(
    () => [{ value: "All", label: "All Activity" }, ...ACTIVITY_KINDS.filter((k) => activity.some((a) => a.kind === k) || k === kind).map((k) => ({ value: k, label: ACTIVITY_META[k].label }))],
    [activity, kind]
  );

  return (
    <QuizTabLayout
      main={<ActivityTimelineCard items={items} kind={kind} kindOptions={kindOptions} onKindChange={(v) => set({ akind: v })} />}
      sidebar={<ActivitySummaryCard quiz={quiz} activity={activity} />}
    />
  );
}

export default ActivityLogTab;
