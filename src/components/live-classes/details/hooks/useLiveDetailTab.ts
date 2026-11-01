"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { LIVE_DETAIL_TABS, type LiveDetailTab } from "../liveTabTypes";

export const isLiveDetailTab = (value: string): value is LiveDetailTab => (LIVE_DETAIL_TABS as readonly string[]).includes(value);

/** Active Live Class tab synced with `?tab=` ("overview" is the default and dropped from the URL). */
export function useLiveDetailTab() {
  const { get, set } = useUrlParams();
  const raw = get("tab", "overview");
  const activeTab: LiveDetailTab = isLiveDetailTab(raw) ? raw : "overview";

  const setActiveTab = useCallback(
    (tab: LiveDetailTab) => {
      set({ tab: tab === "overview" ? null : tab });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [set]
  );

  return { activeTab, setActiveTab };
}
