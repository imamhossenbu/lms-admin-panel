"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type LiveStatTone = "blue" | "green" | "orange" | "purple" | "red";

const TILE: Record<LiveStatTone, string> = {
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  orange: "bg-brand-orange-light text-brand-orange",
  purple: "bg-purple-14 text-purple",
  red: "bg-red-14 text-red",
};
const PCT: Record<LiveStatTone, string> = {
  blue: "text-blue",
  green: "text-green",
  orange: "text-red",
  purple: "text-red",
  red: "text-red",
};

export interface LiveStatTileProps {
  icon: React.ReactNode;
  tone: LiveStatTone;
  value: React.ReactNode;
  label: string;
  /** Optional % shown top-right, e.g. "80%". */
  percent?: string;
  index?: number;
  /** Compact padding for the 2×2 sidebar grid. */
  compact?: boolean;
}

/** Icon tile + big value + label, with an optional % in the corner (Students / Attendance / Class Statistics). */
export function LiveStatTile({ icon, tone, value, label, percent, index = 0, compact }: LiveStatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      className={cn("@container relative flex min-w-0 items-center rounded-xl border border-dash bg-white shadow-2xs", compact ? "gap-3 p-3.5" : "gap-4 p-4 sm:p-5")}
    >
      <span className={cn("flex shrink-0 items-center justify-center rounded-xl", compact ? "h-11 w-11" : "h-13 w-13", TILE[tone])}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("font-bold! text-primary-500", compact ? "body-l-medium" : "heading-h5")}>{value}</p>
        <p className="body-sm-regular text-primary-300 truncate">{label}</p>
        {percent && <p className={cn("body-xsm-medium font-semibold! @3xs:hidden", PCT[tone])}>{percent}</p>}
      </div>
      {percent && <span className={cn("hidden self-start body-sm-medium font-semibold! @3xs:inline", PCT[tone])}>{percent}</span>}
    </motion.div>
  );
}

export default LiveStatTile;
