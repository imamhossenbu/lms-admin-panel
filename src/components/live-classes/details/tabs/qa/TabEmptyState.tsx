"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface TabEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Centered icon + title + description (+ optional action) for empty tab sections. */
export function TabEmptyState({ icon, title, description, action, className }: TabEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-dash px-6 py-10 text-center", className)}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-bg text-primary-300">{icon}</span>
      <p className="mt-3 body-md-medium font-semibold! text-primary-500">{title}</p>
      {description && <p className="mt-1 max-w-sm body-sm-regular text-primary-300">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

export default TabEmptyState;
