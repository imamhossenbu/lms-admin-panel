"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { LESSON_EDITOR_TABS, type LessonEditorTab } from "@/validations/lessonEditorSchema";

export const isLessonEditorTab = (value: string): value is LessonEditorTab =>
  (LESSON_EDITOR_TABS as readonly string[]).includes(value);

/** Active Edit Lesson tab synced with `?tab=` (default "content", which is dropped from the URL). */
export function useLessonEditorTab() {
  const { get, set } = useUrlParams();
  const raw = get("tab", "content");
  const activeTab: LessonEditorTab = isLessonEditorTab(raw) ? raw : "content";

  const setActiveTab = useCallback(
    (tab: LessonEditorTab) => set({ tab: tab === "content" ? null : tab }),
    [set]
  );

  return { activeTab, setActiveTab };
}
