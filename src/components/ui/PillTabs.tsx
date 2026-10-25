"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ToneBadge } from "./ToneBadge";

export interface PillTabItem<K extends string = string> {
  id: K;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface PillTabsProps<K extends string = string> {
  tabs: PillTabItem<K>[];
  activeId?: K;
  /** Alias of `activeId`, kept for existing call sites. */
  activeTab?: K;
  onChange: (id: K) => void;
  className?: string;
}

/**
 * The app-wide tab bar: grey track with a sliding white pill on the active tab,
 * optional leading icons and count badges. Used on every details page and filter tab row.
 */
export function PillTabs<K extends string = string>({
  tabs,
  activeId,
  activeTab,
  onChange,
  className,
}: PillTabsProps<K>) {
  // Unique per instance so two tab bars on one page don't animate into each other
  const layoutId = useId();
  const currentActive = activeId ?? activeTab ?? tabs[0]?.id;

  return (
    <div className={cn("overflow-x-auto scrollbar-none max-w-full", className)}>
      <div role="tablist" className="bg-gray-bg p-1.5 rounded-2xl flex items-center gap-1.5 w-fit">
        {tabs.map((tab) => {
          const isActive = tab.id === currentActive;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-2 rounded-xl body-sm-medium transition-colors duration-150 cursor-pointer flex items-center gap-2 shrink-0 z-10 select-none",
                isActive
                  ? "text-primary-500 font-semibold"
                  : "text-primary-400 hover:text-primary-500 hover:bg-white/60"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`pill-tab-${layoutId}`}
                  className="absolute inset-0 rounded-xl bg-white -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {tab.icon && (
                <span
                  className={cn(
                    "shrink-0 flex [&>svg]:w-4 [&>svg]:h-4",
                    isActive ? "text-primary-500" : "text-primary-400"
                  )}
                >
                  {tab.icon}
                </span>
              )}

              <span>{tab.label}</span>

              {typeof tab.count === "number" && (
                <ToneBadge
                  tone="navy"
                  size="sm"
                  variant="pill"
                  className={isActive ? "bg-slate-100 text-primary-500" : "bg-slate-200 text-primary-400"}
                >
                  {tab.count.toLocaleString()}
                </ToneBadge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PillTabs;
