"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface InsightCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-blue-14 text-blue". */
  iconClassName: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  className?: string;
}

/** Insight card shell under the issued table: icon tile + title + optional aside, then content. */
export function InsightCard({ icon, iconClassName, title, aside, children, index = 0, className }: InsightCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 + index * 0.05 }}
      className={cn("@container dashboard-card shadow-2xs flex flex-col p-4", className)}
    >
      <header className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconClassName)}>{icon}</span>
          <h2 className="truncate body-medium font-semibold! text-primary-500">{title}</h2>
        </div>
        {aside}
      </header>
      {children}
    </motion.section>
  );
}

export default InsightCard;
