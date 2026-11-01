import type { AdminNotification, Broadcast, BroadcastDelivery, NotificationTemplateItem } from "@/types/notification";
import type { BroadcastFormValues, TemplateEditorValues } from "@/validations/notificationSchema";
import { buildNotificationSeed, type NotificationSeed } from "@/data/mockNotificationData";

/**
 * Mock-first persistence for Notifications (localStorage + simulated latency).
 * The navbar dropdown, the sidebar badge and /notifications all read this store and listen to
 * NOTIFICATIONS_UPDATED_EVENT, so marking something read updates every place at once.
 */

const STORAGE_KEY = "edupro_notifications_v1";
export const NOTIFICATIONS_UPDATED_EVENT = "edupro_notifications_updated";
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function read(): NotificationSeed {
  if (typeof window === "undefined") return buildNotificationSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as NotificationSeed;
      if (Array.isArray(p?.inbox) && Array.isArray(p?.broadcasts) && Array.isArray(p?.deliveries) && Array.isArray(p?.templates)) return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildNotificationSeed();
  write(seed);
  return seed;
}

function write(d: NotificationSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}

// ---------------------------------------------------------------- reads
export const getNotificationsSnapshot = () => read();
/** Unread, non-archived inbox count (sidebar badge, navbar dot). Stable number for useSyncExternalStore. */
export const getUnreadCount = () => read().inbox.filter((n) => !n.isRead && !n.isArchived).length;
export async function fetchNotifications(): Promise<NotificationSeed> {
  await wait(250);
  return read();
}
export async function fetchBroadcast(id: string) {
  await wait(300);
  const d = read();
  const broadcast = d.broadcasts.find((b) => b.id === id);
  return broadcast ? { broadcast, deliveries: d.deliveries.filter((x) => x.broadcastId === id) } : null;
}
export async function fetchTemplateItem(id: string) {
  await wait(250);
  return read().templates.find((t) => t.id === id) ?? null;
}

// ---------------------------------------------------------------- inbox
const patchInbox = (ids: string[] | "all", patch: Partial<AdminNotification>) => {
  const d = read();
  write({ ...d, inbox: d.inbox.map((n) => (ids === "all" || ids.includes(n.id) ? { ...n, ...patch } : n)) });
};
/** Instant (no latency) so clicking a notification feels immediate. */
export const markRead = (ids: string[] | "all", isRead = true) => patchInbox(ids, { isRead });
export const archiveNotifications = (ids: string[], isArchived = true) => patchInbox(ids, { isArchived, isRead: true });
export async function deleteNotifications(ids: string[]) {
  await wait();
  const d = read();
  write({ ...d, inbox: d.inbox.filter((n) => !ids.includes(n.id)) });
}

// ---------------------------------------------------------------- broadcasts
/** Recipient count for an audience (mock directory sizes; COURSE = 32 per course). */
export function estimateRecipients(audience: Broadcast["audience"], courseIds: string[]) {
  return audience === "ALL_STUDENTS" ? 60 : audience === "INSTRUCTORS" ? 8 : audience === "INACTIVE_STUDENTS" ? 24 : courseIds.length * 32;
}

