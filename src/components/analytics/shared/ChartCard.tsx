"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ChartCardProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Right side of the header (toggle, legend, link button). */
  action?: React.ReactNode;
  /** Row under the header (legend, mini stats). */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Stagger index for the entry animation. */
  index?: number;
}

/**
 * White report card used by every Analytics widget. It is a size container (`@container`), so children
 * adapt to the card's own width with `@md:` / `@lg:` variants instead of the viewport.
 */
export function ChartCard({ title, subtitle, action, toolbar, children, className, index = 0 }: ChartCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.05, ease: "easeOut" }}
      className={cn("@container min-w-0 bg-white rounded-xl border border-dash p-5 shadow-xs flex flex-col", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0 text-left">
          <h3 className="heading-h5 font-semibold! text-primary-500 truncate">{title}</h3>
          {subtitle && <p className="body-sm-regular text-primary-300 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </header>
      {toolbar && <div className="mb-3">{toolbar}</div>}
      <div className="flex-1 min-w-0">{children}</div>
    </motion.section>
  );
}

export default ChartCard;
