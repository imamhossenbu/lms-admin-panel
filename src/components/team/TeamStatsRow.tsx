"use client";

import React from "react";
import { Activity, MailPlus, ShieldCheck, Users } from "lucide-react";
import type { TeamStats } from "@/lib/teamStats";
import { TeamStatCard } from "./shared/TeamStatCard";
import { plural } from "./shared/teamFormat";

/** Members / Active in 24h / Pending invites / 2FA coverage (highlighted when Settings require 2FA and coverage < 100%). */
export function TeamStatsRow({ stats, require2fa }: { stats: TeamStats; require2fa: boolean }) {
  const gap = require2fa && stats.twoFaCoverage < 100;
  const tiles = [
    {
      label: "Team members",
      value: stats.members,
      icon: <Users className="h-5 w-5" />,
      iconClassName: "bg-brand-orange-light text-brand-orange",
      caption: stats.suspended ? `${stats.active} active · ${stats.suspended} suspended` : `${stats.active} active`,
    },
    {
      label: "Active in last 24h",
      value: stats.activeLast24h,
      icon: <Activity className="h-5 w-5" />,
      iconClassName: "bg-green-bg text-green",
      pill: stats.activeNow ? { text: `${stats.activeNow} online`, tone: "green" as const } : undefined,
      caption: `of ${plural(stats.active, "active member")}`,
    },
    {
      label: "Pending invites",
      value: stats.pendingInvites,
      icon: <MailPlus className="h-5 w-5" />,
      iconClassName: "bg-blue-14 text-blue",
      pill: stats.expiredInvites ? { text: `${stats.expiredInvites} expired`, tone: "red" as const } : undefined,
      caption: stats.pendingInvites ? "Waiting to be accepted" : "No one is waiting",
    },
    {
      label: "2FA coverage",
      value: `${stats.twoFaCoverage}%`,
      icon: <ShieldCheck className="h-5 w-5" />,
      iconClassName: gap ? "bg-red-14 text-red" : "bg-purple-14 text-purple",
      pill: require2fa ? { text: "Required", tone: gap ? ("red" as const) : ("green" as const) } : undefined,
      caption: `${stats.twoFaEnabled} of ${stats.active} active members`,
      highlight: gap ? ("danger" as const) : undefined,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((t, i) => (
        <TeamStatCard key={t.label} index={i} {...t} />
      ))}
    </div>
  );
}

export default TeamStatsRow;
