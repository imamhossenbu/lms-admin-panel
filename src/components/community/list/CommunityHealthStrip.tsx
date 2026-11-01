"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircleCheck, Clock3, Flag } from "lucide-react";

export interface CommunityHealthStripProps {
  answerRate: number;
  /** Median hours to the first staff reply (null = no staff replies on questions yet). */
  medianHours: number | null;
  openReports: number;
}

const fmtHours = (h: number) => (h < 1 ? `${Math.max(1, Math.round(h * 60))} min` : `${h} h`);

/** Slim strip under the stat cards: answer rate · median first staff response · open reports. */
export function CommunityHealthStrip({ answerRate, medianHours, openReports }: CommunityHealthStripProps) {
  const items = [
    { key: "rate", icon: <CircleCheck className="h-4 w-4 text-green" />, label: "Answer rate", value: `${answerRate}%` },
    { key: "median", icon: <Clock3 className="h-4 w-4 text-blue" />, label: "Median first staff response", value: medianHours === null ? "No staff replies yet" : fmtHours(medianHours) },
    { key: "reports", icon: <Flag className="h-4 w-4 text-red" />, label: "Open reports", value: openReports.toLocaleString() },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.2 }}
      className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-dash bg-white px-4 py-2.5 shadow-2xs"
    >
      {items.map((it, i) => (
        <React.Fragment key={it.key}>
          {i > 0 && <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />}
          <span className="inline-flex items-center gap-2 whitespace-nowrap body-sm-regular text-primary-400">
            {it.icon}
            {it.label}
            <span className="body-sm-medium font-semibold! text-primary-500 tabular-nums">{it.value}</span>
          </span>
        </React.Fragment>
      ))}
    </motion.div>
  );
}

export default CommunityHealthStrip;
