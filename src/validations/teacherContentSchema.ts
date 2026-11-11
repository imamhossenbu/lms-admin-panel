import { z } from "zod";
import { LIVE_PLATFORMS, TEACHER_LESSON_TYPES } from "@/types/teacher";

const https = /^https:\/\/[^\s/$.?#][^\s]*$/i;
const textOf = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

export const moduleTitleSchema = z.object({
  title: z.string().trim().min(2, "Give the module a title").max(120, "Keep the title under 120 characters"),
});
export type ModuleTitleValues = z.infer<typeof moduleTitleSchema>;

/** Mirrors TeacherLessonDto + the publish rules (video link / written content). */
export const teacherLessonSchema = z
  .object({
    moduleId: z.string().min(1, "Choose a module"),
    title: z.string().trim().min(3, "Give the lesson a title (at least 3 characters)").max(150, "Keep the title under 150 characters"),
    type: z.enum(TEACHER_LESSON_TYPES, { message: "Choose a lesson type" }),
    durationMinutes: z.coerce.number({ message: "Enter the length in minutes" }).int("Use whole minutes").min(0, "Length can't be negative").max(600, "A lesson can be at most 600 minutes"),
    videoUrl: z.string().trim().max(1000).refine((v) => v === "" || https.test(v), "Use an https:// video link"),
    content: z.string().max(100_000, "The lesson content is too long"),
    isPreview: z.boolean(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
  })
  .superRefine((v, ctx) => {
    if (v.status !== "PUBLISHED") return;
    if (v.type === "VIDEO" && !v.videoUrl) ctx.addIssue({ code: "custom", path: ["videoUrl"], message: "Add a video link before publishing a video lesson" });
    if ((v.type === "TEXT" || v.type === "CODING") && !textOf(v.content)) ctx.addIssue({ code: "custom", path: ["content"], message: "Write the lesson content before publishing it" });
  });
export type TeacherLessonValues = z.infer<typeof teacherLessonSchema>;

const PLATFORM_HOSTS: Record<string, RegExp> = { ZOOM: /(^|\.)zoom\.us$/i, GOOGLE_MEET: /^meet\.google\.com$/i, TEAMS: /(^|\.)teams\.(microsoft|live)\.com$/i };
export const PLATFORM_LABEL: Record<(typeof LIVE_PLATFORMS)[number], string> = { ZOOM: "Zoom", GOOGLE_MEET: "Google Meet", TEAMS: "Microsoft Teams", CUSTOM: "Other link" };

/** Mirrors TeacherLiveDto (+ platform link check and "must start in the future"). */
export const teacherLiveSchema = z
  .object({
    courseId: z.string().min(1, "Choose a course"),
    title: z.string().trim().min(3, "Give the class a title").max(120, "Keep the title under 120 characters"),
    description: z.string().trim().max(1000, "Keep the description under 1000 characters"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a start time"),
    durationMinutes: z.coerce.number().int().min(15, "A class must be at least 15 minutes").max(480, "A class can be at most 8 hours"),
    platform: z.enum(LIVE_PLATFORMS, { message: "Choose a platform" }),
    meetingUrl: z.string().trim().max(500).regex(https, "Use an https:// meeting link"),
  })
  .superRefine((v, ctx) => {
    if (v.platform !== "CUSTOM" && https.test(v.meetingUrl)) {
      try {
        if (!PLATFORM_HOSTS[v.platform].test(new URL(v.meetingUrl).hostname)) ctx.addIssue({ code: "custom", path: ["meetingUrl"], message: `This doesn't look like a ${PLATFORM_LABEL[v.platform]} link` });
      } catch {
        /* regex already reported it */
      }
    }
    // The browser's local time; the server re-checks in the workspace's time zone.
    const start = new Date(`${v.date}T${v.startTime}:00`);
    if (!Number.isNaN(start.getTime()) && start.getTime() <= Date.now()) ctx.addIssue({ code: "custom", path: ["startTime"], message: "The class must start in the future" });
  });
export type TeacherLiveValues = z.infer<typeof teacherLiveSchema>;

export const recordingSchema = z.object({
  recordingUrl: z.string().trim().max(1000).refine((v) => v === "" || https.test(v), "Use an https:// recording link"),
});
export type RecordingValues = z.infer<typeof recordingSchema>;
