import type { AttendanceStatus, LiveClassItem, LiveClassType, LiveDisplayStatus, LiveEnrollment } from "@/types/liveClass";
import { durationMinutes, endOf, formatClock, formatMinutes } from "@/lib/liveClassStats";
import { apiErrorMessage } from "@/lib/apiError";

/** Display labels + small formatters shared by the Live Class details page. */

export const LIVE_TYPE_LABEL: Record<LiveClassType, string> = {
  INTERACTIVE: "Interactive",
  WEBINAR: "Webinar",
  WORKSHOP: "Workshop",
  QA: "Q&A",
};

export const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = { ATTENDED: "Attended", ABSENT: "Absent", NOT_JOINED: "Not Joined" };

/** "Oct 20, 2026" from "YYYY-MM-DD" (local, no timezone shift). */
export function formatLiveDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "-";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "Oct 10, 2026" from an ISO datetime. */
export function formatIsoDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "10:00 AM - 11:00 AM (1 hour)". */
export const timeRangeLabel = (c: Pick<LiveClassItem, "date" | "startTime" | "endTime">) =>
  `${formatClock(c.startTime)} - ${formatClock(c.endTime)} (${formatMinutes(durationMinutes(c))})`;

/** "Live interactive session for JavaScript Essentials course." */
export const liveSubtitle = (type: LiveClassType, courseTitle: string) => `Live ${LIVE_TYPE_LABEL[type].toLowerCase()} session for ${courseTitle} course.`;

/** The class already started (attendance exists). */
export const hasHappened = (status: LiveDisplayStatus) => status === "LIVE" || status === "COMPLETED";

/** Meeting link is usable unless cancelled or completed more than a day ago. */
export function isLinkActive(c: LiveClassItem, status: LiveDisplayStatus, now: Date = new Date()) {
  if (status === "CANCELLED") return false;
  if (status === "COMPLETED") return now.getTime() - endOf(c).getTime() <= 86400000;
  return true;
}

/** Joining the meeting only makes sense before / during the class. */
export const canJoin = (status: LiveDisplayStatus) => status !== "CANCELLED" && status !== "COMPLETED";

export const STATUS_DOT: Record<LiveDisplayStatus, string> = {
  LIVE: "bg-red",
  COMPLETED: "bg-green",
  UPCOMING: "bg-blue",
  SCHEDULED: "bg-purple",
  CANCELLED: "bg-primary-300",
};
export const STATUS_TEXT: Record<LiveDisplayStatus, string> = {
  LIVE: "text-red",
  COMPLETED: "text-green",
  UPCOMING: "text-blue",
  SCHEDULED: "text-purple",
  CANCELLED: "text-primary-300",
};
export const STATUS_LABEL: Record<LiveDisplayStatus, string> = {
  LIVE: "Live Now",
  COMPLETED: "Completed",
  UPCOMING: "Upcoming",
  SCHEDULED: "Scheduled",
  CANCELLED: "Cancelled",
};

export const errorMessage = (error: unknown, fallback = "Please try again.") => apiErrorMessage(error, fallback);

const escapeCsv = (value: string | number) => {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "live-class";

/** Builds + downloads a CSV of enrollment rows. Returns the file name. */
export function downloadEnrollmentsCsv(liveClass: LiveClassItem, rows: LiveEnrollment[], suffix: "students" | "attendance") {
  const duration = durationMinutes(liveClass);
  const header = ["Student", "Email", "Enrollment Date", "Status", "Join Time", "Leave Time", "Watch Minutes", "Progress %"];
  const body = rows.map((r) => [
    r.student.name,
    r.student.email,
    formatIsoDate(r.enrolledAt),
    ATTENDANCE_LABEL[r.status],
    r.joinTime ? formatClock(r.joinTime) : "",
    r.leaveTime ? formatClock(r.leaveTime) : "",
    r.watchMinutes,
    r.status === "ATTENDED" && duration > 0 ? Math.min(100, Math.round((r.watchMinutes / duration) * 100)) : 0,
  ]);
  const csv = [header, ...body].map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = `${slug(liveClass.title)}-${suffix}.csv`;
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
