import type { LiveActivity } from "@/types/liveClass";
import { downloadCsv, isoClock, shortDate } from "../qa/liveTabFormat";
import { ACTIVITY_META } from "./activityMeta";

/** Exports the activity log as CSV. */
export function exportActivityCsv(classTitle: string, items: LiveActivity[]) {
  downloadCsv(
    classTitle,
    "activity-log",
    ["Date", "Time", "Event", "Title", "Detail", "By"],
    items.map((a) => [shortDate(a.at), isoClock(a.at), ACTIVITY_META[a.kind].label, a.title, a.detail, a.actor])
  );
}
