"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface LiveTabCardProps {
  title: React.ReactNode;
  subtitle?: string;
  /** Right side of the header (buttons, filters …). */
  action?: React.ReactNode;
  /** "main" = large tab card, "side" = compact right-column card. */
  variant?: "main" | "side";
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** White bordered card with title / subtitle / header action, used by every Live Class details tab. */
export function LiveTabCard({ title, subtitle, action, variant = "main", children, className, bodyClassName }: LiveTabCardProps) {
  const main = variant === "main";
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("dashboard-card shadow-2xs", main ? "p-5" : "p-4.5", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("text-primary-500", main ? "heading-h5 font-semibold!" : "title-sm")}>{title}</h3>
          {subtitle && <p className="mt-1 body-sm-regular text-primary-300">{subtitle}</p>}
        </div>
        {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
      </header>
      {children !== undefined && <div className={cn(main ? "mt-5" : "mt-4", bodyClassName)}>{children}</div>}
    </motion.section>
  );
}

export default LiveTabCard;
