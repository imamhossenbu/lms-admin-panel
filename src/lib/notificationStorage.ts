"use client";

import { useEffect, useState } from "react";
import type {
  AdminNotification,
  Broadcast,
  BroadcastAudience,
  BroadcastDelivery,
  NotificationChannel,
  NotificationTemplateItem,
} from "@/types/notification";
import type { BroadcastFormValues, TemplateEditorValues } from "@/validations/notificationSchema";
import { apiClient } from "@/lib/api";

/**
 * Notifications data layer, backed by the Notifications API (`/admin/notifications*`). Function names match the
 * earlier mock store. One in-memory store (inbox, broadcasts, templates, broadcast overview) feeds the navbar bell,
 * the sidebar badge and /notifications, so marking something read updates every place at once. Inbox reads/archives
 * are optimistic (rolled back on failure). Every change announces NOTIFICATIONS_UPDATED_EVENT. Errors are Axios
 * errors (show them with apiErrorMessage).
 */

export const NOTIFICATIONS_UPDATED_EVENT = "edupro_notifications_updated";

/** A broadcast row as the list returns it. */
export interface BroadcastListItem extends Broadcast {
  /** Unique recipients (sent) or the live estimate (not sent yet). */
  recipients: number;
  /** Open rate % for sent broadcasts, null otherwise. */
  openRate: number | null;
  courses: { id: string; title: string }[];
}

export interface DeliveryStats {
  total: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  recipients: number;
}

export interface BroadcastDetail {
  broadcast: Broadcast;
  courses: { id: string; title: string }[];
  /** Recipients estimate for unsent broadcasts; unique recipients for sent ones. */
  recipients: number;
  stats: DeliveryStats;
  byChannel: (DeliveryStats & { channel: NotificationChannel })[];
  opensTimeline: { label: string; opens: number }[];
}

export interface BroadcastOverview {
  sentLast30: number;
  scheduled: number;
  drafts: number;
  avgOpenRate: number;
  avgClickRate: number;
  reached: number;
}

export type NotificationsPart = "inbox" | "broadcasts" | "templates";

/** Inbox counters from GET /admin/notifications/inbox/stats (bell, sidebar badge, tab count, filter rail). */
export interface InboxCounters {
  total: number;
  unread: number;
  highPriority: number;
  archived: number;
  unreadByCategory: Partial<Record<string, number>>;
}

export const EMPTY_INBOX_COUNTERS: InboxCounters = { total: 0, unread: 0, highPriority: 0, archived: 0, unreadByCategory: {} };

export interface NotificationsData {
  /** The latest notifications (bell dropdown); the Inbox tab reads its own pages. */
  inbox: AdminNotification[];
  inboxCounters: InboxCounters;
  /** Unused since the Broadcasts tab pages on the server (kept empty for older callers). */
  broadcasts: BroadcastListItem[];
  templates: NotificationTemplateItem[];
  overview: BroadcastOverview;
  /** Which parts have loaded at least once (or failed to). */
  loaded: Record<NotificationsPart, boolean>;
}

interface Page<T> {
  data: T[];
  meta: { totalPages: number; total: number };
}

const BASE = "/admin/notifications";
const enc = encodeURIComponent;
const is404 = (err: unknown) => (err as { response?: { status?: number } }).response?.status === 404;

const EMPTY_OVERVIEW: BroadcastOverview = { sentLast30: 0, scheduled: 0, drafts: 0, avgOpenRate: 0, avgClickRate: 0, reached: 0 };
export const EMPTY_NOTIFICATIONS: NotificationsData = {
  inbox: [],
  inboxCounters: EMPTY_INBOX_COUNTERS,
  broadcasts: [],
  templates: [],
  overview: EMPTY_OVERVIEW,
  loaded: { inbox: false, broadcasts: false, templates: false },
};

// ---------------------------------------------------------------- store
let state: NotificationsData = EMPTY_NOTIFICATIONS;
const listeners = new Set<() => void>();
const inFlight = new Map<NotificationsPart, Promise<void>>();

function setState(next: Partial<NotificationsData>) {
  state = { ...state, ...next };
  // Deferred so a load that resolves while another component renders never updates "during render".
  queueMicrotask(() => {
    listeners.forEach((l) => l());
    if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  });
}

