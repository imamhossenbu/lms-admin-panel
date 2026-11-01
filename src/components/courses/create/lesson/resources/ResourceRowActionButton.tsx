"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface ResourceRowActionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  label: string;
  tone?: "neutral" | "danger";
  children: React.ReactNode;
}

/** Small square icon button used in resource rows (download, edit, delete, more). */
export const ResourceRowActionButton = React.forwardRef<HTMLButtonElement, ResourceRowActionButtonProps>(
  ({ label, tone = "neutral", className, children, type = "button", ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors [&>svg]:h-4 [&>svg]:w-4",
        tone === "danger" ? "text-red hover:bg-red-14" : "text-primary-400 hover:bg-slate-100 hover:text-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

ResourceRowActionButton.displayName = "ResourceRowActionButton";
export default ResourceRowActionButton;
