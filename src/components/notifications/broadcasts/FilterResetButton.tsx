"use client";

import React from "react";
import { motion } from "framer-motion";

/** "Reset" text button at the end of a filter bar (disabled when nothing is filtered). */
export function FilterResetButton({ active, onReset }: { active: boolean; onReset: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={active ? { scale: 0.96 } : undefined}
      onClick={onReset}
      disabled={!active}
      className="h-10 shrink-0 cursor-pointer rounded-lg border border-dash bg-white px-5 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Reset
    </motion.button>
  );
}

export default FilterResetButton;
