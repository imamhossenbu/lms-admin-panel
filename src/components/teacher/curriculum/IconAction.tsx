"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/** Small square icon button for row actions (edit, rename, delete). */
export function IconAction({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dash bg-white text-primary-400", danger ? "hover:border-red hover:text-red" : "hover:border-primary-300 hover:text-primary-500")}
    >
      {children}
    </motion.button>
  );
}

export default IconAction;
