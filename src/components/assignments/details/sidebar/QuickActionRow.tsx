"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface QuickActionRowProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

/** One link-style row in the Quick Actions card. */
export function QuickActionRow({ icon: Icon, label, onClick, danger, disabled }: QuickActionRowProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left body-sm-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        danger ? "text-red hover:bg-red-14" : "text-blue hover:bg-blue-14"
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span className="truncate">{label}</span>
    </motion.button>
  );
}

export default QuickActionRow;