/** useSyncExternalStore subscribe. */
export function subscribeNotifications(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

async function allPages<T>(url: string, params: Record<string, unknown> = {}, maxPages = 50): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const { data } = await apiClient.get<Page<T>>(url, { params: { ...params, page, limit: 100 } });
    rows.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return rows;
}

/** How many of the latest notifications the bell dropdown keeps. */
const RECENT_LIMIT = 10;

const LOADERS: Record<NotificationsPart, () => Promise<Partial<NotificationsData>>> = {
  // Bell / badge / counters: the latest few + server counters (never the whole inbox).
  inbox: async () => {
    const [recent, counters] = await Promise.all([
      apiClient.get<Page<AdminNotification>>(`${BASE}/inbox`, { params: { status: "all", page: 1, limit: RECENT_LIMIT } }).then((r) => r.data.data),
      apiClient.get<InboxCounters>(`${BASE}/inbox/stats`).then((r) => r.data),
    ]);
    return { inbox: recent, inboxCounters: counters };
  },
  // Overview cards only; the table pages through fetchBroadcastPage.
  broadcasts: async () => ({ overview: (await apiClient.get<BroadcastOverview>(`${BASE}/broadcasts/overview`)).data }),
  templates: async () => ({ templates: (await apiClient.get<NotificationTemplateItem[]>(`${BASE}/templates`)).data }),
};

/** (Re)loads the given parts. A failed load keeps the last data and still flips `loaded` so screens leave their skeleton. */
export function refreshNotifications(parts: NotificationsPart[] = ["inbox", "broadcasts", "templates"]): Promise<void> {
  return Promise.all(
    parts.map((part) => {
      const running = inFlight.get(part);
      if (running) return running;
      const job = LOADERS[part]()
        .then(
          (patch) => setState({ ...patch, loaded: { ...state.loaded, [part]: true } }),
          (err) => {
            setState({ loaded: { ...state.loaded, [part]: true } });
            throw err;
          }
        )
        .finally(() => inFlight.delete(part));
      inFlight.set(part, job);
      return job;
    })
  ).then(() => undefined);
}

/** Loads the parts that haven't been loaded yet. */
export const ensureNotifications = (parts: NotificationsPart[]) => refreshNotifications(parts.filter((p) => !state.loaded[p]));

// ---------------------------------------------------------------- reads
export const getNotificationsSnapshot = (): NotificationsData => state;
/** Unread, non-archived inbox count (sidebar badge, navbar dot). */
/** Unread (not archived) count from the server counters. */
export const getUnreadCount = () => state.inboxCounters.unread;

export interface InboxPageQuery {
  page: number;
  limit: number;
  status: "all" | "unread" | "archived";
  category?: string;
  highOnly?: boolean;
  q?: string;
}

/** One page of the inbox (filters and search on the server, newest first). */
export async function fetchInboxPage(query: InboxPageQuery): Promise<{ data: AdminNotification[]; total: number }> {
  const { data } = await apiClient.get<Page<AdminNotification>>(`${BASE}/inbox`, {
    params: {
      page: query.page,
      limit: query.limit,
      status: query.status,
      ...(query.category && { category: query.category }),
      ...(query.highOnly && { priority: "HIGH" }),
      ...(query.q?.trim() && { q: query.q.trim() }),
    },
  });
  return { data: data.data, total: data.meta.total };
}

export interface BroadcastPageQuery {
  page: number;
  limit: number;
  q?: string;
  status?: string;
  audience?: string;
  channel?: string;
}

/** One page of broadcasts (search / status / audience / channel on the server). */
export async function fetchBroadcastPage(query: BroadcastPageQuery): Promise<{ data: BroadcastListItem[]; total: number }> {
  const { data } = await apiClient.get<Page<BroadcastListItem>>(`${BASE}/broadcasts`, {
    params: {
      page: query.page,
      limit: query.limit,
      ...(query.q?.trim() && { q: query.q.trim() }),
      ...(query.status && { status: query.status }),
      ...(query.audience && { audience: query.audience }),
      ...(query.channel && { channel: query.channel }),
    },
  });
  return { data: data.data, total: data.meta.total };
}

