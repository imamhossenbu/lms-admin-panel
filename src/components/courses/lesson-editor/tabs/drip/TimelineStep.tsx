"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type TimelineMarker = "done" | "active" | "target";

export interface TimelineStepProps {
  marker: TimelineMarker;
  title: string;
  detail?: string;
  /** Right-aligned label ("Day 0"). */
  aside?: string;
  isLast?: boolean;
  children?: React.ReactNode;
}

function Marker({ marker }: { marker: TimelineMarker }) {
  if (marker === "done") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white", marker === "active" ? "border-blue" : "border-brand-orange")}>
      <span className={cn("h-2.5 w-2.5 rounded-full", marker === "active" ? "bg-blue" : "bg-brand-orange")} />
    </span>
  );
}

/** One node of the "Schedule Preview" vertical timeline. */
export function TimelineStep({ marker, title, detail, aside, isLast, children }: TimelineStepProps) {
  return (
    <motion.li layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }} className="relative flex gap-3.5">
      <div className="flex flex-col items-center">
        <Marker marker={marker} />
        {!isLast && <span className="my-1 w-0.5 flex-1 rounded-full bg-slate-200" />}
      </div>
      <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
        <div className="flex items-start justify-between gap-3">
          <p className="body-sm-medium text-primary-500">{title}</p>
          {aside && <span className="shrink-0 whitespace-nowrap body-xsm-regular text-primary-300">{aside}</span>}
        </div>
        {detail && <p className="mt-0.5 body-xsm-regular text-primary-300">{detail}</p>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </motion.li>
  );
}

export default TimelineStep;
