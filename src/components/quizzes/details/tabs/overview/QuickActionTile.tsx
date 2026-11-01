"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface QuickActionTileProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

/** One bordered action tile in the Quick Actions grid (blue, or red for destructive actions). */
export function QuickActionTile({ icon: Icon, label, onClick, danger, disabled }: QuickActionTileProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 body-sm-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        danger ? "border-red/30 bg-red-14 text-red hover:border-red" : "border-dash bg-white text-blue hover:bg-blue-14"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </motion.button>
  );
}

export default QuickActionTile;
