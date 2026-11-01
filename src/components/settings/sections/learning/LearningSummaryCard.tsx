"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { cn } from "@/lib/cn";
import { learningSummary, type SummaryTone } from "./learningUtils";

const DOT: Record<SummaryTone, string> = {
  green: "bg-green",
  blue: "bg-blue",
  orange: "bg-brand-orange",
  purple: "bg-purple",
  yellow: "bg-yellow",
};

/** "What this means" — plain-language sentences generated from the current values. */
export function LearningSummaryCard() {
  const { control } = useFormContext<LearningSettings>();
  const v = useWatch({ control }) as Partial<LearningSettings>;
  const lines = learningSummary(v);

  return (
    <IconSectionCard icon={<BookOpenCheck className="h-5 w-5" />} title="What this means" description="How students will experience these settings." tone="green">
      <ul className="space-y-3" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {lines.map((line) => (
            <motion.li
              key={`${line.id}-${line.text}`}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-start gap-2.5"
            >
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", DOT[line.tone])} />
              <span className="body-sm-regular text-primary-400">{line.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </IconSectionCard>
  );
}

export default LearningSummaryCard;
