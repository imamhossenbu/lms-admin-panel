"use client";

import React, { useMemo } from "react";
import { CircleX, Clock, PlayCircle, Users, Video } from "lucide-react";
import type { LiveClassListItem } from "@/lib/liveClassStorage";
import { liveListStats } from "@/lib/liveClassStats";
import { TrendStatCard, type TrendStatCardProps } from "@/components/ui/TrendStatCard";

export interface LiveClassStatsRowProps {
  classes: LiveClassListItem[];
  now: Date;
}

const trendOf = (change: number | null): TrendStatCardProps["trend"] =>
  change === null ? undefined : { direction: change >= 0 ? "up" : "down", value: `${Math.abs(change)}%`, caption: "vs previous 30 days" };

/** Total Classes / Total Attendees / Completed / Upcoming / Cancelled — all derived via liveListStats. */
export function LiveClassStatsRow({ classes, now }: LiveClassStatsRowProps) {
  const stats = useMemo(() => liveListStats(classes, now), [classes, now]);
  const cards: TrendStatCardProps[] = [
    { label: "Total Classes", value: stats.total.toLocaleString(), icon: <Video />, iconClassName: "bg-blue-14 text-blue", trend: trendOf(stats.change.total) },
    { label: "Total Attendees", value: stats.attendees.toLocaleString(), icon: <Users />, iconClassName: "bg-green-bg text-green", trend: trendOf(stats.change.attendees) },
    { label: "Completed Classes", value: stats.completed.toLocaleString(), icon: <PlayCircle />, iconClassName: "bg-purple-14 text-purple", trend: trendOf(stats.change.completed) },
    { label: "Upcoming Classes", value: stats.upcoming.toLocaleString(), icon: <Clock />, iconClassName: "bg-brand-orange-light text-brand-orange" },
    { label: "Cancelled Classes", value: stats.cancelled.toLocaleString(), icon: <CircleX />, iconClassName: "bg-red-14 text-red", trend: trendOf(stats.change.cancelled) },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <TrendStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default LiveClassStatsRow;
