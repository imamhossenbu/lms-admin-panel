"use client";

import { useMemo, useState } from "react";
import { LESSON_EDITOR_TABS, type LessonEditorTab } from "@/validations/lessonEditorSchema";

/** Collects `onUploadingChange` reports from every tab; `isUploading` is true while any tab uploads. */
export function useUploadTracker() {
  const [uploading, setUploading] = useState<Partial<Record<LessonEditorTab, boolean>>>({});

  // One stable callback per tab so tab effects don't re-run on every render.
  const reporters = useMemo(
    () =>
      Object.fromEntries(
        LESSON_EDITOR_TABS.map((tab) => [
          tab,
          (value: boolean) => setUploading((prev) => (prev[tab] === value ? prev : { ...prev, [tab]: value })),
        ])
      ) as Record<LessonEditorTab, (value: boolean) => void>,
    []
  );

  return { isUploading: Object.values(uploading).some(Boolean), reporters };
}
