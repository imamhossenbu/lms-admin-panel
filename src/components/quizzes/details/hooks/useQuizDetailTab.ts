"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { QUIZ_DETAIL_TABS, type QuizDetailTab } from "../quizTabTypes";

export const isQuizDetailTab = (value: string): value is QuizDetailTab => (QUIZ_DETAIL_TABS as readonly string[]).includes(value);

/** Active Quiz Details tab synced with `?tab=` ("overview" is the default and dropped from the URL). */
export function useQuizDetailTab() {
  const { get, set } = useUrlParams();
  const raw = get("tab", "overview");
  const activeTab: QuizDetailTab = isQuizDetailTab(raw) ? raw : "overview";

  const setActiveTab = useCallback(
    (tab: QuizDetailTab) => {
      set({ tab: tab === "overview" ? null : tab });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [set]
  );

  return { activeTab, setActiveTab };
}
