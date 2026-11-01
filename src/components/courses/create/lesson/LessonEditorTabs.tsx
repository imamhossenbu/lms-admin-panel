"use client";

import React from "react";
import { FileText, Info, MonitorPlay, Settings, type LucideIcon } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";
import { PillTabs } from "@/components/ui/PillTabs";
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
  /** Tabs returning false are disabled (create mode: tabs past the first unfinished one). Default: all enabled. */
  isTabEnabled?: (tab: LessonTab) => boolean;
}

/** Basic Info | Content | Resources | Settings — shared capsule PillTabs with red dots on tabs with errors. */
export function LessonEditorTabs({ active, onChange, isTabEnabled }: LessonEditorTabsProps) {
  const { control } = useFormContext<LessonFormValues>();
  const { errors } = useFormState({ control });
  const errorTabs = new Set(
    (Object.keys(errors) as (keyof LessonFormValues)[]).map((key) => LESSON_FIELD_TAB[key]).filter(Boolean)
  );

  return (
    <PillTabs
      ariaLabel="Lesson sections"
      idPrefix="lesson"
      activeId={active}
      onChange={onChange}
      tabs={LESSON_TABS.map((id) => {
        const { label, icon: Icon } = LESSON_TAB_META[id];
        return { id, label, icon: <Icon />, hasError: errorTabs.has(id), disabled: isTabEnabled ? !isTabEnabled(id) : false };
      })}
    />
  );
}

export default LessonEditorTabs;
