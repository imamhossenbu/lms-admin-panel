"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import type { BroadcastDetail } from "@/lib/notificationStorage";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChannelBadges } from "@/components/notifications/shared/ChannelBadges";
import { RateBar } from "./RateBar";

type ChannelStats = BroadcastDetail["byChannel"][number];

function Metric({ label, rate, fill }: { label: string; rate: number; fill: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 body-xsm-regular text-primary-300">
        <span>{label}</span>
        <span className="text-primary-500 tabular-nums">{rate}%</span>
      </div>
      <RateBar value={rate} fillClassName={fill} />
    </div>
  );
}

/** One card per channel: delivered count + delivery / open / click rates. */
export function ChannelBreakdownCard({ channels }: { channels: ChannelStats[] }) {
  return (
    <IconSectionCard icon={<Radio className="h-5 w-5" />} tone="purple" title="By channel" description="How each channel performed">
      <div className="@container">
        <div className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3">
          {channels.map((c, i) => (
            <motion.div
              key={c.channel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="space-y-3 rounded-xl border border-dash p-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <ChannelBadges channels={[c.channel]} />
                <span className="whitespace-nowrap body-xsm-regular text-primary-300">
                  <span className="body-sm-medium font-semibold! text-primary-500 tabular-nums">{c.delivered.toLocaleString()}</span> delivered
                </span>
              </div>
              <Metric label="Delivery rate" rate={c.deliveryRate} fill="bg-green" />
              <Metric label="Open rate" rate={c.openRate} fill="bg-brand-orange" />
              <Metric label="Click rate" rate={c.clickRate} fill="bg-purple" />
              <p className={c.failed ? "body-xsm-regular text-red" : "body-xsm-regular text-primary-300"}>{c.failed ? `${c.failed} failed` : "No failures"}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default ChannelBreakdownCard;