export async function fetchNotifications(): Promise<NotificationsData> {
  await refreshNotifications();
  return state;
}

/** A broadcast with its delivery analytics and every delivery row, or null when it isn't in this workspace. */
export async function fetchBroadcast(id: string): Promise<{ broadcast: Broadcast; detail: BroadcastDetail; deliveries: BroadcastDelivery[] } | null> {
  try {
    const [detail, deliveries] = await Promise.all([
      apiClient.get<BroadcastDetail>(`${BASE}/broadcasts/${enc(id)}`).then((r) => r.data),
      allPages<BroadcastDelivery>(`${BASE}/broadcasts/${enc(id)}/deliveries`),
    ]);
    return { broadcast: detail.broadcast, detail, deliveries };
  } catch (err) {
    if (is404(err)) return null;
    throw err;
  }
}

export async function fetchTemplateItem(id: string): Promise<NotificationTemplateItem | null> {
  try {
    return (await apiClient.get<NotificationTemplateItem>(`${BASE}/templates/${enc(id)}`)).data;
  } catch (err) {
    if (is404(err)) return null;
    throw err;
  }
}

// ---------------------------------------------------------------- inbox
/** Optimistic inbox patch: applies locally, calls the API, rolls back (and rethrows) on failure. */
async function patchInbox(ids: string[] | "all", patch: Partial<AdminNotification>, call: () => Promise<unknown>) {
  const before = state.inbox;
  const hit = (n: AdminNotification) => (ids === "all" ? !n.isArchived : ids.includes(n.id));
  setState({ inbox: before.map((n) => (hit(n) ? { ...n, ...patch } : n)) });
  try {
    await call();
  } catch (err) {
    setState({ inbox: before });
    throw err;
  }
  // Counters (bell, badge, rail) and the latest list come from the server again; the Inbox tab re-reads its page.
  await refreshNotifications(["inbox"]).catch(() => undefined);
}

export const markRead = (ids: string[] | "all", isRead = true) =>
  patchInbox(ids, { isRead }, () => apiClient.patch(`${BASE}/inbox/read`, { ids, isRead }));

/** Archiving also marks read. */
export const archiveNotifications = (ids: string[], isArchived = true) =>
  patchInbox(ids, isArchived ? { isArchived, isRead: true } : { isArchived }, () => apiClient.patch(`${BASE}/inbox/archive`, { ids, isArchived }));

export async function deleteNotifications(ids: string[]) {
  await apiClient.post(`${BASE}/inbox/delete`, { ids });
  setState({ inbox: state.inbox.filter((n) => !ids.includes(n.id)) });
  await refreshNotifications(["inbox"]).catch(() => undefined);
}

// ---------------------------------------------------------------- broadcasts
const estimateCache = new Map<string, number>();
const estimateKey = (audience: BroadcastAudience, courseIds: string[]) => (audience === "COURSE" ? `COURSE:${[...courseIds].sort().join(",")}` : audience);

/** Recipient count for an audience (live from the API). */
export async function estimateRecipients(audience: BroadcastAudience, courseIds: string[]): Promise<number> {
  const key = estimateKey(audience, courseIds);
  const hit = estimateCache.get(key);
  if (hit !== undefined) return hit;
  if (audience === "COURSE" && !courseIds.length) return 0;
  const params = { audience, ...(audience === "COURSE" ? { courseIds: courseIds.join(",") } : {}) };
  const { data } = await apiClient.get<{ recipients: number }>(`${BASE}/broadcasts/estimate`, { params });
  estimateCache.set(key, data.recipients);
  return data.recipients;
}

