"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChartNoAxesColumn } from "lucide-react";
import type { ThreadCategory } from "@/types/community";
import { cn } from "@/lib/cn";
import { CATEGORY_VIEW, THREAD_CATEGORIES } from "../shared/CategoryBadge";
import { SidebarCard } from "./SidebarCard";
import { CATEGORY_BAR_CLASS } from "./communityListUtils";

export interface CategoryBreakdownCardProps {
  counts: Record<ThreadCategory, number>;
  activeCategory: string;
  onSelect: (category: ThreadCategory | null) => void;
  index?: number;
}

/** Mini horizontal bar list from categoryCounts; clicking a row filters by that category. */
export function CategoryBreakdownCard({ counts, activeCategory, onSelect, index }: CategoryBreakdownCardProps) {
  const total = THREAD_CATEGORIES.reduce((s, c) => s + counts[c], 0);
  const max = Math.max(1, ...THREAD_CATEGORIES.map((c) => counts[c]));
  return (
    <SidebarCard index={index} icon={<ChartNoAxesColumn className="h-4 w-4" />} iconClassName="bg-blue-14 text-blue" title="By Category">
      <ul className="flex flex-col gap-1">
        {THREAD_CATEGORIES.map((c, i) => {
          const view = CATEGORY_VIEW[c];
          const Icon = view.icon;
          const pct = total ? Math.round((counts[c] / total) * 100) : 0;
          const isActive = activeCategory === c;
          return (
            <li key={c}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(isActive ? null : c)}
                aria-pressed={isActive}
                className={cn("w-full cursor-pointer rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50", isActive && "bg-slate-50")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 body-sm-regular", isActive ? "text-primary-500 font-semibold!" : "text-primary-400")}>
                    <Icon className="h-3.5 w-3.5 text-primary-300" />
                    {view.label}
                  </span>
                  <span className="body-xsm-regular text-primary-300 tabular-nums">
                    <span className="body-sm-medium font-semibold! text-primary-500">{counts[c]}</span> · {pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-bg">
                  <motion.div
                    className={cn("h-full rounded-full", CATEGORY_BAR_CLASS[c])}
                    initial={{ width: 0 }}
                    animate={{ width: `${(counts[c] / max) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + i * 0.05 }}
                  />
                </div>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </SidebarCard>
  );
}

export default CategoryBreakdownCard;
