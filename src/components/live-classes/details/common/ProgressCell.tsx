"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/** Thin progress track + % label (watch progress of the session). */
export function ProgressCell({ value, muted }: { value: number; muted?: boolean }) {
  if (muted) return <span className="text-primary-300">-</span>;
  return (
    <div className="flex min-w-36 items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={cn("h-full rounded-full", value >= 90 ? "bg-green" : value > 50 ? "bg-blue" : "bg-yellow")}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="w-10 shrink-0 text-right body-xsm-medium text-primary-400">{value}%</span>
    </div>
  );
}

export default ProgressCell;
