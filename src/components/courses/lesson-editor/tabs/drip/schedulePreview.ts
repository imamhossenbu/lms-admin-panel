import type { DripValues } from "./dripOptions";

const UNIT_DAYS = { DAYS: 1, WEEKS: 7, MONTHS: 30 } as const;
const UNIT_WORD = { DAYS: "day", WEEKS: "week", MONTHS: "month" } as const;

export interface ReleaseSummary {
  /** Line under "This Lesson Becomes Available". */
  detail: string;
  /** Right-aligned marker ("Day 7", "Oct 25", "Manual"). */
  marker: string;
}

const formatDate = (date: string, opts: Intl.DateTimeFormatOptions) => {
  const at = new Date(`${date}T00:00`);
  return Number.isNaN(at.getTime()) ? "" : at.toLocaleDateString("en-US", opts);
};

const formatTime = (time: string) => {
  if (!/^\d{2}:\d{2}$/.test(time)) return "";
  const [h, m] = time.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

/** Human description of when the lesson unlocks, computed from the drip form values. */
export function describeRelease(drip: Pick<DripValues, "releaseType" | "releaseValue" | "releaseUnit" | "releaseDate" | "releaseTime">): ReleaseSummary {
  switch (drip.releaseType) {
    case "AFTER_ENROLLMENT": {
      const value = Number.isFinite(drip.releaseValue) && drip.releaseValue > 0 ? Math.floor(drip.releaseValue) : 0;
      if (!value) return { detail: "Set how long after enrollment", marker: "Day ?" };
      const word = `${UNIT_WORD[drip.releaseUnit]}${value === 1 ? "" : "s"}`;
      return { detail: `After ${value} ${word} from enrollment`, marker: `Day ${value * UNIT_DAYS[drip.releaseUnit]}` };
    }
    case "SPECIFIC_DATE": {
      const date = drip.releaseDate ? formatDate(drip.releaseDate, { month: "short", day: "numeric", year: "numeric" }) : "";
      if (!date) return { detail: "Pick a release date", marker: "Date" };
      const time = formatTime(drip.releaseTime);
      return {
        detail: `On ${date}${time ? ` at ${time}` : ""}`,
        marker: formatDate(drip.releaseDate, { month: "short", day: "numeric" }),
      };
    }
    case "MANUAL":
      return { detail: "Released manually by an instructor", marker: "Manual" };
    default:
      return { detail: "Immediately after enrollment", marker: "Day 0" };
  }
}
