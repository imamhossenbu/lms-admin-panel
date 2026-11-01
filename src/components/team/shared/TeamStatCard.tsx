"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface TeamStatCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-green-bg text-green". */
  iconClassName: string;
  label: string;
  value: React.ReactNode;
  pill?: { text: React.ReactNode; tone: Tone };
  caption: string;
  index: number;
  /** Draws attention (e.g. 2FA required but not everyone has it). */
  highlight?: "warning" | "danger";
}

/** Stat tile: tinted icon, label, big value + optional pill, caption. */
export function TeamStatCard({ icon, iconClassName, label, value, pill, caption, index, highlight }: TeamStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.04 }}
      className={cn(
        "@container dashboard-card shadow-2xs p-4 transition-shadow hover:shadow-md",
        highlight === "danger" && "border-red/40 bg-red-14",
        highlight === "warning" && "border-yellow/40 bg-yellow-bg"
      )}
    >
      <div className="flex items-start gap-3 @3xs:gap-4">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl @3xs:h-12 @3xs:w-12", iconClassName)}>{icon}</span>
        <div className="min-w-0">
          <p className="truncate body-sm-regular text-primary-400" title={label}>
            {label}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="heading-h4 font-bold! leading-tight text-primary-500 tabular-nums">{value}</p>
            {pill && (
              <ToneBadge tone={pill.tone} size="sm">
                {pill.text}
              </ToneBadge>
            )}
          </div>
          <p className="mt-1 truncate body-xsm-regular text-primary-300" title={caption}>
            {caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default TeamStatCard;
