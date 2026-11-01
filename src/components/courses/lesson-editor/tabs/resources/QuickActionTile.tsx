"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface QuickActionTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  tone?: "blue" | "red";
  active?: boolean;
  disabled?: boolean;
}

/** Clickable tile in "Quick Actions" (icon + title + helper). */
export function QuickActionTile({ icon, title, description, onClick, tone = "blue", active, disabled }: QuickActionTileProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -2 }}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        active ? "border-blue bg-blue-14" : "border-dash bg-white hover:bg-gray-bg"
      )}
    >
      <span className={cn("mt-0.5 shrink-0", tone === "red" ? "text-red" : "text-blue")}>{icon}</span>
      <span className="min-w-0">
        <span className={cn("block body-sm-medium", tone === "red" ? "text-red" : "text-primary-500")}>{title}</span>
        <span className="mt-0.5 block body-xsm-regular text-primary-300">{description}</span>
      </span>
    </motion.button>
  );
}

export default QuickActionTile;
