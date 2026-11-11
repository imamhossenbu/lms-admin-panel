"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

/** Up / down reorder arrows (disabled at the ends or while a save is running). */
export function MoveButtons({ label, first, last, busy, onMove }: { label: string; first: boolean; last: boolean; busy?: boolean; onMove: (dir: -1 | 1) => void }) {
  const btn = "flex h-7 w-7 items-center justify-center rounded-md border border-dash bg-white text-primary-400 hover:border-primary-300 hover:text-primary-500 disabled:opacity-40 disabled:hover:border-dash";
  return (
    <div className="flex shrink-0 gap-1">
      <motion.button type="button" whileTap={{ scale: 0.92 }} className={btn} disabled={first || busy} onClick={() => onMove(-1)} aria-label={`Move ${label} up`}>
        <ChevronUp className="h-4 w-4" />
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.92 }} className={btn} disabled={last || busy} onClick={() => onMove(1)} aria-label={`Move ${label} down`}>
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export default MoveButtons;
