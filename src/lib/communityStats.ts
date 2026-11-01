import type { CommunityThread, ThreadCategory, ThreadReply, ThreadReport } from "@/types/community";

/** Pure helpers — every Community number is derived here (never hard-coded). */

const DAY = 86400000;

export interface ThreadView {
  thread: CommunityThread;
  replyCount: number;
  /** Has an accepted reply (QUESTION) — or for other categories, any staff reply. */
  isResolved: boolean;
  /** QUESTION with no non-removed reply. */
  isUnanswered: boolean;
  openReports: number;
  lastActivityAt: string;
  lastReplier: ThreadReply["author"] | null;
  participants: ThreadReply["author"][];
}

export function threadViews(threads: CommunityThread[], replies: ThreadReply[], reports: ThreadReport[]): ThreadView[] {
  const byThread = new Map<string, ThreadReply[]>();
  replies.forEach((r) => byThread.set(r.threadId, [...(byThread.get(r.threadId) ?? []), r]));
  const openByThread = new Map<string, number>();
  reports.forEach((r) => r.status === "OPEN" && openByThread.set(r.threadId, (openByThread.get(r.threadId) ?? 0) + 1));
  return threads.map((t) => {
    const rs = (byThread.get(t.id) ?? []).filter((r) => !r.isRemoved).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const last = rs[rs.length - 1];
    const accepted = rs.some((r) => r.isAccepted);
    const staffReplied = rs.some((r) => r.author.role !== "STUDENT");
    const people = new Map([[t.author.id, t.author], ...rs.map((r) => [r.author.id, r.author] as const)]);
    return {
      thread: t,
      replyCount: rs.length,
      isResolved: t.category === "QUESTION" ? accepted : staffReplied,
      isUnanswered: t.category === "QUESTION" && rs.length === 0,
      openReports: openByThread.get(t.id) ?? 0,
      lastActivityAt: last ? (last.createdAt > t.updatedAt ? last.createdAt : t.updatedAt) : t.updatedAt,
      lastReplier: last?.author ?? null,
      participants: Array.from(people.values()),
    };
  });
}

/** Stat cards + 7-day deltas. */
export function communityStats(views: ThreadView[], replies: ThreadReply[], now: Date = new Date()) {
  const t = now.getTime();
  const inLast = (iso: string, days: number, offset = 0) => {
    const x = new Date(iso).getTime();
    return x > t - (days + offset) * DAY && x <= t - offset * DAY;
  };
  const active = (offset: number) => views.filter((v) => inLast(v.lastActivityAt, 7, offset)).length;
  const repliesIn = (offset: number) => replies.filter((r) => !r.isRemoved && inLast(r.createdAt, 7, offset)).length;
  const delta = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : null);
  const questions = views.filter((v) => v.thread.category === "QUESTION");
  return {
    total: views.length,
    activeThisWeek: active(0),
    activeDelta: delta(active(0), active(7)),
    repliesThisWeek: repliesIn(0),
    repliesDelta: delta(repliesIn(0), repliesIn(7)),
    unanswered: views.filter((v) => v.isUnanswered).length,
    flagged: views.filter((v) => v.openReports > 0).length,
    openReports: views.reduce((s, v) => s + v.openReports, 0),
    answerRate: questions.length ? Math.round((questions.filter((v) => v.isResolved).length / questions.length) * 100) : 0,
  };
}

/** Median hours from question to first staff reply (resolved questions only); null when none. */
export function medianResponseHours(views: ThreadView[], replies: ThreadReply[]) {
  const hours = views
    .filter((v) => v.thread.category === "QUESTION")
    .map((v) => {
      const first = replies.filter((r) => r.threadId === v.thread.id && r.author.role !== "STUDENT" && !r.isRemoved).sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
      return first ? (new Date(first.createdAt).getTime() - new Date(v.thread.createdAt).getTime()) / 3600000 : null;
    })
    .filter((h): h is number => h !== null)
    .sort((a, b) => a - b);
  if (!hours.length) return null;
  const mid = Math.floor(hours.length / 2);
  return Math.round((hours.length % 2 ? hours[mid] : (hours[mid - 1] + hours[mid]) / 2) * 10) / 10;
}

export function topContributors(replies: ThreadReply[], n = 5) {
  const map = new Map<string, { member: ThreadReply["author"]; replies: number; accepted: number; likes: number }>();
  replies.filter((r) => !r.isRemoved).forEach((r) => {
    const cur = map.get(r.author.id) ?? { member: r.author, replies: 0, accepted: 0, likes: 0 };
    cur.replies += 1;
    cur.accepted += r.isAccepted ? 1 : 0;
    cur.likes += r.likes;
    map.set(r.author.id, cur);
  });
  return Array.from(map.values()).sort((a, b) => b.accepted * 5 + b.replies + b.likes / 5 - (a.accepted * 5 + a.replies + a.likes / 5)).slice(0, n);
}

export function trendingTags(views: ThreadView[], n = 8, now: Date = new Date()) {
  const counts = new Map<string, number>();
  views
    .filter((v) => new Date(v.lastActivityAt).getTime() > now.getTime() - 30 * DAY)
    .forEach((v) => v.thread.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1 + v.replyCount / 5)));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag, score]) => ({ tag, score: Math.round(score * 10) / 10 }));
}

export const categoryCounts = (views: ThreadView[]) =>
  views.reduce<Record<ThreadCategory, number>>((acc, v) => ((acc[v.thread.category] += 1), acc), { QUESTION: 0, DISCUSSION: 0, ANNOUNCEMENT: 0, SHOWCASE: 0, FEEDBACK: 0 });

/** "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago" / date. */
export function timeAgo(iso: string, now: Date = new Date()) {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const initialsOf = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
