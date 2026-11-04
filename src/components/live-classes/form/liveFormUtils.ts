import type { LiveClassItem, LiveClassType, LivePlatform, ReminderOffset } from "@/types/liveClass";
import type { LiveClassFormValues } from "@/validations/liveClassSchema";
import type { LiveClassFields } from "@/lib/liveClassStorage";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { REMINDER_LABEL } from "../shared/liveClassView";

/** Schedule / Edit Live Class form: defaults, mapping, options, draft storage and the mock meeting generator. */

export type LiveFormMode = "create" | "edit";

export const LIVE_FORM_DEFAULTS: LiveClassFormValues = {
  title: "",
  courseId: "",
  instructorId: "",
  type: "INTERACTIVE",
  descriptionHtml: "",
  date: "",
  startTime: "",
  endTime: "",
  platform: "ZOOM",
  meetingLink: "",
  meetingId: "",
  passcode: "",
  sendLinkToStudents: true,
  capacity: 100,
  settings: { allowQa: true, enableChat: true, recordClass: true, makePublic: false, sendReminder: true, autoAttendance: true },
  reminder: "15",
  thumbnailUrl: "",
};

export const toFormValues = (c: LiveClassItem): LiveClassFormValues => ({
  title: c.title,
  courseId: c.courseId,
  instructorId: c.instructorId,
  type: c.type,
  descriptionHtml: c.descriptionHtml,
  date: c.date,
  startTime: c.startTime,
  endTime: c.endTime,
  platform: c.platform,
  meetingLink: c.meetingLink,
  meetingId: c.meetingId,
  passcode: c.passcode,
  sendLinkToStudents: c.sendLinkToStudents,
  capacity: c.capacity,
  settings: { ...c.settings },
  reminder: c.reminder,
  thumbnailUrl: c.thumbnailUrl,
});

const isEmptyHtml = (html: string) => /^(<p>\s*<\/p>|\s)*$/.test(html);

export const toFields = (v: LiveClassFormValues): LiveClassFields => ({
  ...v,
  title: v.title.trim(),
  descriptionHtml: isEmptyHtml(v.descriptionHtml) ? "" : v.descriptionHtml,
  meetingLink: v.meetingLink.trim(),
  meetingId: v.platform === "ZOOM" ? v.meetingId.trim() : "",
  passcode: v.platform === "ZOOM" ? v.passcode.trim() : "",
  reminder: v.settings.sendReminder ? v.reminder : "NONE",
});

/** Stable comparison string ("<p></p>" ≈ "", NaN ≈ null) to detect unsaved changes. */
export const snapshotValues = (v: LiveClassFormValues) =>
  JSON.stringify(v, (_k, val) => (typeof val === "string" && isEmptyHtml(val) ? "" : typeof val === "number" && Number.isNaN(val) ? null : val));

// ---------------------------------------------------------------- options
export const TYPE_OPTIONS: { value: LiveClassType; label: string }[] = [
  { value: "INTERACTIVE", label: "Live Class (Interactive)" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "QA", label: "Q&A Session" },
];
export const REMINDER_OPTIONS: AppSelectOption[] = (["5", "15", "30", "60", "1440"] as ReminderOffset[]).map((v) => ({
  value: v,
  label: REMINDER_LABEL[v],
}));

export const LINK_PLACEHOLDER: Record<LivePlatform, string> = {
  ZOOM: "https://zoom.us/j/xxxxxxxxxx",
  GOOGLE_MEET: "https://meet.google.com/xxx-xxxx-xxx",
  TEAMS: "https://teams.microsoft.com/l/meetup-join/...",
  CUSTOM: "https://your-meeting-link.com/...",
};

// ---------------------------------------------------------------- time
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const TIME_RE = /^\d{2}:\d{2}$/;

/** Minutes between start and end, or null while incomplete / invalid. */
export const formDuration = (start: string, end: string) =>
  TIME_RE.test(start) && TIME_RE.test(end) && toMin(end) > toMin(start) ? toMin(end) - toMin(start) : null;

/** "1 hour 30 min" / "45 min" / "2 hours". */
export function durationLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const hours = h ? `${h} hour${h === 1 ? "" : "s"}` : "";
  const mins = m ? `${m} min` : "";
  return [hours, mins].filter(Boolean).join(" ");
}

export const hasCompleteSchedule = (v: Pick<LiveClassFormValues, "date" | "startTime">) => /^\d{4}-\d{2}-\d{2}$/.test(v.date) && TIME_RE.test(v.startTime);

// ---------------------------------------------------------------- mock meeting generator
const rand = (n: number) => Math.floor(Math.random() * n);
const letters = (n: number) => Array.from({ length: n }, () => String.fromCharCode(97 + rand(26))).join("");
const alnum = (n: number) => Array.from({ length: n }, () => "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"[rand(54)]).join("");

export interface MockMeeting {
  meetingLink: string;
  meetingId: string;
  passcode: string;
}

/** Realistic-looking meeting for the chosen platform (mock phase — no provider API yet). */
export async function generateMockMeeting(platform: Exclude<LivePlatform, "CUSTOM">): Promise<MockMeeting> {
  await new Promise((r) => setTimeout(r, 700));
  if (platform === "ZOOM") {
    const id = `${8 + rand(2)}${Array.from({ length: 10 }, () => rand(10)).join("")}`;
    return {
      meetingLink: `https://us06web.zoom.us/j/${id}?pwd=${alnum(22)}`,
      meetingId: `${id.slice(0, 3)} ${id.slice(3, 7)} ${id.slice(7)}`,
      passcode: alnum(6),
    };
  }
  if (platform === "GOOGLE_MEET") return { meetingLink: `https://meet.google.com/${letters(3)}-${letters(4)}-${letters(3)}`, meetingId: "", passcode: "" };
  return {
    meetingLink: `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${alnum(32)}%40thread.v2/0`,
    meetingId: "",
    passcode: "",
  };
}

// ---------------------------------------------------------------- sessionStorage draft
const DRAFT_PREFIX = "edupro_live_class_form_v1";
export const draftKey = (mode: LiveFormMode, classId?: string) => (mode === "create" ? `${DRAFT_PREFIX}::schedule` : `${DRAFT_PREFIX}::edit::${classId ?? ""}`);

export function readDraft(key: string): LiveClassFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LiveClassFormValues> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...LIVE_FORM_DEFAULTS,
      ...parsed,
      capacity: typeof parsed.capacity === "number" ? parsed.capacity : Number.NaN,
      settings: { ...LIVE_FORM_DEFAULTS.settings, ...(parsed.settings ?? {}) },
      // Never restore temporary blob: previews.
      thumbnailUrl: typeof parsed.thumbnailUrl === "string" && !parsed.thumbnailUrl.startsWith("blob:") ? parsed.thumbnailUrl : "",
    };
  } catch {
    return null;
  }
}

export function writeDraft(key: string, values: LiveClassFormValues) {
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
