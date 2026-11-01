"use client";

import React, { useMemo } from "react";
import { CalendarClock, FilePen, MailOpen, MousePointerClick, Send, Users } from "lucide-react";
import type { Broadcast, BroadcastDelivery } from "@/types/notification";
import { broadcastOverview } from "@/lib/notificationStats";
import { BroadcastStatTile } from "./BroadcastStatTile";

export interface BroadcastsOverviewProps {
  broadcasts: Broadcast[];
  deliveries: BroadcastDelivery[];
}

/** Sent (30 days) · Scheduled · Drafts · Avg. open rate · Avg. click rate · People reached. */
export function BroadcastsOverview({ broadcasts, deliveries }: BroadcastsOverviewProps) {
  const o = useMemo(() => broadcastOverview(broadcasts, deliveries), [broadcasts, deliveries]);
  const tiles = [
    { label: "Sent (30 days)", value: o.sentLast30, caption: "Broadcasts delivered", icon: <Send className="h-5 w-5" />, iconClassName: "bg-green-bg text-green" },
    { label: "Scheduled", value: o.scheduled, caption: "Waiting to send", icon: <CalendarClock className="h-5 w-5" />, iconClassName: "bg-blue-14 text-blue" },
    { label: "Drafts", value: o.drafts, caption: "Not sent yet", icon: <FilePen className="h-5 w-5" />, iconClassName: "bg-gray-bg text-primary-400" },
    { label: "Avg. open rate", value: `${o.avgOpenRate}%`, caption: "Of delivered, last 30 days", icon: <MailOpen className="h-5 w-5" />, iconClassName: "bg-brand-orange-light text-brand-orange" },
    { label: "Avg. click rate", value: `${o.avgClickRate}%`, caption: "Of opened, last 30 days", icon: <MousePointerClick className="h-5 w-5" />, iconClassName: "bg-purple-14 text-purple" },
    { label: "People reached", value: o.reached.toLocaleString(), caption: "Unique recipients, 30 days", icon: <Users className="h-5 w-5" />, iconClassName: "bg-yellow-bg text-yellow" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
      {tiles.map((t, i) => (
        <BroadcastStatTile key={t.label} index={i} {...t} />
      ))}
    </div>
  );
}

export default BroadcastsOverview;
