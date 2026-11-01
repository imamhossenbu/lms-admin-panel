"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

export interface QuestionIconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  label: string;
  tone?: "neutral" | "danger";
  /** Bordered square (nav arrows) vs. bare icon (row actions). */
  bordered?: boolean;
  children: React.ReactNode;
}

/** Small square icon button (delete question / option, previous / next question). */
export function QuestionIconButton({ label, tone = "neutral", bordered, className, children, type = "button", ...props }: QuestionIconButtonProps) {
  return (
    <motion.button
      type={type}
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",
        bordered && "border border-dash bg-white shadow-2xs",
        tone === "danger" ? "text-primary-300 hover:bg-red-14 hover:text-red" : "text-primary-400 hover:bg-gray-bg hover:text-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default QuestionIconButton;
