"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SettingsActionButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

/** White outlined button with blue label, used next to settings controls. */
export function SettingsActionButton({ icon, children, onClick, active, className }: SettingsActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border bg-white px-4 body-sm-medium text-blue shadow-2xs transition-colors cursor-pointer hover:bg-blue-14 [&>svg]:h-4 [&>svg]:w-4",
        active ? "border-blue" : "border-dash",
        className
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export default SettingsActionButton;
