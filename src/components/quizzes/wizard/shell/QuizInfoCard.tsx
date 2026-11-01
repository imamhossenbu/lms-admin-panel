"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const TONE = {
  blue: { box: "bg-blue-14 border-blue/20", icon: "text-blue", title: "text-primary-500" },
  yellow: { box: "bg-yellow-bg border-yellow/20", icon: "text-yellow", title: "text-primary-500" },
} as const;

export interface QuizInfoCardProps {
  icon: React.ReactNode;
  title: string;
  tone?: keyof typeof TONE;
  children: React.ReactNode;
  className?: string;
}

/** Tinted side note ("Quiz Creation Guide", "Ready to Publish?", "Important Notes"). */
export function QuizInfoCard({ icon, title, tone = "blue", children, className }: QuizInfoCardProps) {
  const t = TONE[tone];
  return (
    <motion.aside
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      className={cn("flex items-start gap-3 rounded-xl border p-4", t.box, className)}
    >
      <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center", t.icon)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("body-sm-medium font-semibold!", t.title)}>{title}</p>
        <div className="mt-1.5 body-sm-regular text-primary-400">{children}</div>
      </div>
    </motion.aside>
  );
}

/** Bulleted list for info cards. */
export function QuizBulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default QuizInfoCard;
