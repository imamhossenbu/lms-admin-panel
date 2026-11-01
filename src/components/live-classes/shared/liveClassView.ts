import type { LiveClassType, LiveDisplayStatus, LivePlatform, ReminderOffset } from "@/types/liveClass";
import type { Tone } from "@/components/ui/ToneBadge";

/** Display labels / tones shared by the Live Classes list, form and details pages. */

export const LIVE_STATUS_VIEW: Record<LiveDisplayStatus, { label: string; tone: Tone }> = {
  LIVE: { label: "Live Now", tone: "orange" },
  UPCOMING: { label: "Upcoming", tone: "blue" },
  SCHEDULED: { label: "Scheduled", tone: "gray" },
  COMPLETED: { label: "Completed", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

export const LIVE_PLATFORM_LABEL: Record<LivePlatform, string> = {
  ZOOM: "Zoom",
  GOOGLE_MEET: "Google Meet",
  TEAMS: "Microsoft Teams",
  CUSTOM: "Custom Link",
};

/** Short labels for tight spaces (tables). */
export const LIVE_PLATFORM_SHORT_LABEL: Record<LivePlatform, string> = {
  ZOOM: "Zoom",
  GOOGLE_MEET: "Meet",
  TEAMS: "Teams",
  CUSTOM: "Link",
};

export const LIVE_TYPE_LABEL: Record<LiveClassType, string> = {
  INTERACTIVE: "Live Class",
  WEBINAR: "Webinar",
  WORKSHOP: "Workshop",
  QA: "Q&A Session",
};

export const REMINDER_LABEL: Record<ReminderOffset, string> = {
  NONE: "No reminder",
  "5": "5 minutes before",
  "15": "15 minutes before",
  "30": "30 minutes before",
  "60": "1 hour before",
  "1440": "1 day before",
};

/** "Oct 20, 2026". */
export const formatLiveDate = (date: string) =>
  date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
