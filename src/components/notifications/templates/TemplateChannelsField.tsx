"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { NotificationChannel } from "@/types/notification";
import { CHANNEL_LABEL } from "@/lib/notificationStats";
import { cn } from "@/lib/cn";
import { CHANNEL_ICON } from "../shared/ChannelBadges";

const OPTIONS: { value: NotificationChannel; description: string }[] = [
  { value: "IN_APP", description: "Bell & inbox in the student app" },
  { value: "EMAIL", description: "Sent to the student's email" },
  { value: "PUSH", description: "Mobile push notification" },
];

export interface TemplateChannelsFieldProps {
  value: NotificationChannel[];
  onChange: (next: NotificationChannel[]) => void;
  error?: string;
}

/** Multi-select checkbox cards: In-app / Email / Push. */
export function TemplateChannelsField({ value, onChange, error }: TemplateChannelsFieldProps) {
  const toggle = (c: NotificationChannel) => onChange(value.includes(c) ? value.filter((x) => x !== c) : [...value, c]);
  return (
    <div className="@container">
      <div role="group" aria-label="Channels" className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
        {OPTIONS.map((o) => {
          const checked = value.includes(o.value);
          const Icon = CHANNEL_ICON[o.value];
          return (
            <motion.button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={checked}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => toggle(o.value)}
              className={cn(
                "flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                checked ? "border-brand-orange bg-brand-orange-light" : error ? "border-red bg-white" : "border-dash bg-white hover:border-primary-300"
              )}
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", checked ? "bg-white text-brand-orange" : "bg-gray-bg text-primary-400")}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block body-sm-medium font-semibold!", checked ? "text-brand-orange" : "text-primary-500")}>{CHANNEL_LABEL[o.value]}</span>
                <span className="mt-0.5 block body-xsm-regular text-primary-300">{o.description}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors",
                  checked ? "border-brand-orange bg-brand-orange text-white" : "border-dash bg-white"
                )}
              >
                {checked && <Check className="h-3 w-3" />}
              </span>
            </motion.button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default TemplateChannelsField;
