import { z } from "zod";
import { LESSON_TYPES } from "@/components/courses/create/aiOutline";

/**
 * Add / Edit Lesson modal (Create Course → Curriculum). Four tabs share ONE react-hook-form
 * instance typed as `LessonFormValues`; every tab reads it via `useFormContext<LessonFormValues>()`.
 */

export const LESSON_TITLE_MAX = 200;
export const LESSON_SUMMARY_MAX = 500;
export const LESSON_NOTES_MAX = 1000;
export const LESSON_TAGS_MAX = 10;
export const LESSON_RESOURCE_FILES_MAX = 20;
export const LESSON_RESOURCE_LINKS_MAX = 20;
/** Upload limits shown in the dropzones. */
export const LESSON_VIDEO_MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
export const LESSON_RESOURCE_MAX_BYTES = 50 * 1024 * 1024; // 50MB

export const LESSON_DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const LESSON_DURATION_UNITS = ["minutes", "hours"] as const;
export const LESSON_VIDEO_SOURCES = ["UPLOAD", "YOUTUBE", "VIMEO", "LINK"] as const;
export const LESSON_VISIBILITIES = ["PUBLIC", "DRAFT", "SCHEDULED"] as const;
export const LESSON_RELEASE_TYPES = ["IMMEDIATE", "DRIP", "MANUAL"] as const;
export const LESSON_DRIP_UNITS = ["DAYS", "WEEKS"] as const;
export const LESSON_COMPLETION_MODES = ["MANUAL", "AUTO", "ASSESSMENT"] as const;
export const LESSON_ACCESS_MODES = ["ALL", "PLANS", "GROUPS"] as const;

export type LessonVideoSource = (typeof LESSON_VIDEO_SOURCES)[number];

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const lessonVideoSchema = z.object({
  source: z.enum(LESSON_VIDEO_SOURCES),
  /** Hosted (Cloudinary) or embed URL. Never a `blob:` URL. */
  url: z.string().trim(),
  /** Upload metadata (UPLOAD source only). */
  fileName: z.string(),
  fileSize: z.number().int().min(0),
  durationSeconds: z.number().min(0),
});

export const lessonResourceFileSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
  size: z.number().int().min(0),
  /** Upper-case extension, e.g. "PDF", "ZIP". */
  fileType: z.string(),
});

export const lessonResourceLinkSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2, "Link title must be at least 2 characters").max(120, "Link title must be 120 characters or less"),
  url: z.string().trim().refine(isHttpUrl, "Enter a valid URL starting with http:// or https://"),
});

export const lessonFormSchema = z
  .object({
    // ---- Basic Info tab ----
    title: z
      .string()
      .trim()
      .min(3, "Lesson title must be at least 3 characters")
      .max(LESSON_TITLE_MAX, `Lesson title must be ${LESSON_TITLE_MAX} characters or less`),
    summary: z.string().trim().max(LESSON_SUMMARY_MAX, `Description must be ${LESSON_SUMMARY_MAX} characters or less`),
    type: z.enum(LESSON_TYPES, { error: "Select a lesson type" }),
    duration: z
      .number({ error: "Enter an estimated duration" })
      .min(1, "Duration must be at least 1")
      .max(600, "Duration is too long"),
    durationUnit: z.enum(LESSON_DURATION_UNITS),
    difficulty: z.enum(LESSON_DIFFICULTIES),
    /** "" = no prerequisite. Otherwise the id of another lesson in this course outline. */
    prerequisiteLessonId: z.string(),
    thumbnailUrl: z.string(),
    thumbnailPrompt: z.string().trim().max(200, "Prompt must be 200 characters or less"),

    // ---- Content tab ----
    video: lessonVideoSchema,
    /** Rich-text HTML from the shared RichTextEditor. */
    content: z.string(),

    // ---- Resources tab ----
    resourceFiles: z.array(lessonResourceFileSchema).max(LESSON_RESOURCE_FILES_MAX, `Add up to ${LESSON_RESOURCE_FILES_MAX} files`),
    resourceLinks: z.array(lessonResourceLinkSchema).max(LESSON_RESOURCE_LINKS_MAX, `Add up to ${LESSON_RESOURCE_LINKS_MAX} links`),

    // ---- Settings tab ----
    visibility: z.enum(LESSON_VISIBILITIES),
    /** ISO datetime-local string; required when visibility = SCHEDULED. */
    scheduledAt: z.string(),
    releaseType: z.enum(LESSON_RELEASE_TYPES),
    dripValue: z.number({ error: "Enter a number" }).int("Whole numbers only").min(1, "Must be at least 1").max(365, "Must be 365 or less"),
    dripUnit: z.enum(LESSON_DRIP_UNITS),
    completion: z.enum(LESSON_COMPLETION_MODES),
    access: z.enum(LESSON_ACCESS_MODES),
    tags: z.array(z.string().trim().min(1)).max(LESSON_TAGS_MAX, `You can add up to ${LESSON_TAGS_MAX} tags`),
    instructorNotes: z.string().trim().max(LESSON_NOTES_MAX, `Notes must be ${LESSON_NOTES_MAX} characters or less`),
  })
  .superRefine((v, ctx) => {
    const url = v.video.url.trim();
    if (url && (url.startsWith("blob:") || !isHttpUrl(url))) {
      ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid video URL starting with https://" });
    }
    if (url && v.video.source === "YOUTUBE" && !/(youtube\.com|youtu\.be)\//i.test(url)) {
      ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid YouTube link" });
    }
    if (url && v.video.source === "VIMEO" && !/vimeo\.com\//i.test(url)) {
      ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid Vimeo link" });
    }
    if (v.visibility === "SCHEDULED") {
      const at = Date.parse(v.scheduledAt);
      if (!v.scheduledAt || Number.isNaN(at)) {
        ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "Pick a publish date and time" });
      } else if (at <= Date.now()) {
        ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "Scheduled time must be in the future" });
      }
    }
  });

