"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";

export interface InsightsCardProps {
  title: string;
  insights: string[];
  className?: string;
}

/** Yellow "Tips & Insights" / "Key Insights" box with computed bullet points (quizInsights). */
export function InsightsCard({ title, insights, className }: InsightsCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("rounded-xl border border-yellow/20 bg-yellow-bg p-5", className)}
    >
      <h3 className="flex items-center gap-2.5 body-md-medium font-semibold! text-primary-500">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-14 text-yellow">
          <Lightbulb className="h-5 w-5" />
        </span>
        {title}
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 body-sm-regular text-primary-400 marker:text-yellow">
        {insights.map((text, i) => (
          <motion.li key={text} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
            {text}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

export default InsightsCard;
