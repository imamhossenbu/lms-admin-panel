"use client";

import type { CommunityMember, CommunityRole, CommunityThread, ReportReason, ThreadCategory, ThreadReply, ThreadReport } from "@/types/community";
import type { ThreadFormValues } from "@/validations/communitySchema";
import type { ThreadView } from "@/lib/communityStats";
import { apiClient } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

/**
 * Community data layer, backed by the Community API (`/admin/community*`, workspace-scoped). Function names match
 * the earlier mock store. Reads cache what they fetch (`getCommunitySnapshot`); every write announces
 * COMMUNITY_UPDATED_EVENT. Errors are Axios errors (show them with apiErrorMessage).
 */

export const COMMUNITY_UPDATED_EVENT = "edupro_community_updated";

export type ThreadFlag = "isPinned" | "isLocked" | "isHidden";
/** List row: thread + derived numbers + the course title. */
export type ThreadListItem = ThreadView & { courseTitle: string };
export type RelatedThread = ThreadListItem & { sharedTags: number };

export interface TopContributor {
  member: CommunityMember;
  replies: number;
  accepted: number;
  likes: number;
}

export interface CommunityStats {
  total: number;
  activeThisWeek: number;
  activeDelta: number | null;
  repliesThisWeek: number;
  repliesDelta: number | null;
  unanswered: number;
  flagged: number;
  openReports: number;
  answerRate: number;
}

export interface CommunityOverview {
  stats: CommunityStats;
  medianResponseHours: number | null;
  topContributors: TopContributor[];
  trendingTags: { tag: string; score: number }[];
  categoryCounts: Record<ThreadCategory, number>;
}

export interface ModerationQueueItem {
  view: ThreadListItem;
  count: number;
  reporters: number;
  topReason: ReportReason;
  otherReasons: number;
  latest: string;
}

/** Everything the Community list page shows besides the discussions (which load page by page). */
export interface CommunityData {
  overview: CommunityOverview;
  queue: ModerationQueueItem[];
}

/** Discussions list query, mirrored in the panel URL ("All" / "" = no filter). */
export interface ThreadQuery {
  tab: string;
  sort: string;
  q?: string;
  courseId?: string;
  category?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

export type ThreadTabCounts = Partial<Record<"all" | "unanswered" | "moderation" | "pinned" | "resolved" | "hidden", number>>;

export interface ThreadBundle {
  thread: CommunityThread;
  replies: ThreadReply[];
  reports: ThreadReport[];
}

interface Page<T> {
  data: T[];
  meta: { totalPages: number; total?: number };
}

const enc = encodeURIComponent;
const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(COMMUNITY_UPDATED_EVENT));
const isNotFound = (err: unknown) => (err as { response?: { status?: number } }).response?.status === 404;

const EMPTY_OVERVIEW: CommunityOverview = {
  stats: { total: 0, activeThisWeek: 0, activeDelta: null, repliesThisWeek: 0, repliesDelta: null, unanswered: 0, flagged: 0, openReports: 0, answerRate: 0 },
  medianResponseHours: null,
  topContributors: [],
  trendingTags: [],
  categoryCounts: { QUESTION: 0, DISCUSSION: 0, ANNOUNCEMENT: 0, SHOWCASE: 0, FEEDBACK: 0 },
};
let cache: CommunityData = { overview: EMPTY_OVERVIEW, queue: [] };

async function allPages<T>(url: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data } = await apiClient.get<Page<T>>(url, { params: { ...params, page, limit: 100 } });
    rows.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return rows;
}

// ---------------------------------------------------------------- signed-in member

const toRole = (role: string | undefined): CommunityRole => (role === "STUDENT" ? "STUDENT" : role === "TEACHER" ? "INSTRUCTOR" : "ADMIN");

/** The signed-in admin as a community member (replies and new discussions are posted as them). */
export function useCurrentMember(): CommunityMember {
  const user = useAppSelector((s) => s.auth.user);
  return { id: user?.id ?? "", name: user?.name || "Admin", email: user?.email ?? "", role: toRole(user?.role) };
}

// ---------------------------------------------------------------- reads

export const getCommunitySnapshot = (): CommunityData => cache;

/** Stats / sidebar cards + the moderation queue. */
export async function fetchCommunity(): Promise<CommunityData> {
  const [overview, queue] = await Promise.all([
    apiClient.get<CommunityOverview>("/admin/community/stats").then((r) => r.data),
    apiClient.get<ModerationQueueItem[]>("/admin/community/moderation-queue").then((r) => r.data),
  ]);
  cache = { overview, queue };
  return cache;
}

const threadParams = (q: Omit<ThreadQuery, "page" | "limit">) => {
  const params: Record<string, unknown> = { tab: q.tab, sort: q.sort };
  for (const k of ["q", "courseId", "category", "from", "to"] as const) {
    const v = q[k]?.trim();
    if (v && v !== "All") params[k] = v;
  }
  return params;
};

/** One page of discussions for the tab / filters / sort, plus every tab's count for the same filters. */
export async function fetchThreadsPage(q: ThreadQuery): Promise<{ rows: ThreadListItem[]; total: number; counts: ThreadTabCounts }> {
  const { data } = await apiClient.get<Page<ThreadListItem> & { counts?: ThreadTabCounts }>("/admin/community/threads", { params: { ...threadParams(q), page: q.page, limit: q.limit } });
  return { rows: data.data, total: data.meta.total ?? data.data.length, counts: data.counts ?? {} };
}

