"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface OutlineIconButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone?: "neutral" | "danger";
  disabled?: boolean;
  className?: string;
}

/** Compact square icon action (edit / delete / expand) used across outline rows. */
export function OutlineIconButton({ label, icon, onClick, tone = "neutral", disabled, className }: OutlineIconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger" ? "text-red hover:bg-red-14" : "text-primary-400 hover:bg-slate-100 hover:text-primary-500",
        className
      )}
    >
      {icon}
    </motion.button>
  );
}

export default OutlineIconButton;
