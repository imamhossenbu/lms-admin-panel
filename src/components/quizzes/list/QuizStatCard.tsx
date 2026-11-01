"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface QuizStatCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-blue-14 text-blue". */
  iconClassName: string;
  label: string;
  value: number;
  pill: { text: React.ReactNode; tone: Tone };
  caption: string;
  index: number;
}

/** Stat tile: tinted icon, label, big value + percentage pill, caption. */
export function QuizStatCard({ icon, iconClassName, label, value, pill, caption, index }: QuizStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.04 }}
      className="dashboard-card shadow-2xs flex items-start gap-4 p-4 transition-shadow hover:shadow-md"
    >
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", iconClassName)}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate body-sm-regular text-primary-400">{label}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="heading-h4 font-bold! leading-tight text-primary-500 tabular-nums">{value.toLocaleString()}</p>
          <ToneBadge tone={pill.tone} size="sm">
            {pill.text}
          </ToneBadge>
        </div>
        <p className="mt-1 truncate body-xsm-regular text-primary-300">{caption}</p>
      </div>
    </motion.div>
  );
}

export default QuizStatCard;
