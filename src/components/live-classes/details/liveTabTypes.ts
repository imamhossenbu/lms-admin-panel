import type { LiveClassBundle } from "@/lib/liveClassStorage";
import type { LiveDisplayStatus } from "@/types/liveClass";

export const LIVE_DETAIL_TABS = ["overview", "students", "attendance", "qa", "resources", "activity", "settings"] as const;
export type LiveDetailTab = (typeof LIVE_DETAIL_TABS)[number];
export const LIVE_DETAIL_TAB_LABEL: Record<LiveDetailTab, string> = {
  overview: "Overview",
  students: "Students",
  attendance: "Attendance",
  qa: "Q&A",
  resources: "Resources",
  activity: "Activity",
  settings: "Settings",
};

/**
 * Props every Live Class details tab receives from LiveClassDetailsView.
 * `bundle` is reloaded on LIVE_CLASSES_UPDATED_EVENT, so tabs just call the storage write helpers
 * (answerLiveQuestion, addLiveResource, setAttendance, updateLiveClass …) and re-render.
 */
export interface LiveTabProps {
  bundle: LiveClassBundle;
  /** Derived display status (LIVE / COMPLETED / UPCOMING / SCHEDULED / CANCELLED). */
  status: LiveDisplayStatus;
  onTabChange: (tab: LiveDetailTab) => void;
}
