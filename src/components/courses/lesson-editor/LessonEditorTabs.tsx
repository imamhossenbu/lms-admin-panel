"use client";

import React from "react";
import { PillTabs } from "@/components/ui/PillTabs";
import { LESSON_EDITOR_TABS, type LessonEditorTab } from "@/validations/lessonEditorSchema";
import { LESSON_EDITOR_TAB_ICON, LESSON_EDITOR_TAB_LABEL } from "./lessonEditorTabsConfig";

export interface LessonEditorTabsProps {
  activeTab: LessonEditorTab;
  onChange: (tab: LessonEditorTab) => void;
  /** Tabs that show a red error dot. */
  errorTabs?: LessonEditorTab[];
}

/** Content … Notes — the shared capsule PillTabs (icon + label, red dot on tabs with errors). */
export function LessonEditorTabs({ activeTab, onChange, errorTabs = [] }: LessonEditorTabsProps) {
  return (
    <PillTabs
      ariaLabel="Lesson editor sections"
      idPrefix="lesson"
      activeId={activeTab}
      onChange={onChange}
      tabs={LESSON_EDITOR_TABS.map((id) => {
        const Icon = LESSON_EDITOR_TAB_ICON[id];
        return { id, label: LESSON_EDITOR_TAB_LABEL[id], icon: <Icon />, hasError: errorTabs.includes(id) };
      })}
    />
  );
}

export default LessonEditorTabs;