/** Live recipient estimate for the compose screens; null while the first count loads. */
export function useRecipientEstimate(audience: BroadcastAudience, courseIds: string[]): number | null {
  const key = estimateKey(audience, courseIds);
  const [result, setResult] = useState<{ key: string; count: number } | null>(null);
  useEffect(() => {
    let alive = true;
    estimateRecipients(audience, courseIds).then(
      (count) => alive && setResult({ key, count }),
      () => alive && setResult({ key, count: 0 })
    );
    return () => {
      alive = false;
    };
    // `key` captures audience + courseIds
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const cached = estimateCache.get(key);
  return cached ?? (result?.key === key ? result.count : null);
}

/** Datetime-local → ISO (the browser's time zone is the one the admin picked in); "" stays "". */
const scheduleIso = (local: string) => {
  const t = Date.parse(local);
  return Number.isNaN(t) ? "" : new Date(t).toISOString();
};

const toPayload = (v: BroadcastFormValues) => ({
  title: v.title.trim(),
  messageHtml: v.messageHtml,
  audience: v.audience,
  courseIds: v.audience === "COURSE" ? v.courseIds : [],
  channels: v.channels,
  priority: v.priority,
  ctaLabel: v.ctaLabel.trim(),
  ctaUrl: v.ctaUrl.trim(),
  timing: v.timing,
  scheduledAt: v.timing === "SCHEDULE" ? scheduleIso(v.scheduledAt) : "",
});

/** Re-reads the broadcast list + overview (and the inbox: a send may notify the admin too). */
const afterBroadcastChange = () => void refreshNotifications(["broadcasts", "inbox"]).catch(() => {});

/** Send now, schedule, or save as draft (asDraft). */
export async function saveBroadcast(v: BroadcastFormValues, opts: { id?: string; asDraft?: boolean } = {}): Promise<BroadcastListItem> {
  const body = { ...toPayload(v), asDraft: !!opts.asDraft };
  const { data } = opts.id
    ? await apiClient.patch<BroadcastListItem>(`${BASE}/broadcasts/${enc(opts.id)}`, body)
    : await apiClient.post<BroadcastListItem>(`${BASE}/broadcasts`, body);
  afterBroadcastChange();
  return data;
}

export async function cancelBroadcast(id: string): Promise<BroadcastListItem> {
  const { data } = await apiClient.post<BroadcastListItem>(`${BASE}/broadcasts/${enc(id)}/cancel`);
  afterBroadcastChange();
  return data;
}

export async function duplicateBroadcast(id: string): Promise<BroadcastListItem> {
  const { data } = await apiClient.post<BroadcastListItem>(`${BASE}/broadcasts/${enc(id)}/duplicate`);
  afterBroadcastChange();
  return data;
}

export async function deleteBroadcast(id: string) {
  await apiClient.delete(`${BASE}/broadcasts/${enc(id)}`);
  afterBroadcastChange();
}

/** Re-sends failed e-mail deliveries; resolves to how many were retried. */
export async function retryFailedDeliveries(broadcastId: string): Promise<number> {
  const { data } = await apiClient.post<{ retried: number }>(`${BASE}/broadcasts/${enc(broadcastId)}/retry`);
  afterBroadcastChange();
  return data.retried;
}

// ---------------------------------------------------------------- automated templates
const putTemplate = (t: NotificationTemplateItem) => setState({ templates: state.templates.map((x) => (x.id === t.id ? t : x)) });

export async function updateTemplateItem(id: string, v: TemplateEditorValues): Promise<NotificationTemplateItem> {
  const { data } = await apiClient.patch<NotificationTemplateItem>(`${BASE}/templates/${enc(id)}`, v);
  putTemplate(data);
  return data;
}

export async function setTemplateEnabled(id: string, enabled: boolean): Promise<NotificationTemplateItem> {
  const { data } = await apiClient.patch<NotificationTemplateItem>(`${BASE}/templates/${enc(id)}/enabled`, { enabled });
  putTemplate(data);
  return data;
}

export type TestTarget =
  | { kind: "template"; id: string }
  | { kind: "broadcast"; values: Pick<BroadcastFormValues, "title" | "messageHtml" | "ctaLabel" | "ctaUrl"> };

/** E-mails a test to the signed-in admin; resolves to the address it went to. */
export async function sendTestNotification(target: TestTarget): Promise<string> {
  const { data } =
    target.kind === "template"
      ? await apiClient.post<{ email: string }>(`${BASE}/templates/${enc(target.id)}/test`)
      : await apiClient.post<{ email: string }>(`${BASE}/broadcasts/test`, {
          title: target.values.title.trim(),
          messageHtml: target.values.messageHtml,
          ctaLabel: target.values.ctaLabel.trim(),
          ctaUrl: target.values.ctaUrl.trim(),
        });
  void refreshNotifications(["inbox"]).catch(() => {});
  return data.email;
}
