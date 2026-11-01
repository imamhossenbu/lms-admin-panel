import { z } from "zod";

/** Schedule / Edit Live Class form (single page). Convert with src/lib/liveClassMapping.ts. */

export const LIVE_TITLE_MAX = 120;
export const LIVE_DESCRIPTION_MAX = 1000;

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const PLATFORM_HOSTS: Record<"ZOOM" | "GOOGLE_MEET" | "TEAMS", RegExp> = {
  ZOOM: /(^|\.)zoom\.us$/i,
  GOOGLE_MEET: /^meet\.google\.com$/i,
  TEAMS: /(^|\.)teams\.(microsoft|live)\.com$/i,
};

export const liveClassSchema = z
  .object({
    title: z.string().trim().min(3, "Class title must be at least 3 characters").max(LIVE_TITLE_MAX, `Title must be ${LIVE_TITLE_MAX} characters or less`),
    courseId: z.string().min(1, "Select a course"),
    instructorId: z.string().min(1, "Select an instructor"),
    type: z.enum(["INTERACTIVE", "WEBINAR", "WORKSHOP", "QA"]),
    descriptionHtml: z.string().refine((h) => plainLength(h) <= LIVE_DESCRIPTION_MAX, `Description must be ${LIVE_DESCRIPTION_MAX} characters or less`),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a start time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Select an end time"),
    platform: z.enum(["ZOOM", "GOOGLE_MEET", "TEAMS", "CUSTOM"]),
    meetingLink: z.string().trim().min(1, "Add the meeting link").refine(isHttpUrl, "Enter a valid URL starting with https://"),
    meetingId: z.string().trim().max(40, "Too long"),
    passcode: z.string().trim().max(40, "Too long"),
    sendLinkToStudents: z.boolean(),
    capacity: z.number({ error: "Enter the number of seats" }).int("Whole numbers only").min(1, "At least 1 seat").max(10000, "Up to 10,000 seats"),
    settings: z.object({
      allowQa: z.boolean(),
      enableChat: z.boolean(),
      recordClass: z.boolean(),
      makePublic: z.boolean(),
      sendReminder: z.boolean(),
      autoAttendance: z.boolean(),
    }),
    reminder: z.enum(["NONE", "5", "15", "30", "60", "1440"]),
    thumbnailUrl: z.string(),
  })
  .superRefine((v, ctx) => {
    if (/^\d{2}:\d{2}$/.test(v.startTime) && /^\d{2}:\d{2}$/.test(v.endTime)) {
      const d = toMinutes(v.endTime) - toMinutes(v.startTime);
      if (d <= 0) ctx.addIssue({ code: "custom", path: ["endTime"], message: "End time must be after the start time" });
      else if (d < 15) ctx.addIssue({ code: "custom", path: ["endTime"], message: "A class must be at least 15 minutes" });
      else if (d > 8 * 60) ctx.addIssue({ code: "custom", path: ["endTime"], message: "A class can be at most 8 hours" });
    }
    if (v.platform !== "CUSTOM" && isHttpUrl(v.meetingLink)) {
      const host = new URL(v.meetingLink).hostname;
      if (!PLATFORM_HOSTS[v.platform].test(host)) {
        const name = v.platform === "ZOOM" ? "Zoom" : v.platform === "GOOGLE_MEET" ? "Google Meet" : "Microsoft Teams";
        ctx.addIssue({ code: "custom", path: ["meetingLink"], message: `This doesn't look like a ${name} link` });
      }
    }
    if (v.settings.sendReminder && v.reminder === "NONE")
      ctx.addIssue({ code: "custom", path: ["reminder"], message: "Choose when to send the reminder" });
  });

export type LiveClassFormValues = z.infer<typeof liveClassSchema>;

/** Extra rule for scheduling a NEW class (and for re-scheduling): it must start in the future. */
export const startsInFuture = (v: Pick<LiveClassFormValues, "date" | "startTime">, now = new Date()) =>
  new Date(`${v.date}T${v.startTime}`).getTime() > now.getTime();

/** Answer form in the Q&A drawer. */
export const liveAnswerSchema = z.object({
  answerHtml: z.string(),
  status: z.enum(["ANSWERED", "PENDING"]),
}).superRefine((v, ctx) => {
  if (v.status === "ANSWERED" && plainLength(v.answerHtml) < 2) ctx.addIssue({ code: "custom", path: ["answerHtml"], message: "Write the answer before marking it answered" });
});
export type LiveAnswerValues = z.infer<typeof liveAnswerSchema>;

/** Add / edit resource modal. */
export const liveResourceSchema = z.object({
  type: z.enum(["RECORDING", "DOCUMENT", "LINK", "CODE"]),
  title: z.string().trim().min(2, "Title is required").max(120, "120 characters or less"),
  description: z.string().trim().max(200, "200 characters or less"),
  url: z.string().trim().min(1, "Upload a file or add a link").refine(isHttpUrl, "Enter a valid URL starting with https://"),
  size: z.number().int().min(0),
  visibility: z.enum(["ALL_STUDENTS", "ATTENDEES", "HIDDEN"]),
});
export type LiveResourceValues = z.infer<typeof liveResourceSchema>;
