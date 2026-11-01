"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SettingsSubCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  index?: number;
}

/** Bordered sub-section inside "Quiz Settings" (General Settings, Attempts & Availability …). */
export function SettingsSubCard({ icon, title, children, className, index = 0 }: SettingsSubCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      className={cn("rounded-xl border border-dash bg-white p-4", className)}
    >
      <header className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">{icon}</span>
        <h4 className="body-medium font-semibold! text-primary-500">{title}</h4>
      </header>
      {children}
    </motion.section>
  );
}

export default SettingsSubCard;
