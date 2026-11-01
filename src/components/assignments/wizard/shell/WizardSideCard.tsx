"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface WizardSideCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Compact right-column card: icon tile + title (+ action), then body. */
export function WizardSideCard({ icon, title, action, children, className }: WizardSideCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      className={cn("dashboard-card shadow-2xs p-4", className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dash bg-blue-14 text-blue">{icon}</span>
        <h3 className="min-w-0 flex-1 body-md-medium font-semibold! text-primary-500">{title}</h3>
        {action}
      </header>
      <div className="mt-3">{children}</div>
    </motion.section>
  );
}

export default WizardSideCard;