export type LessonFormValues = z.infer<typeof lessonFormSchema>;
export type LessonResourceFile = z.infer<typeof lessonResourceFileSchema>;
export type LessonResourceLink = z.infer<typeof lessonResourceLinkSchema>;

/**
 * Stricter rules for the final "Create Lesson" action (Save as Draft only needs `lessonFormSchema`):
 * a VIDEO lesson needs a video, a TEXT lesson needs written content.
 */
export const lessonPublishIssues = (v: LessonFormValues): { path: string; message: string; tab: LessonTab }[] => {
  const issues: { path: string; message: string; tab: LessonTab }[] = [];
  if (v.type === "VIDEO" && !v.video.url.trim()) {
    issues.push({ path: "video.url", message: "Add a video for this video lesson", tab: "content" });
  }
  const text = v.content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
  if ((v.type === "TEXT" || v.type === "CODING") && !text) {
    issues.push({ path: "content", message: "Write the lesson content", tab: "content" });
  }
  return issues;
};

export const LESSON_TABS = ["basic", "content", "resources", "settings"] as const;
export type LessonTab = (typeof LESSON_TABS)[number];

/** Which tab owns each top-level field (used to jump to the first tab with an error). */
export const LESSON_FIELD_TAB: Record<keyof LessonFormValues, LessonTab> = {
  title: "basic",
  summary: "basic",
  type: "basic",
  duration: "basic",
  durationUnit: "basic",
  difficulty: "basic",
  prerequisiteLessonId: "basic",
  thumbnailUrl: "basic",
  thumbnailPrompt: "basic",
  video: "content",
  content: "content",
  resourceFiles: "resources",
  resourceLinks: "resources",
  visibility: "settings",
  scheduledAt: "settings",
  releaseType: "settings",
  dripValue: "settings",
  dripUnit: "settings",
  completion: "settings",
  access: "settings",
  tags: "settings",
  instructorNotes: "settings",
};

export const EMPTY_LESSON_FORM: LessonFormValues = {
  title: "",
  summary: "",
  type: "VIDEO",
  duration: 10,
  durationUnit: "minutes",
  difficulty: "BEGINNER",
  prerequisiteLessonId: "",
  thumbnailUrl: "",
  thumbnailPrompt: "",
  video: { source: "UPLOAD", url: "", fileName: "", fileSize: 0, durationSeconds: 0 },
  content: "",
  resourceFiles: [],
  resourceLinks: [],
  visibility: "PUBLIC",
  scheduledAt: "",
  releaseType: "IMMEDIATE",
  dripValue: 7,
  dripUnit: "DAYS",
  completion: "MANUAL",
  access: "ALL",
  tags: [],
  instructorNotes: "",
};

/** Duration in whole minutes (what the outline / API stores). */
export const lessonDurationMinutes = (v: Pick<LessonFormValues, "duration" | "durationUnit">) =>
  Math.max(1, Math.round(v.durationUnit === "hours" ? v.duration * 60 : v.duration));