const toBroadcast = (v: BroadcastFormValues): Omit<Broadcast, "id" | "createdAt" | "createdBy"> => ({
  title: v.title.trim(),
  messageHtml: v.messageHtml,
  audience: v.audience,
  courseIds: v.audience === "COURSE" ? v.courseIds : [],
  channels: v.channels,
  priority: v.priority,
  ctaLabel: v.ctaLabel.trim(),
  ctaUrl: v.ctaUrl.trim(),
  status: v.timing === "SCHEDULE" ? "SCHEDULED" : "SENT",
  sendAt: v.timing === "SCHEDULE" ? safeIso(v.scheduledAt) : new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/** ISO string for a datetime-local value, or null when it's empty/invalid (drafts may have no time yet). */
const safeIso = (value: string) => {
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
};

/** Mock delivery: everyone receives it instantly; opens arrive later (none yet). */
function deliver(b: Broadcast): BroadcastDelivery[] {
  const n = estimateRecipients(b.audience, b.courseIds);
  const now = new Date().toISOString();
  return Array.from({ length: n }).flatMap((_, r) =>
    b.channels.map((channel) => ({
      id: `${b.id}-${channel}-${r}`,
      broadcastId: b.id,
      recipient: { id: `rcp-new-${r}`, name: `Recipient ${r + 1}`, email: `recipient${r + 1}@example.com` },
      channel,
      status: "DELIVERED" as const,
      error: "",
      deliveredAt: now,
      openedAt: null,
      clickedAt: null,
    }))
  );
}

/** Send now, schedule, or save as draft (asDraft). */
export async function saveBroadcast(v: BroadcastFormValues, opts: { id?: string; asDraft?: boolean } = {}): Promise<Broadcast> {
  await wait(600);
  const d = read();
  const existing = opts.id ? d.broadcasts.find((b) => b.id === opts.id) : undefined;
  if (opts.id && !existing) throw new Error("This broadcast no longer exists.");
  if (existing && existing.status === "SENT") throw new Error("Sent broadcasts can't be edited. Duplicate it instead.");
  const fields = toBroadcast(v);
  const next: Broadcast = {
    ...(existing ?? { id: uid("bc"), createdAt: new Date().toISOString(), createdBy: "Admin" }),
    ...fields,
    ...(opts.asDraft ? { status: "DRAFT" as const, sendAt: v.timing === "SCHEDULE" ? safeIso(v.scheduledAt) : null } : {}),
  } as Broadcast;
  const broadcasts = existing ? d.broadcasts.map((b) => (b.id === next.id ? next : b)) : [next, ...d.broadcasts];
  write({ ...d, broadcasts, deliveries: next.status === "SENT" ? [...d.deliveries, ...deliver(next)] : d.deliveries });
  return next;
}

export async function cancelBroadcast(id: string) {
  await wait();
  const d = read();
  write({ ...d, broadcasts: d.broadcasts.map((b) => (b.id === id && b.status === "SCHEDULED" ? { ...b, status: "CANCELLED", updatedAt: new Date().toISOString() } : b)) });
}

export async function duplicateBroadcast(id: string): Promise<Broadcast> {
  await wait();
  const d = read();
  const src = d.broadcasts.find((b) => b.id === id);
  if (!src) throw new Error("This broadcast no longer exists.");
  const now = new Date().toISOString();
  const copy: Broadcast = { ...structuredClone(src), id: uid("bc"), title: `${src.title} (Copy)`.slice(0, 100), status: "DRAFT", sendAt: null, createdAt: now, updatedAt: now };
  write({ ...d, broadcasts: [copy, ...d.broadcasts] });
  return copy;
}

export async function deleteBroadcast(id: string) {
  await wait();
  const d = read();
  const b = d.broadcasts.find((x) => x.id === id);
  if (b?.status === "SENT") throw new Error("Sent broadcasts are kept for reporting and can't be deleted.");
  write({ ...d, broadcasts: d.broadcasts.filter((x) => x.id !== id) });
}

/** Retry failed deliveries (mock: they succeed). */
export async function retryFailedDeliveries(broadcastId: string): Promise<number> {
  await wait(700);
  const d = read();
  let n = 0;
  const now = new Date().toISOString();
  write({
    ...d,
    deliveries: d.deliveries.map((x) => (x.broadcastId === broadcastId && x.status === "FAILED" ? (n++, { ...x, status: "DELIVERED", error: "", deliveredAt: now }) : x)),
  });
  return n;
}

// ---------------------------------------------------------------- automated templates
export async function updateTemplateItem(id: string, v: TemplateEditorValues): Promise<NotificationTemplateItem> {
  await wait();
  const d = read();
  const cur = d.templates.find((t) => t.id === id);
  if (!cur) throw new Error("This template no longer exists.");
  if (cur.locked && !v.enabled) throw new Error("Security emails can't be turned off.");
  const next = { ...cur, ...v, enabled: cur.locked ? true : v.enabled, updatedAt: new Date().toISOString() };
  write({ ...d, templates: d.templates.map((t) => (t.id === id ? next : t)) });
  return next;
}

export async function setTemplateEnabled(id: string, enabled: boolean) {
  const d = read();
  const cur = d.templates.find((t) => t.id === id);
  if (!cur) throw new Error("This template no longer exists.");
  if (cur.locked && !enabled) throw new Error("Security emails can't be turned off.");
  await wait(250);
  write({ ...d, templates: d.templates.map((t) => (t.id === id ? { ...t, enabled, updatedAt: new Date().toISOString() } : t)) });
}

/** Mock "send test" to the admin. */
export async function sendTestNotification(): Promise<string> {
  await wait(700);
  return "admin@edupro.com";
}

export function resetNotificationMockData() {
  write(buildNotificationSeed());
}
