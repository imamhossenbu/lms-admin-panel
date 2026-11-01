"use client";

import React from "react";
import { Activity, CircleHelp, Flag, MessageSquareText, MessagesSquare } from "lucide-react";
import type { communityStats } from "@/lib/communityStats";
import { CommunityStatCard } from "./CommunityStatCard";

export type CommunityStats = ReturnType<typeof communityStats>;

/** Total / Active This Week / Replies This Week / Unanswered / Needs Moderation — all derived via communityStats. */
export function CommunityStatsRow({ stats }: { stats: CommunityStats }) {
  const tiles = [
    { label: "Total Discussions", value: stats.total, icon: <MessagesSquare className="h-5 w-5" />, iconClassName: "bg-blue-14 text-blue", caption: "Across all courses" },
    { label: "Active This Week", value: stats.activeThisWeek, delta: stats.activeDelta, icon: <Activity className="h-5 w-5" />, iconClassName: "bg-green-bg text-green", caption: "vs previous 7 days" },
    { label: "Replies This Week", value: stats.repliesThisWeek, delta: stats.repliesDelta, icon: <MessageSquareText className="h-5 w-5" />, iconClassName: "bg-purple-14 text-purple", caption: "vs previous 7 days" },
    {
      label: "Unanswered Questions",
      value: stats.unanswered,
      icon: <CircleHelp className="h-5 w-5" />,
      iconClassName: "bg-brand-orange-light text-brand-orange",
      valueClassName: stats.unanswered ? "text-brand-orange" : undefined,
      caption: "Questions with no reply yet",
    },
    {
      label: "Needs Moderation",
      value: stats.openReports,
      icon: <Flag className="h-5 w-5" />,
      iconClassName: "bg-red-14 text-red",
      valueClassName: stats.openReports ? "text-red" : undefined,
      caption: `Open reports on ${stats.flagged} discussion${stats.flagged === 1 ? "" : "s"}`,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {tiles.map((t, i) => (
        <CommunityStatCard key={t.label} index={i} {...t} />
      ))}
    </div>
  );
}

export default CommunityStatsRow;