/** Every discussion matching the query (CSV export). */
export function fetchAllThreads(q: Omit<ThreadQuery, "page" | "limit">): Promise<ThreadListItem[]> {
  return allPages<ThreadListItem>("/admin/community/threads", threadParams(q));
}

/** Thread page bundle, or null when it isn't in this workspace. */
export async function fetchThread(id: string): Promise<ThreadBundle | null> {
  try {
    return (await apiClient.get<ThreadBundle>(`/admin/community/threads/${enc(id)}`)).data;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** "Similar Discussions" sidebar: same course, shared tags first (max 4). */
export async function fetchRelatedThreads(id: string): Promise<RelatedThread[]> {
  return (await apiClient.get<RelatedThread[]>(`/admin/community/threads/${enc(id)}/related`)).data;
}

/** Form duplicate check: up to 3 same-course discussions with overlapping title words. */
export async function fetchSimilarThreads(title: string, courseId: string, excludeId?: string): Promise<CommunityThread[]> {
  const { data } = await apiClient.get<CommunityThread[]>("/admin/community/similar", { params: { title, courseId, ...(excludeId && { excludeId }) } });
  return data;
}

/** Count a view once per browser session (fire and forget). */
export function recordThreadView(id: string) {
  if (typeof window === "undefined") return;
  const key = `edupro_thread_viewed_${id}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // storage disabled: still count it
  }
  void apiClient.post(`/admin/community/threads/${enc(id)}/view`).catch(() => undefined);
}

// ---------------------------------------------------------------- threads

/** Posted as the signed-in admin. */
export async function createThread(v: ThreadFormValues): Promise<CommunityThread> {
  const { data } = await apiClient.post<CommunityThread>("/admin/community/threads", v);
  announce();
  return data;
}

const FORM_KEYS = ["title", "bodyHtml", "category", "courseId", "moduleId", "tags", "isPinned", "isLocked"] as const;

/** Form edits go to PATCH /threads/:id; pin / lock / hide toggles go to PATCH /threads/:id/flags. */
export async function updateThread(
  id: string,
  patch: Partial<Pick<CommunityThread, (typeof FORM_KEYS)[number] | ThreadFlag>>
): Promise<CommunityThread> {
  const isFormEdit = "title" in patch || "bodyHtml" in patch;
  const pick = (keys: readonly string[]) => Object.fromEntries(Object.entries(patch).filter(([k]) => keys.includes(k)));
  let result = isFormEdit ? (await apiClient.patch<CommunityThread>(`/admin/community/threads/${enc(id)}`, pick(FORM_KEYS))).data : null;
  const flags = pick(isFormEdit ? ["isHidden"] : ["isPinned", "isLocked", "isHidden"]);
  if (Object.keys(flags).length) result = (await apiClient.patch<CommunityThread>(`/admin/community/threads/${enc(id)}/flags`, flags)).data;
  announce();
  if (!result) throw new Error("Nothing to update.");
  return result;
}

/** Bulk pin / lock / hide; resolves how many changed. */
export async function bulkSetThreadFlag(ids: string[], flag: ThreadFlag, value: boolean): Promise<number> {
  const { data } = await apiClient.post<{ updated: number }>("/admin/community/threads/bulk-flag", { ids, flag, value });
  announce();
  return data.updated;
}

/** Deletes the discussion with its replies and reports. */
export async function deleteThread(id: string): Promise<void> {
  await apiClient.delete(`/admin/community/threads/${enc(id)}`);
  announce();
}

export async function bulkDeleteThreads(ids: string[]): Promise<number> {
  const { data } = await apiClient.post<{ deleted: number }>("/admin/community/threads/bulk-delete", { ids });
  announce();
  return data.deleted;
}

// ---------------------------------------------------------------- replies

/** Reply as the signed-in admin (replying to a nested reply attaches to its parent). */
export async function addReply(threadId: string, bodyHtml: string, parentId: string | null = null): Promise<ThreadReply> {
  const { data } = await apiClient.post<ThreadReply>(`/admin/community/threads/${enc(threadId)}/replies`, { bodyHtml, ...(parentId && { parentId }) });
  announce();
  return data;
}

export async function updateReply(id: string, bodyHtml: string): Promise<ThreadReply> {
  const { data } = await apiClient.patch<ThreadReply>(`/admin/community/replies/${enc(id)}`, { bodyHtml });
  announce();
  return data;
}

/** Accept (or clear with null) the answer of a question — at most one per thread. */
export async function setAcceptedReply(threadId: string, replyId: string | null): Promise<void> {
  await apiClient.put(`/admin/community/threads/${enc(threadId)}/accepted-reply`, { replyId });
  announce();
}

/** Soft-remove (moderation) or restore a reply. */
export async function setReplyRemoved(id: string, removed: boolean): Promise<void> {
  await apiClient.patch(`/admin/community/replies/${enc(id)}/removed`, { removed });
  announce();
}

/** Deletes a reply and its nested replies. */
export async function deleteReply(id: string): Promise<void> {
  await apiClient.delete(`/admin/community/replies/${enc(id)}`);
  announce();
}

// ---------------------------------------------------------------- reports

/** Resolves every open report on the same target. */
export async function resolveReport(reportId: string, action: "DISMISS" | "REMOVE_CONTENT" | "HIDE_THREAD", note = ""): Promise<void> {
  await apiClient.post(`/admin/community/reports/${enc(reportId)}/resolve`, { action, note });
  announce();
}
