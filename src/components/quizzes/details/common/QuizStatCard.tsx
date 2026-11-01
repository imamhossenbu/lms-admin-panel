"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { TrendPill } from "./TrendPill";
import { MeterBar, type MeterTone } from "./MeterBar";

export type QuizStatTone = "blue" | "green" | "orange" | "red" | "purple" | "yellow";

const TONE: Record<QuizStatTone, string> = {
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  orange: "bg-brand-orange-light text-brand-orange",
  red: "bg-red-14 text-red",
  purple: "bg-purple-14 text-purple",
  yellow: "bg-yellow-bg text-yellow",
};

export interface QuizStatCardProps {
  /** Lucide icon component, sized by the card. */
  icon: React.ElementType<{ className?: string }>;
  tone: QuizStatTone;
  label: string;
  value: React.ReactNode;
  /** % change vs previous period (trendVsPrevious); null hides the pill. */
  trend?: number | null;
  /** Small line under the value, e.g. "vs previous 30 days" or "97 passed out of 124". */
  caption?: string;
  /** Optional rate bar under the caption. */
  meter?: { value: number; tone: MeterTone };
  index?: number;
}

/**
 * KPI card (icon tile + label + value + trend pill + caption). A container-query card: the icon tile
 * shrinks and the trend/caption wrap cleanly when the card is narrow, so nothing truncates.
 */
export function QuizStatCard({ icon: Icon, tone, label, value, trend = null, caption, meter, index = 0 }: QuizStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      className="@container dashboard-card shadow-2xs h-full p-4"
    >
      <div className="flex items-start gap-3 @3xs:gap-4">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl @3xs:h-14 @3xs:w-14 @3xs:rounded-2xl", TONE[tone])}>
          <Icon className="h-5 w-5 @3xs:h-7 @3xs:w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-sm-regular text-primary-300">{label}</p>
          <p className="mt-0.5 heading-h4 font-bold! text-primary-500 whitespace-nowrap">{value}</p>
          {(trend !== null || caption) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <TrendPill value={trend} />
              {caption && <span className="body-xsm-regular text-primary-300">{caption}</span>}
            </div>
          )}
          {meter && <MeterBar value={meter.value} tone={meter.tone} className="mt-2" label={label} />}
        </div>
      </div>
    </motion.div>
  );
}

export default QuizStatCard;
