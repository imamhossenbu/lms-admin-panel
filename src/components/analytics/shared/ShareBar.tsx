"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ShareBarProps {
  /** 0–100 */
  value: number;
  /** Text after the bar, e.g. "42.5%". */
  label?: string;
  barClassName?: string;
}

/** Thin animated progress track used for "share" / completion columns. */
export function ShareBar({ value, label, barClassName = "bg-brand-orange" }: ShareBarProps) {
  const width = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-1.5 flex-1 min-w-0 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", barClassName)}
        />
      </div>
      {label && <span className="body-xsm-medium text-primary-400 w-11 text-right shrink-0">{label}</span>}
    </div>
  );
}

export default ShareBar;
