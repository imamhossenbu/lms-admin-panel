"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Info, MonitorPlay, Settings, type LucideIcon } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";
import { cn } from "@/lib/cn";
import { LESSON_FIELD_TAB, LESSON_TABS, type LessonFormValues, type LessonTab } from "@/validations/lessonFormSchema";

export const LESSON_TAB_META: Record<LessonTab, { label: string; icon: LucideIcon }> = {
  basic: { label: "Basic Info", icon: Info },
  content: { label: "Content", icon: MonitorPlay },
  resources: { label: "Resources", icon: FileText },
  settings: { label: "Settings", icon: Settings },
};

export interface LessonEditorTabsProps {
  active: LessonTab;
  onChange: (tab: LessonTab) => void;
}

/** Basic Info | Content | Resources | Settings with an animated active pill and red dots on tabs with errors. */
export function LessonEditorTabs({ active, onChange }: LessonEditorTabsProps) {
  const { control } = useFormContext<LessonFormValues>();
  const { errors } = useFormState({ control });
  const errorTabs = new Set(
    (Object.keys(errors) as (keyof LessonFormValues)[]).map((key) => LESSON_FIELD_TAB[key]).filter(Boolean)
  );

  return (
    <div role="tablist" aria-label="Lesson sections" className="flex overflow-x-auto border-b border-dash">
      {LESSON_TABS.map((tab) => {
        const { label, icon: Icon } = LESSON_TAB_META[tab];
        const isActive = tab === active;
        return (
          <motion.button
            key={tab}
            type="button"
            role="tab"
            id={`lesson-tab-${tab}`}
            aria-selected={isActive}
            aria-controls={`lesson-panel-${tab}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(tab)}
            className={cn(
              "relative inline-flex shrink-0 cursor-pointer items-center gap-2 border-r border-dash px-5 py-3 body-sm-medium whitespace-nowrap transition-colors first:border-l first:rounded-tl-lg last:rounded-tr-lg",
              isActive ? "text-brand-orange" : "text-primary-400 hover:text-primary-500 hover:bg-gray-bg"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="lesson-editor-tab-active"
                className="absolute inset-0 border-b-2 border-brand-orange bg-brand-orange-light"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative h-4 w-4" />
            <span className="relative">{label}</span>
            {errorTabs.has(tab) && (
              <span className="relative h-2 w-2 rounded-full bg-red" aria-label="Has errors" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default LessonEditorTabs;
