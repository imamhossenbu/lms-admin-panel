"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface CommunityStatCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-blue-14 text-blue". */
  iconClassName: string;
  label: string;
  value: number;
  /** % change vs the previous 7 days (pill hidden when null / undefined). */
  delta?: number | null;
  caption: string;
  /** Token class for the value, e.g. "text-brand-orange" (defaults to primary text). */
  valueClassName?: string;
  index: number;
}

/** Stat tile: tinted icon, label, big value (+ optional week-over-week delta pill), caption. */
export function CommunityStatCard({ icon, iconClassName, label, value, delta, caption, valueClassName, index }: CommunityStatCardProps) {
  const hasDelta = typeof delta === "number";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.04 }}
      className="dashboard-card shadow-2xs flex items-start gap-3.5 p-4 transition-shadow hover:shadow-md"
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconClassName)}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate body-sm-regular text-primary-400" title={label}>
          {label}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className={cn("heading-h4 font-bold! leading-tight tabular-nums", valueClassName ?? "text-primary-500")}>{value.toLocaleString()}</p>
          {hasDelta && (
            <ToneBadge tone={delta > 0 ? "green" : delta < 0 ? "red" : "gray"} size="sm" icon={delta > 0 ? <ArrowUp className="h-3 w-3" /> : delta < 0 ? <ArrowDown className="h-3 w-3" /> : undefined}>
              {Math.abs(delta)}%
            </ToneBadge>
          )}
        </div>
        <p className="mt-1 truncate body-xsm-regular text-primary-300" title={caption}>
          {caption}
        </p>
      </div>
    </motion.div>
  );
}

export default CommunityStatCard;
