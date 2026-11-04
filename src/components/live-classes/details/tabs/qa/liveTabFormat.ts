import { formatClock } from "@/lib/liveClassStats";
import { downloadFile, toCsv, todayStamp } from "@/components/commerce/exportFile";
import { apiErrorMessage } from "@/lib/apiError";

/** Shared formatting helpers for the Live Class details tabs (Q&A, Resources, Activity, Settings). */

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO datetime → "10:05 AM" (local). */
export const isoClock = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : formatClock(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
};

/** ISO datetime or "YYYY-MM-DD" → "Oct 20, 2026". */
export const shortDate = (value: string) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00`) : new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/** Bytes → "480 MB" / "2.4 MB" / "-" for links. */
export function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

/** Friendly message from an unknown error (never a stack trace). */
export const errorText = (e: unknown, fallback = "Something went wrong. Please try again.") => apiErrorMessage(e, fallback);

/** Downloads a CSV named "<slug>-<suffix>-<date>.csv". */
export function downloadCsv(title: string, suffix: string, header: string[], rows: (string | number)[][]) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "live-class";
  downloadFile(toCsv(header, rows), `${slug}-${suffix}-${todayStamp()}.csv`, "text/csv");
}

/** Session key used by the Activity tab to open a question when it switches to the Q&A tab. */
export const LIVE_QA_FOCUS_KEY = "edupro_live_qa_focus";
