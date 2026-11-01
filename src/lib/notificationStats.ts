import type { AdminNotification, Broadcast, BroadcastDelivery, NotificationCategory, NotificationChannel } from "@/types/notification";

/** Pure helpers — every Notifications number is derived here (never hard-coded). */

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);

export function inboxStats(inbox: AdminNotification[]) {
  const live = inbox.filter((n) => !n.isArchived);
  return {
    total: live.length,
    unread: live.filter((n) => !n.isRead).length,
    highPriority: live.filter((n) => !n.isRead && n.priority === "HIGH").length,
    archived: inbox.length - live.length,
  };
}

export const unreadByCategory = (inbox: AdminNotification[]) =>
  inbox.filter((n) => !n.isRead && !n.isArchived).reduce<Partial<Record<NotificationCategory, number>>>((a, n) => ((a[n.category] = (a[n.category] ?? 0) + 1), a), {});

/** "Today" / "Yesterday" / "Earlier this week" / "Earlier" groups (inbox feed). */
export function groupByDay(items: AdminNotification[], now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const DAY = 86400000;
  const groups: { label: string; items: AdminNotification[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier this week", items: [] },
    { label: "Earlier", items: [] },
  ];
  items.forEach((n) => {
    const t = new Date(n.createdAt).getTime();
    const g = t >= start ? 0 : t >= start - DAY ? 1 : t >= start - 7 * DAY ? 2 : 3;
    groups[g].items.push(n);
  });
  return groups.filter((g) => g.items.length);
}

/** Delivery funnel for one broadcast or many. OPENED/CLICKED rows also count as delivered/opened. */
export function deliveryStats(rows: BroadcastDelivery[]) {
  const total = rows.length;
  const failed = rows.filter((r) => r.status === "FAILED").length;
  const delivered = total - failed;
  const opened = rows.filter((r) => r.status === "OPENED" || r.status === "CLICKED").length;
  const clicked = rows.filter((r) => r.status === "CLICKED").length;
  return {
    total,
    delivered,
    failed,
    opened,
    clicked,
    deliveryRate: pct(delivered, total),
    openRate: pct(opened, delivered),
    clickRate: pct(clicked, opened),
    recipients: new Set(rows.map((r) => r.recipient.id)).size,
  };
}

export function deliveryByChannel(rows: BroadcastDelivery[]) {
  const channels: NotificationChannel[] = ["IN_APP", "EMAIL", "PUSH"];
  return channels
    .map((channel) => ({ channel, ...deliveryStats(rows.filter((r) => r.channel === channel)) }))
    .filter((c) => c.total > 0);
}

/** Opens per hour after sending (first 24 h) for a broadcast. */
export function opensTimeline(broadcast: Broadcast, rows: BroadcastDelivery[], hours = 24) {
  if (!broadcast.sendAt) return [];
  const start = new Date(broadcast.sendAt).getTime();
  return Array.from({ length: hours }, (_, h) => ({
    label: `${h + 1}h`,
    opens: rows.filter((r) => r.openedAt && new Date(r.openedAt).getTime() >= start + h * 3600000 && new Date(r.openedAt).getTime() < start + (h + 1) * 3600000).length,
  }));
}

export function broadcastOverview(broadcasts: Broadcast[], deliveries: BroadcastDelivery[], now: Date = new Date()) {
  const sent = broadcasts.filter((b) => b.status === "SENT");
  const last30 = sent.filter((b) => b.sendAt && new Date(b.sendAt).getTime() > now.getTime() - 30 * 86400000);
  const ids = new Set(last30.map((b) => b.id));
  const s = deliveryStats(deliveries.filter((d) => ids.has(d.broadcastId)));
  return {
    sentLast30: last30.length,
    scheduled: broadcasts.filter((b) => b.status === "SCHEDULED").length,
    drafts: broadcasts.filter((b) => b.status === "DRAFT").length,
    avgOpenRate: s.openRate,
    avgClickRate: s.clickRate,
    reached: s.recipients,
  };
}

export const CHANNEL_LABEL: Record<NotificationChannel, string> = { IN_APP: "In-app", EMAIL: "Email", PUSH: "Push" };

/** Plain text length of HTML (push limit, counters). */
export const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

/** Fill template placeholders with sample values for previews. */
export const SAMPLE_VALUES: Record<string, string> = {
  "{student_name}": "Sarah Rahman",
  "{course_title}": "HTML Fundamentals",
  "{course_url}": "edupro.com/courses/html-fundamentals",
  "{order_id}": "ORD-1042",
  "{amount}": "$49.00",
  "{payment_method}": "Visa •••• 4242",
  "{assignment_title}": "Build a Simple HTML Page",
  "{score}": "28/32",
  "{quiz_title}": "HTML Basics Quiz",
  "{result}": "Passed",
  "{class_title}": "JavaScript Q&A Session",
  "{start_time}": "10:00 AM",
  "{join_url}": "zoom.us/j/1234567890",
  "{certificate_url}": "edupro.com/verify/EDU-HF-2026-00042",
  "{discussion_title}": "Why does my <a> tag open in the same tab?",
  "{reply_author}": "Arif Hossain",
  "{discussion_url}": "edupro.com/community/thread-2",
  "{reset_url}": "edupro.com/reset/••••",
  "{expires_in}": "30 minutes",
};
export const fillSample = (text: string) => Object.entries(SAMPLE_VALUES).reduce((s, [k, v]) => s.replaceAll(k, v), text);

export function timeAgo(iso: string, now: Date = new Date()) {
  const m = Math.floor(Math.max(0, now.getTime() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
