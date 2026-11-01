import type { AssignmentItem, AssignmentRubric, AssignmentSubmission } from "@/types/assignment";

/** Pure helpers — every number on the Assignments pages comes from here (no hard-coded stats). */

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 1000) / 10 : 0);

export function courseAssignmentStats(assignments: AssignmentItem[], submissions: AssignmentSubmission[]) {
  const ids = new Set(assignments.map((a) => a.id));
  const own = submissions.filter((s) => ids.has(s.assignmentId));
  return {
    totalAssignments: assignments.length,
    totalSubmissions: own.length,
    pendingReview: own.filter((s) => s.status === "PENDING").length,
    graded: own.filter((s) => s.status === "GRADED").length,
  };
}

export function submissionStats(submissions: AssignmentSubmission[]) {
  const total = submissions.length;
  const graded = submissions.filter((s) => s.status === "GRADED").length;
  const pending = total - graded;
  const late = submissions.filter((s) => s.isLate).length;
  return { total, graded, pending, late, gradedPct: pct(graded, total), pendingPct: pct(pending, total), latePct: pct(late, total) };
}

/** Due moment as a Date (local time). */
export const dueAt = (a: Pick<AssignmentItem, "dueDate" | "dueTime">) => new Date(`${a.dueDate}T${a.dueTime || "23:59"}`);

/** Whole days until due (negative = overdue), based on calendar days. */
export function daysLeft(a: Pick<AssignmentItem, "dueDate" | "dueTime">, now: Date = new Date()) {
  const due = dueAt(a);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

/** "5 days left" / "Due today" / "1 day left" / "Overdue by 3 days"; urgent when ≤ 2 days. */
export function dueLabel(a: Pick<AssignmentItem, "dueDate" | "dueTime">, now: Date = new Date()) {
  const d = daysLeft(a, now);
  if (dueAt(a).getTime() < now.getTime()) return { text: d === 0 ? "Overdue today" : `Overdue by ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"}`, tone: "red" as const };
  if (d === 0) return { text: "Due today", tone: "red" as const };
  return { text: `${d} day${d === 1 ? "" : "s"} left`, tone: d <= 5 ? ("red" as const) : ("muted" as const) };
}

/** Letter-grade buckets on the % score (graded only). */
export function gradeDistribution(submissions: AssignmentSubmission[], totalPoints: number) {
  const buckets = [
    { key: "A", label: "A (90-100)", min: 90 },
    { key: "B", label: "B (80-89)", min: 80 },
    { key: "C", label: "C (70-79)", min: 70 },
    { key: "D", label: "D (60-69)", min: 60 },
    { key: "F", label: "F (0-59)", min: 0 },
  ];
  const graded = submissions.filter((s) => s.status === "GRADED" && s.score !== null);
  const counts = buckets.map((b) => ({ ...b, count: 0 }));
  graded.forEach((s) => {
    const p = ((s.score as number) / totalPoints) * 100;
    (counts.find((b) => p >= b.min) ?? counts[counts.length - 1]).count += 1;
  });
  return counts.map((b) => ({ ...b, pct: pct(b.count, graded.length) }));
}

/** Score histogram in point ranges, e.g. 0-9, 10-14, … up to totalPoints. */
export function scoreHistogram(submissions: AssignmentSubmission[], totalPoints: number) {
  const edges = [0, 0.3, 0.45, 0.6, 0.75, 0.9].map((f) => Math.round(totalPoints * f));
  const ranges = edges.map((from, i) => ({ from, to: i < edges.length - 1 ? edges[i + 1] - 1 : totalPoints }));
  return ranges.map((r) => ({
    label: `${r.from}-${r.to}`,
    count: submissions.filter((s) => s.status === "GRADED" && s.score !== null && (s.score as number) >= r.from && (s.score as number) <= r.to).length,
  }));
}

/** Submissions per day for the last `days` days (oldest first). */
export function dailySubmissions(submissions: AssignmentSubmission[], days = 7, now: Date = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1 - i));
    const next = new Date(day.getTime() + 86400000);
    const inDay = submissions.filter((s) => {
      const t = new Date(s.submittedAt).getTime();
      return t >= day.getTime() && t < next.getTime();
    });
    const graded = inDay.filter((s) => s.score !== null);
    return {
      date: day.toISOString(),
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: inDay.length,
      gradedCount: graded.length,
    };
  });
}

/** Average % score per day for graded submissions (null where none). */
export function dailyAverageScore(submissions: AssignmentSubmission[], totalPoints: number, days = 7, now: Date = new Date()) {
  return dailySubmissions(submissions, days, now).map((d) => {
    const start = new Date(d.date).getTime();
    const graded = submissions.filter((s) => {
      const t = new Date(s.submittedAt).getTime();
      return s.score !== null && t >= start && t < start + 86400000;
    });
    const avg = graded.length ? graded.reduce((sum, s) => sum + (s.score as number), 0) / graded.length : null;
    return { label: d.label, avgPct: avg === null ? null : Math.round((avg / totalPoints) * 100) };
  });
}

/** Average points per rubric criterion across graded submissions. */
export function criteriaPerformance(submissions: AssignmentSubmission[], rubric: AssignmentRubric) {
  const graded = submissions.filter((s) => s.status === "GRADED");
  return rubric.criteria.map((c) => {
    const scores = graded.map((s) => s.criterionScores[c.id]).filter((v): v is number => typeof v === "number");
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { id: c.id, title: c.title, max: c.points, avg: Math.round(avg * 10) / 10, pct: c.points ? Math.round((avg / c.points) * 100) : 0 };
  });
}

export const topPerformers = (submissions: AssignmentSubmission[], n = 3) =>
  submissions
    .filter((s) => s.status === "GRADED" && s.score !== null)
    .sort((a, b) => (b.score as number) - (a.score as number) || a.submittedAt.localeCompare(b.submittedAt))
    .slice(0, n);

/** Pending (oldest first) then late — "Needs Attention". */
export const needsAttention = (submissions: AssignmentSubmission[], n = 4) =>
  [
    ...submissions.filter((s) => s.status === "PENDING").sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)),
    ...submissions.filter((s) => s.status === "GRADED" && s.isLate),
  ].slice(0, n);

export const recentActivity = (submissions: AssignmentSubmission[], n = 4) =>
  [...submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, n);

/** "2 days ago", "8 hours ago", "just now". */
export function timeAgo(iso: string, now: Date = new Date()) {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
