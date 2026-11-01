"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface RateBarProps {
  /** 0–100. */
  value: number;
  /** Fill token class, e.g. "bg-blue". */
  fillClassName?: string;
  className?: string;
}

/** Slim animated progress track. */
export function RateBar({ value, fillClassName = "bg-blue", className }: RateBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%`;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-gray-bg", className)}>
      <motion.div initial={{ width: 0 }} animate={{ width }} transition={{ duration: 0.5, ease: "easeOut" }} className={cn("h-full rounded-full", fillClassName)} />
    </div>
  );
}

export default RateBar;
