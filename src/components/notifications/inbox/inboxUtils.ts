import type { AdminNotification, NotificationCategory } from "@/types/notification";
import { CATEGORY_META, NOTIFICATION_CATEGORIES } from "../shared/CategoryIcon";

export type InboxStatus = "all" | "unread" | "archived";
export type InboxCategoryFilter = NotificationCategory | "ALL";

export interface InboxFilters {
  q: string;
  category: InboxCategoryFilter;
  status: InboxStatus;
  highOnly: boolean;
}

export const INBOX_STATUS_OPTIONS: { value: InboxStatus; label: string }[] = [
  { value: "unread", label: "Unread" },
  { value: "all", label: "All" },
  { value: "archived", label: "Archived" },
];

/** URL keys owned by the inbox (cleared together by Reset). */
export const INBOX_FILTER_KEYS = { q: null, category: null, status: null, priority: null, page: null } as const;
export const INBOX_PAGE_SIZE = 20;

export const parseInboxStatus = (v: string): InboxStatus => (v === "unread" || v === "archived" ? v : "all");
export const parseInboxCategory = (v: string): InboxCategoryFilter => NOTIFICATION_CATEGORIES.find((c) => CATEGORY_META[c].param === v) ?? "ALL";
export const categoryParam = (c: InboxCategoryFilter) => (c === "ALL" ? null : CATEGORY_META[c].param);

export const isInboxFiltered = (f: InboxFilters) => !!f.q.trim() || f.category !== "ALL" || f.status !== "all" || f.highOnly;

/** Newest first, then status / category / priority / search. */
export function applyInboxFilters(inbox: AdminNotification[], f: InboxFilters) {
  const q = f.q.trim().toLowerCase();
  return inbox
    .filter((n) => (f.status === "archived" ? n.isArchived : !n.isArchived && (f.status === "all" || !n.isRead)))
    .filter((n) => f.category === "ALL" || n.category === f.category)
    .filter((n) => !f.highOnly || n.priority === "HIGH")
    .filter((n) => !q || `${n.title} ${n.message} ${CATEGORY_META[n.category].label}`.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
