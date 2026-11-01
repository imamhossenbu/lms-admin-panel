"use client";

import React from "react";
import { Filter } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { RateBar } from "./RateBar";
import type { DeliveryStats } from "./BroadcastStatCards";

/** Delivered → Opened → Clicked as horizontal bars (width = share of all messages sent). */
export function DeliveryFunnelCard({ stats }: { stats: DeliveryStats }) {
  const share = (n: number) => (stats.total ? Math.round((n / stats.total) * 1000) / 10 : 0);
  const steps = [
    { label: "Delivered", count: stats.delivered, rate: stats.deliveryRate, of: "of sent", fill: "bg-green" },
    { label: "Opened", count: stats.opened, rate: stats.openRate, of: "of delivered", fill: "bg-brand-orange" },
    { label: "Clicked", count: stats.clicked, rate: stats.clickRate, of: "of opened", fill: "bg-purple" },
  ];
  return (
    <IconSectionCard icon={<Filter className="h-5 w-5" />} tone="green" title="Delivery funnel" description={`${stats.total.toLocaleString()} messages sent`}>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.label} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="body-sm-medium text-primary-500">{s.label}</span>
              <span className="whitespace-nowrap body-xsm-regular text-primary-300">
                <span className="body-sm-medium font-semibold! text-primary-500 tabular-nums">{s.count.toLocaleString()}</span> · {s.rate}% {s.of}
              </span>
            </div>
            <RateBar value={share(s.count)} fillClassName={s.fill} className="h-2.5" />
          </div>
        ))}
        {stats.failed > 0 && (
          <p className="body-xsm-regular text-red">
            {stats.failed.toLocaleString()} {stats.failed === 1 ? "message" : "messages"} failed to deliver.
          </p>
        )}
      </div>
    </IconSectionCard>
  );
}

export default DeliveryFunnelCard;
