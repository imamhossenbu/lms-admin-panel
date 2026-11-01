"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { LESSON_EDITOR_TABS, type LessonEditorTab } from "@/validations/lessonEditorSchema";
import { LESSON_EDITOR_TAB_ICON, LESSON_EDITOR_TAB_LABEL } from "./lessonEditorTabsConfig";

export interface LessonEditorTabsProps {
  activeTab: LessonEditorTab;
  onChange: (tab: LessonEditorTab) => void;
  /** Tabs that show a red error dot. */
  errorTabs?: LessonEditorTab[];
}

/** White tab bar: icon + label, orange text + animated orange underline, scrolls horizontally on small screens. */
export function LessonEditorTabs({ activeTab, onChange, errorTabs = [] }: LessonEditorTabsProps) {
  return (
    <nav aria-label="Lesson editor sections" className="dashboard-card shadow-2xs overflow-x-auto px-2">
      <div role="tablist" className="flex min-w-max items-center">
        {LESSON_EDITOR_TABS.map((tab) => {
          const Icon = LESSON_EDITOR_TAB_ICON[tab];
          const isActive = tab === activeTab;
          const hasError = errorTabs.includes(tab);
          return (
            <motion.button
              key={tab}
              type="button"
              role="tab"
              id={`lesson-tab-${tab}`}
              aria-selected={isActive}
              aria-controls={`lesson-panel-${tab}`}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(tab)}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-4 body-sm-medium transition-colors",
                isActive ? "text-brand-orange" : "text-primary-400"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{LESSON_EDITOR_TAB_LABEL[tab]}</span>
              {hasError && <span className="h-2 w-2 rounded-full bg-red" aria-label="Has errors" />}
              {isActive && (
                <motion.span
                  layoutId="lesson-editor-tab-underline"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-orange"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default LessonEditorTabs;
