import type { LiveActivity, LiveClassItem, LiveDisplayStatus, LiveEnrollment, LiveQuestion } from "@/types/liveClass";
import { LIVE_COURSES, LIVE_INSTRUCTORS } from "@/data/mockLiveClassData";

/** Pure helpers — every number on the Live Classes pages comes from here (never hard-coded). */

const DAY = 86400000;
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

export const startOf = (c: Pick<LiveClassItem, "date" | "startTime">) => new Date(`${c.date}T${c.startTime}`);
export const endOf = (c: Pick<LiveClassItem, "date" | "endTime">) => new Date(`${c.date}T${c.endTime}`);
export const durationMinutes = (c: Pick<LiveClassItem, "date" | "startTime" | "endTime">) =>
  Math.max(0, Math.round((endOf(c).getTime() - startOf(c).getTime()) / 60000));

/** Display status from the stored status + clock. UPCOMING = starts within 3 days. */
export function liveStatus(c: Pick<LiveClassItem, "status" | "date" | "startTime" | "endTime">, now: Date = new Date()): LiveDisplayStatus {
  if (c.status === "CANCELLED") return "CANCELLED";
  const s = startOf(c).getTime();
  const e = endOf(c).getTime();
  const t = now.getTime();
  if (t >= s && t < e) return "LIVE";
  if (t >= e) return "COMPLETED";
  return s - t <= 3 * DAY ? "UPCOMING" : "SCHEDULED";
}

export const courseOf = (id: string) => LIVE_COURSES.find((c) => c.id === id);
export const instructorOf = (id: string) => LIVE_INSTRUCTORS.find((i) => i.id === id);

/** "1 hour" / "1h 30m" / "45m". */
export function formatMinutes(min: number) {
  if (min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h} hour${h === 1 ? "" : "s"}`;
  return `${h}h ${m}m`;
}

/** "10:00 AM". */
export function formatClock(hhmm: string) {
  if (!hhmm) return "-";
  const [h, m] = hhmm.split(":").map(Number);
  return `${String(((h + 11) % 12) + 1).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Attendance of one class. */
export function attendanceStats(rows: LiveEnrollment[]) {
  const enrolled = rows.length;
  const attended = rows.filter((r) => r.status === "ATTENDED");
  const absent = rows.filter((r) => r.status === "ABSENT").length;
  const notJoined = rows.filter((r) => r.status === "NOT_JOINED").length;
  return {
    enrolled,
    attended: attended.length,
    absent,
    notJoined,
    attendedPct: pct(attended.length, enrolled),
    absentPct: pct(absent, enrolled),
    notJoinedPct: pct(notJoined, enrolled),
    avgWatchMinutes: attended.length ? Math.round(attended.reduce((s, r) => s + r.watchMinutes, 0) / attended.length) : 0,
  };
}

/** Watch progress % of the class duration (0 when not attended). */
export const watchProgress = (row: LiveEnrollment, durationMin: number) =>
  row.status === "ATTENDED" && durationMin > 0 ? Math.min(100, Math.round((row.watchMinutes / durationMin) * 100)) : 0;

/** People present over time (cumulative joins minus leaves), sampled every `step` minutes. */
export function attendanceTimeline(rows: LiveEnrollment[], c: Pick<LiveClassItem, "startTime" | "endTime" | "date">, step = 5) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const start = toMin(c.startTime);
  const end = toMin(c.endTime);
  const points: { label: string; present: number }[] = [];
  for (let t = start; t <= end; t += step) {
    const present = rows.filter((r) => r.status === "ATTENDED" && r.joinTime && toMin(r.joinTime) <= t && (!r.leaveTime || toMin(r.leaveTime) > t)).length;
    points.push({ label: formatClock(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`), present });
  }
  return points;
}

export const topEngaged = (rows: LiveEnrollment[], n = 5) =>
  rows.filter((r) => r.status === "ATTENDED").sort((a, b) => b.watchMinutes - a.watchMinutes || a.joinTime.localeCompare(b.joinTime)).slice(0, n);

export function qaStats(questions: LiveQuestion[]) {
  const answered = questions.filter((q) => q.status === "ANSWERED").length;
  return { asked: questions.length, answered, pending: questions.length - answered, answeredPct: pct(answered, questions.length) };
}

/** List page cards: all-time totals + % change of the last 30 days vs the 30 days before (null when no baseline). */
export function liveListStats(classes: LiveClassItem[], enrollments: LiveEnrollment[], now: Date = new Date()) {
  const statusOf = new Map(classes.map((c) => [c.id, liveStatus(c, now)]));
  const attendedBy = new Map<string, number>();
  enrollments.forEach((e) => e.status === "ATTENDED" && attendedBy.set(e.classId, (attendedBy.get(e.classId) ?? 0) + 1));
  const inWindow = (c: LiveClassItem, from: number, to: number) => {
    const t = startOf(c).getTime();
    return t >= from && t < to;
  };
  const t = now.getTime();
  const window = (from: number, to: number) => {
    const cs = classes.filter((c) => inWindow(c, from, to));
    return {
      total: cs.length,
      attendees: cs.reduce((s, c) => s + (attendedBy.get(c.id) ?? 0), 0),
      completed: cs.filter((c) => statusOf.get(c.id) === "COMPLETED").length,
      cancelled: cs.filter((c) => statusOf.get(c.id) === "CANCELLED").length,
    };
  };
  // Last 30 days vs the 30 days before (past classes only, so the comparison is fair).
  const cur = window(t - 30 * DAY, t);
  const prev = window(t - 60 * DAY, t - 30 * DAY);
  const change = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : null);
  const upcoming = classes.filter((c) => ["UPCOMING", "SCHEDULED", "LIVE"].includes(statusOf.get(c.id) as string)).length;
  return {
    total: classes.length,
    attendees: Array.from(attendedBy.values()).reduce((a, b) => a + b, 0),
    completed: classes.filter((c) => statusOf.get(c.id) === "COMPLETED").length,
    upcoming,
    cancelled: classes.filter((c) => statusOf.get(c.id) === "CANCELLED").length,
    change: {
      total: change(cur.total, prev.total),
      attendees: change(cur.attendees, prev.attendees),
      completed: change(cur.completed, prev.completed),
      cancelled: change(cur.cancelled, prev.cancelled),
    },
  };
}

export const attendeesOf = (classId: string, enrollments: LiveEnrollment[]) =>
  enrollments.filter((e) => e.classId === classId && e.status === "ATTENDED").length;

export const activityCounts = (activity: LiveActivity[]) =>
  activity.reduce<Record<string, number>>((acc, a) => ((acc[a.kind] = (acc[a.kind] ?? 0) + 1), acc), {});

export const initialsOf = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
