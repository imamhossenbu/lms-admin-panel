"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { ASSIGNMENT_DETAIL_TABS, type AssignmentDetailTab } from "../tabTypes";

export const isAssignmentDetailTab = (value: string): value is AssignmentDetailTab =>
  (ASSIGNMENT_DETAIL_TABS as readonly string[]).includes(value);

/** Active Assignment Details tab synced with `?tab=` ("overview" is the default and dropped from the URL). */
export function useAssignmentDetailTab() {
  const { get, set } = useUrlParams();
  const raw = get("tab", "overview");
  const activeTab: AssignmentDetailTab = isAssignmentDetailTab(raw) ? raw : "overview";

  const setActiveTab = useCallback(
    (tab: AssignmentDetailTab) => {
      set({ tab: tab === "overview" ? null : tab });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [set]
  );

  return { activeTab, setActiveTab };
}
