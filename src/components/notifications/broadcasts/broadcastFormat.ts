import type { Broadcast, BroadcastAudience, BroadcastDelivery, BroadcastStatus, DeliveryStatus, NotificationChannel } from "@/types/notification";
import type { Tone } from "@/components/ui/ToneBadge";
import { getCourseContext } from "@/data/mockCourseCatalog";
import { deliveryStats, timeAgo } from "@/lib/notificationStats";
import { estimateRecipients } from "@/lib/notificationStorage";

/** Formatting + filtering helpers shared by the Broadcasts tab and the broadcast detail page. */

export const BROADCAST_STATUS_META: Record<BroadcastStatus, { label: string; tone: Tone }> = {
  SENT: { label: "Sent", tone: "green" },
  SCHEDULED: { label: "Scheduled", tone: "blue" },
  DRAFT: { label: "Draft", tone: "gray" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; tone: Tone }> = {
  DELIVERED: { label: "Delivered", tone: "gray" },
  OPENED: { label: "Opened", tone: "blue" },
  CLICKED: { label: "Clicked", tone: "green" },
  FAILED: { label: "Failed", tone: "red" },
};

export const AUDIENCE_LABEL: Record<BroadcastAudience, string> = {
  ALL_STUDENTS: "All students",
  COURSE: "Course students",
  INSTRUCTORS: "Instructors",
  INACTIVE_STUDENTS: "Inactive students",
};

export const courseTitles = (b: Pick<Broadcast, "courseIds">) => b.courseIds.map((id) => getCourseContext(id).course.title);

/** "All students" / "HTML Fundamentals" / "HTML Fundamentals +1 more" / "Instructors" … */
export function audienceLabel(b: Pick<Broadcast, "audience" | "courseIds">, opts: { short?: boolean } = {}) {
  if (b.audience !== "COURSE") return AUDIENCE_LABEL[b.audience];
  const titles = courseTitles(b);
  if (!titles.length) return "No course selected";
  if (opts.short && titles.length > 1) return `${titles[0]} +${titles.length - 1} more`;
  return titles.join(", ");
}

export const canEditBroadcast = (b: Pick<Broadcast, "status">) => b.status === "DRAFT" || b.status === "SCHEDULED";
export const canDeleteBroadcast = (b: Pick<Broadcast, "status">) => b.status === "DRAFT" || b.status === "CANCELLED";
export const canCancelBroadcast = (b: Pick<Broadcast, "status">) => b.status === "SCHEDULED";

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export const formatShortDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** Past → timeAgo ("3h ago"); future → "in 45m" / "in 5h" / "in 2 days". */
export function relativeTime(iso: string, now: Date = new Date()) {
  const diff = new Date(iso).getTime() - now.getTime();
  if (diff <= 0) return timeAgo(iso, now);
  const m = Math.ceil(diff / 60000);
  if (m < 60) return `in ${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `in ${h}h`;
  const d = Math.round(h / 24);
  return `in ${d} ${d === 1 ? "day" : "days"}`;
}

export const errorMessage = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");

// ---------------------------------------------------------------- table rows
export interface BroadcastRow {
  id: string;
  broadcast: Broadcast;
  audienceText: string;
  /** Unique recipients (sent) or the estimate (not sent yet). */
  recipients: number;
  /** Open rate % for sent broadcasts, null otherwise. */
  openRate: number | null;
  sortAt: number;
}

export function toBroadcastRows(broadcasts: Broadcast[], deliveries: BroadcastDelivery[]): BroadcastRow[] {
  const byBroadcast = new Map<string, BroadcastDelivery[]>();
  deliveries.forEach((d) => byBroadcast.set(d.broadcastId, [...(byBroadcast.get(d.broadcastId) ?? []), d]));
  return broadcasts
    .map((b) => {
      const sent = b.status === "SENT";
      const stats = sent ? deliveryStats(byBroadcast.get(b.id) ?? []) : null;
      return {
        id: b.id,
        broadcast: b,
        audienceText: audienceLabel(b, { short: true }),
        recipients: stats ? stats.recipients : estimateRecipients(b.audience, b.courseIds),
        openRate: stats ? stats.openRate : null,
        sortAt: new Date(b.sendAt ?? b.updatedAt).getTime(),
      };
    })
    .sort((a, b) => b.sortAt - a.sortAt);
}

export interface BroadcastFilters {
  query: string;
  status: string;
  audience: string;
  channel: string;
}

export const isBroadcastFiltered = (f: BroadcastFilters) => Boolean(f.query.trim()) || f.status !== "All" || f.audience !== "All" || f.channel !== "All";

export function filterBroadcastRows(rows: BroadcastRow[], f: BroadcastFilters) {
  const q = f.query.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!q || r.broadcast.title.toLowerCase().includes(q) || audienceLabel(r.broadcast).toLowerCase().includes(q)) &&
      (f.status === "All" || r.broadcast.status === f.status) &&
      (f.audience === "All" || r.broadcast.audience === f.audience) &&
      (f.channel === "All" || r.broadcast.channels.includes(f.channel as NotificationChannel))
  );
}

export const BROADCAST_STATUS_OPTIONS = [
  { value: "All", label: "All statuses" },
  ...(Object.keys(BROADCAST_STATUS_META) as BroadcastStatus[]).map((s) => ({ value: s, label: BROADCAST_STATUS_META[s].label })),
];
export const AUDIENCE_OPTIONS = [
  { value: "All", label: "All audiences" },
  ...(Object.keys(AUDIENCE_LABEL) as BroadcastAudience[]).map((a) => ({ value: a, label: AUDIENCE_LABEL[a] })),
];
export const CHANNEL_OPTIONS = [
  { value: "All", label: "All channels" },
  { value: "IN_APP", label: "In-app" },
  { value: "EMAIL", label: "Email" },
  { value: "PUSH", label: "Push" },
];
export const DELIVERY_STATUS_OPTIONS = [
  { value: "All", label: "All statuses" },
  ...(Object.keys(DELIVERY_STATUS_META) as DeliveryStatus[]).map((s) => ({ value: s, label: DELIVERY_STATUS_META[s].label })),
];

/** Reads a positive integer page number from a raw query value. */
export const parsePage = (raw: string) => {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
};
