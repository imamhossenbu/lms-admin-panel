import type { CommunityThread, ReportStatus, ThreadReply, ThreadReport } from "@/types/community";
import type { ThreadFormValues } from "@/validations/communitySchema";
import { buildCommunitySeed, COMMUNITY_ADMIN, type CommunitySeed } from "@/data/mockCommunityData";

/** Mock-first persistence for Community (localStorage + simulated latency). Swap for API calls later. */

const STORAGE_KEY = "edupro_community_v1";
export const COMMUNITY_UPDATED_EVENT = "edupro_community_updated";
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export const CURRENT_MEMBER = COMMUNITY_ADMIN;

function read(): CommunitySeed {
  if (typeof window === "undefined") return buildCommunitySeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as CommunitySeed;
      if (Array.isArray(p?.threads) && Array.isArray(p?.replies) && Array.isArray(p?.reports)) return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildCommunitySeed();
  write(seed);
  return seed;
}

function write(data: CommunitySeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(COMMUNITY_UPDATED_EVENT));
}

const touch = (d: CommunitySeed, threadId: string): CommunitySeed => ({
  ...d,
  threads: d.threads.map((t) => (t.id === threadId ? { ...t, updatedAt: new Date().toISOString() } : t)),
});

// ---------------------------------------------------------------- reads
export const getCommunitySnapshot = () => read();

export async function fetchCommunity(): Promise<CommunitySeed> {
  await wait(300);
  return read();
}

export interface ThreadBundle {
  thread: CommunityThread;
  replies: ThreadReply[];
  reports: ThreadReport[];
}

export async function fetchThread(id: string): Promise<ThreadBundle | null> {
  await wait(300);
  const d = read();
  const thread = d.threads.find((t) => t.id === id);
  if (!thread) return null;
  return { thread, replies: d.replies.filter((r) => r.threadId === id), reports: d.reports.filter((r) => r.threadId === id) };
}

/** Count a view once per browser session. */
export function recordThreadView(id: string) {
  if (typeof window === "undefined") return;
  const key = `edupro_thread_viewed_${id}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const d = read();
  write({ ...d, threads: d.threads.map((t) => (t.id === id ? { ...t, views: t.views + 1 } : t)) });
}

// ---------------------------------------------------------------- threads
export async function createThread(v: ThreadFormValues): Promise<CommunityThread> {
  await wait();
  const d = read();
  const now = new Date().toISOString();
  const t: CommunityThread = { ...v, title: v.title.trim(), id: uid("thread"), author: CURRENT_MEMBER, isHidden: false, views: 0, likes: 0, createdAt: now, updatedAt: now };
  write({ ...d, threads: [t, ...d.threads] });
  return t;
}

export async function updateThread(id: string, patch: Partial<Omit<CommunityThread, "id" | "author" | "createdAt">>): Promise<CommunityThread> {
  await wait();
  const d = read();
  const cur = d.threads.find((t) => t.id === id);
  if (!cur) throw new Error("This discussion no longer exists.");
  const contentChanged = ["title", "bodyHtml", "category", "courseId", "moduleId", "tags"].some((k) => k in patch);
  const next: CommunityThread = { ...cur, ...patch, updatedAt: contentChanged ? new Date().toISOString() : cur.updatedAt };
  write({ ...d, threads: d.threads.map((t) => (t.id === id ? next : t)) });
  return next;
}

export async function deleteThread(id: string): Promise<void> {
  await wait();
  const d = read();
  write({ threads: d.threads.filter((t) => t.id !== id), replies: d.replies.filter((r) => r.threadId !== id), reports: d.reports.filter((r) => r.threadId !== id) });
}

// ---------------------------------------------------------------- replies
export async function addReply(threadId: string, bodyHtml: string, parentId: string | null = null): Promise<ThreadReply> {
  await wait();
  let d = read();
  const thread = d.threads.find((t) => t.id === threadId);
  if (!thread) throw new Error("This discussion no longer exists.");
  if (thread.isLocked) throw new Error("This discussion is locked. Unlock it to reply.");
  const now = new Date().toISOString();
  // Only one level of nesting: replying to a nested reply attaches to its parent.
  const parent = parentId ? d.replies.find((r) => r.id === parentId) : null;
  const reply: ThreadReply = { id: uid("reply"), threadId, parentId: parent ? parent.parentId ?? parent.id : null, author: CURRENT_MEMBER, bodyHtml, likes: 0, isAccepted: false, isRemoved: false, createdAt: now, updatedAt: now };
  d = touch({ ...d, replies: [...d.replies, reply] }, threadId);
  write(d);
  return reply;
}

export async function updateReply(id: string, bodyHtml: string): Promise<ThreadReply> {
  await wait();
  const d = read();
  const cur = d.replies.find((r) => r.id === id);
  if (!cur) throw new Error("This reply no longer exists.");
  const next = { ...cur, bodyHtml, updatedAt: new Date().toISOString() };
  write({ ...d, replies: d.replies.map((r) => (r.id === id ? next : r)) });
  return next;
}

/** Accept (or un-accept) an answer — at most one accepted reply per thread. */
export async function setAcceptedReply(threadId: string, replyId: string | null): Promise<void> {
  await wait();
  const d = read();
  write({ ...d, replies: d.replies.map((r) => (r.threadId === threadId ? { ...r, isAccepted: r.id === replyId } : r)) });
}

/** Soft-remove (moderation) or restore a reply. */
export async function setReplyRemoved(id: string, removed: boolean): Promise<void> {
  await wait();
  const d = read();
  write({ ...d, replies: d.replies.map((r) => (r.id === id ? { ...r, isRemoved: removed, isAccepted: removed ? false : r.isAccepted } : r)) });
}

export async function deleteReply(id: string): Promise<void> {
  await wait();
  const d = read();
  // Deleting a top-level reply also deletes its nested replies.
  write({ ...d, replies: d.replies.filter((r) => r.id !== id && r.parentId !== id), reports: d.reports.filter((r) => r.targetId !== id) });
}

// ---------------------------------------------------------------- reports
export async function resolveReport(reportId: string, action: "DISMISS" | "REMOVE_CONTENT" | "HIDE_THREAD", note = ""): Promise<void> {
  await wait();
  let d = read();
  const rep = d.reports.find((r) => r.id === reportId);
  if (!rep) throw new Error("This report no longer exists.");
  const status: ReportStatus = action === "DISMISS" ? "DISMISSED" : "ACTIONED";
  // Resolve every open report on the same target together.
  const resolvedAt = new Date().toISOString();
  d = { ...d, reports: d.reports.map((r) => (r.targetId === rep.targetId && r.status === "OPEN" ? { ...r, status, resolutionNote: note.trim() || undefined, resolvedAt } : r)) };
  if (action === "REMOVE_CONTENT" && rep.targetType === "REPLY") d = { ...d, replies: d.replies.map((r) => (r.id === rep.targetId ? { ...r, isRemoved: true, isAccepted: false } : r)) };
  if (action === "HIDE_THREAD" || (action === "REMOVE_CONTENT" && rep.targetType === "THREAD"))
    d = { ...d, threads: d.threads.map((t) => (t.id === rep.threadId ? { ...t, isHidden: true, isLocked: true } : t)) };
  write(d);
}

export function resetCommunityMockData() {
  write(buildCommunitySeed());
}
