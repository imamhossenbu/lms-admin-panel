"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type StatTileTone = "purple" | "green" | "orange" | "red" | "blue";

const TONE: Record<StatTileTone, string> = {
  purple: "bg-purple-14 text-purple",
  green: "bg-green-bg text-green",
  orange: "bg-brand-orange-light text-brand-orange",
  red: "bg-red-14 text-red",
  blue: "bg-blue-14 text-blue",
};

export interface AssignmentStatTileProps {
  icon: React.ReactNode;
  tone: StatTileTone;
  value: number | string;
  label: string;
  /** Optional caption under the label, e.g. "87.5%". */
  caption?: string;
  index?: number;
}

/** Icon tile + big value + label (+ %), as in the Assignment Details stat row. */
export function AssignmentStatTile({ icon, tone, value, label, caption, index = 0 }: AssignmentStatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      className="dashboard-card shadow-2xs flex items-center gap-4 p-5"
    >
      <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", TONE[tone])}>{icon}</span>
      <div className="min-w-0">
        <p className="heading-h4 font-bold! text-primary-500 leading-tight">{value}</p>
        <p className="body-sm-regular text-primary-300 truncate">{label}</p>
        {caption && <p className="body-xsm-regular text-primary-300">{caption}</p>}
      </div>
    </motion.div>
  );
}

export default AssignmentStatTile;
