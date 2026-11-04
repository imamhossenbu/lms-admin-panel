"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, MailOpen, MousePointerClick, Users } from "lucide-react";
import type { DeliveryStats as ApiDeliveryStats } from "@/lib/notificationStorage";
import { BroadcastStatTile } from "./BroadcastStatTile";

export type DeliveryStats = ApiDeliveryStats;

/** Recipients · Delivered + rate · Opened + rate · Clicked + rate · Failed (sent broadcasts). */
export function BroadcastStatCards({ stats, channelCount }: { stats: DeliveryStats; channelCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <BroadcastStatTile
        index={0}
        icon={<Users className="h-5 w-5" />}
        iconClassName="bg-blue-14 text-blue"
        label="Recipients"
        value={stats.recipients.toLocaleString()}
        caption={`${stats.total.toLocaleString()} messages · ${channelCount} ${channelCount === 1 ? "channel" : "channels"}`}
      />
      <BroadcastStatTile
        index={1}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconClassName="bg-green-bg text-green"
        label="Delivered"
        value={stats.delivered.toLocaleString()}
        pill={{ text: `${stats.deliveryRate}%`, tone: "green" }}
        caption="Of all messages sent"
      />
      <BroadcastStatTile
        index={2}
        icon={<MailOpen className="h-5 w-5" />}
        iconClassName="bg-brand-orange-light text-brand-orange"
        label="Opened"
        value={stats.opened.toLocaleString()}
        pill={{ text: `${stats.openRate}%`, tone: "orange" }}
        caption="Of delivered messages"
      />
      <BroadcastStatTile
        index={3}
        icon={<MousePointerClick className="h-5 w-5" />}
        iconClassName="bg-purple-14 text-purple"
        label="Clicked"
        value={stats.clicked.toLocaleString()}
        pill={{ text: `${stats.clickRate}%`, tone: "purple" }}
        caption="Of opened messages"
      />
      <BroadcastStatTile
        index={4}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconClassName="bg-red-14 text-red"
        label="Failed"
        value={stats.failed.toLocaleString()}
        pill={stats.failed ? { text: `${Math.round((100 - stats.deliveryRate) * 10) / 10}%`, tone: "red" } : undefined}
        caption={stats.failed ? "See Recipients below" : "No delivery failures"}
      />
    </div>
  );
}

export default BroadcastStatCards;
