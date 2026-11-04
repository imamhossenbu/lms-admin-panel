import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";

/** Pure helpers for the thread page (the list page's numbers come from the API, which derives them the same way). */

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
