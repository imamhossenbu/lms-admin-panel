"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const TONE = {
  blue: "border-dash text-blue hover:bg-blue-14",
  red: "border-red text-red hover:bg-red-14",
  neutral: "border-dash text-primary-400 hover:bg-gray-bg",
} as const;

export interface EditorIconButtonProps {
  label: string;
  /** Sized icon, e.g. <Pencil className="h-4 w-4" />. */
  icon: React.ReactNode;
  onClick: () => void;
  tone?: keyof typeof TONE;
  disabled?: boolean;
  className?: string;
}

/** Square icon-only action (edit / delete / move) used in tab rows and tables. */
export function EditorIconButton({ label, icon, onClick, tone = "blue", disabled, className }: EditorIconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        TONE[tone],
        className
      )}
    >
      {icon}
    </motion.button>
  );
}

export default EditorIconButton;
