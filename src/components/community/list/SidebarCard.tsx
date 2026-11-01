"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SidebarCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-red-14 text-red". */
  iconClassName: string;
  title: string;
  /** Right side of the header (count badge, action button). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  className?: string;
}

/** Right-column card shell: icon tile + title + optional header aside, then content. */
export function SidebarCard({ icon, iconClassName, title, aside, children, index = 0, className }: SidebarCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 + index * 0.05 }}
      className={cn("@container dashboard-card shadow-2xs p-4", className)}
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

export default SidebarCard;
