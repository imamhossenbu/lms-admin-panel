import type { Broadcast, BroadcastAudience, NotificationChannel } from "@/types/notification";
import { broadcastFormSchema, type BroadcastFormValues } from "@/validations/notificationSchema";
import { CHANNEL_LABEL } from "@/lib/notificationStats";
import { COURSE_OPTIONS } from "@/data/mockCourseCatalog";

/** Compose / Edit Broadcast: defaults, mapping, summary copy and sessionStorage drafts. */

export type ComposeMode = "create" | "edit";

export const COMPOSE_FORM_ID = "broadcast-compose-form";

export const COMPOSE_DEFAULTS: BroadcastFormValues = {
  title: "",
  messageHtml: "",
  audience: "ALL_STUDENTS",
  courseIds: [],
  channels: ["IN_APP"],
  priority: "NORMAL",
  ctaLabel: "",
  ctaUrl: "",
  timing: "NOW",
  scheduledAt: "",
};

/** Local "YYYY-MM-DDTHH:mm" (datetime-local value) for a Date. */
export function toLocalInput(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

/** Earliest allowed schedule (now + 5 minutes) for the datetime-local `min`. */
export const minScheduleInput = () => toLocalInput(new Date(Date.now() + 5 * 60000));

/** Broadcast → form values (SCHEDULED keeps its time; drafts with a saved time stay "Schedule"). */
export function toFormValues(b: Broadcast): BroadcastFormValues {
  const scheduled = b.status === "SCHEDULED" || (b.status === "DRAFT" && !!b.sendAt);
  return {
    title: b.title,
    messageHtml: b.messageHtml,
    audience: b.audience,
    courseIds: [...b.courseIds],
    channels: b.channels.length ? [...b.channels] : ["IN_APP"],
    priority: b.priority,
    ctaLabel: b.ctaLabel,
    ctaUrl: b.ctaUrl,
    timing: scheduled ? "SCHEDULE" : "NOW",
    scheduledAt: scheduled && b.sendAt ? toLocalInput(new Date(b.sendAt)) : "",
  };
}

export const isEditable = (b: Broadcast) => b.status === "DRAFT" || b.status === "SCHEDULED";

const isEmptyHtml = (html: string) => /^(<p>\s*<\/p>|\s)*$/.test(html);
/** Stable JSON used for dirty checks / draft comparisons. */
export const snapshotValues = (v: BroadcastFormValues) =>
  JSON.stringify(v, (_k, val) => (typeof val === "string" && isEmptyHtml(val) ? "" : val));

/** Plain text of rich-text HTML (previews). */
export const htmlToText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

// ---------------------------------------------------------------- copy
export const AUDIENCE_LABEL: Record<BroadcastAudience, string> = {
  ALL_STUDENTS: "All students",
  COURSE: "Specific courses",
  INSTRUCTORS: "Instructors",
  INACTIVE_STUDENTS: "Inactive students (30+ days)",
};

export const courseTitleOf = (id: string) => COURSE_OPTIONS.find((c) => c.value === id)?.label ?? id;

/** "In-app", "In-app and Email", "In-app, Email and Push". */
export function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export const channelList = (channels: NotificationChannel[]) => joinList(channels.map((c) => CHANNEL_LABEL[c]));

/** "students", "students in HTML Fundamentals", "instructors" … */
export function audienceNoun(audience: BroadcastAudience, courseIds: string[], count: number) {
  const one = count === 1;
  if (audience === "INSTRUCTORS") return one ? "instructor" : "instructors";
  if (audience === "INACTIVE_STUDENTS") return one ? "inactive student" : "inactive students";
  const noun = one ? "student" : "students";
  if (audience !== "COURSE" || courseIds.length === 0) return noun;
  const titles = courseIds.map(courseTitleOf);
  const where = titles.length <= 2 ? joinList(titles) : `${titles[0]} and ${titles.length - 1} more courses`;
  return `${noun} in ${where}`;
}

export function formatSchedule(local: string) {
  const t = Date.parse(local);
  if (Number.isNaN(t)) return "";
  return new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Local time-zone name for the "Your local time" note (client only). */
export function localTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");

// ---------------------------------------------------------------- draft validation
/**
 * Drafts only need a valid title + message: run the shared schema with channel / schedule / audience rules
 * neutralised and keep only the title + message issues.
 */
export function draftIssues(v: BroadcastFormValues): { field: "title" | "messageHtml"; message: string }[] {
  const res = broadcastFormSchema.safeParse({
    ...v,
    audience: "ALL_STUDENTS",
    courseIds: [],
    channels: ["IN_APP"],
    ctaLabel: "",
    ctaUrl: "",
    timing: "NOW",
    scheduledAt: "",
  });
  if (res.success) return [];
  const out: { field: "title" | "messageHtml"; message: string }[] = [];
  res.error.issues.forEach((i) => {
    const f = i.path[0];
    if ((f === "title" || f === "messageHtml") && !out.some((o) => o.field === f)) out.push({ field: f, message: i.message });
  });
  return out;
}

/** Values safe to store as a draft (an empty schedule falls back to "Send now" so storage can't choke on it). */
export function draftPayload(v: BroadcastFormValues): BroadcastFormValues {
  const validTime = v.timing === "SCHEDULE" && !Number.isNaN(Date.parse(v.scheduledAt));
  return { ...v, timing: validTime ? "SCHEDULE" : "NOW", scheduledAt: validTime ? v.scheduledAt : "" };
}

// ---------------------------------------------------------------- session drafts
export const draftKey = (mode: ComposeMode, id?: string) => (mode === "edit" && id ? `edupro_broadcast_draft:edit:${id}` : "edupro_broadcast_draft:new");

export function readDraft(key: string): BroadcastFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BroadcastFormValues> | null;
    if (!parsed || typeof parsed !== "object") return null;
    const merged = { ...COMPOSE_DEFAULTS, ...parsed };
    if (!Array.isArray(merged.courseIds) || !Array.isArray(merged.channels)) return null;
    return merged;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, values: BroadcastFormValues) {
  try {
    sessionStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Storage full / disabled: the form still works, it just won't survive a reload.
  }
}

export function clearDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------- summary
export interface SendSummary {
  count: number;
  noun: string;
  /** "Sends now" / "Scheduled for Nov 3, 2026, 10:00 AM" / "Schedule time not set". */
  when: string;
  via: string;
  /** Audience still incomplete (Specific courses without a course). */
  incomplete: boolean;
}

export function sendSummary(v: Pick<BroadcastFormValues, "audience" | "courseIds" | "channels" | "timing" | "scheduledAt">, count: number): SendSummary {
  const at = v.timing === "SCHEDULE" ? formatSchedule(v.scheduledAt) : "";
  return {
    count,
    noun: audienceNoun(v.audience, v.courseIds, count),
    when: v.timing === "NOW" ? "Sends now" : at ? `Scheduled for ${at}` : "Schedule time not set",
    via: channelList(v.channels) || "no channel yet",
    incomplete: v.audience === "COURSE" && v.courseIds.length === 0,
  };
}
