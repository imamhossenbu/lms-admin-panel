import { z } from "zod";
import { LESSON_TYPES } from "@/components/courses/create/aiOutline";
import { lessonQuizQuestionSchema } from "@/validations/lessonFormSchema";

/**
 * Edit Lesson PAGE (/courses/[id]/lessons/[lessonId]/edit). ONE react-hook-form instance typed as
 * `LessonEditorValues`; each tab owns one top-level section and reads it via
 * `useFormContext<LessonEditorValues>()` (field names like "content.title", "media.video.url").
 */

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
const optionalUrl = (message = "Enter a valid URL starting with https://") =>
  z.string().trim().refine((v) => v === "" || isHttpUrl(v), message);

/** "YYYY-MM-DD" or "". */
const dateString = z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Pick a valid date");
/** "HH:mm" or "". */
const timeString = z.string().refine((v) => v === "" || /^\d{2}:\d{2}$/.test(v), "Pick a valid time");
const combine = (date: string, time: string) => (date ? Date.parse(`${date}T${time || "00:00"}`) : NaN);

export const LESSON_EDITOR_TABS = ["content", "media", "settings", "access", "drip", "seo", "quiz", "resources", "notes"] as const;
export type LessonEditorTab = (typeof LESSON_EDITOR_TABS)[number];

// ---------------------------------------------------------------- Content
export const LESSON_STATUSES = ["PUBLISHED", "DRAFT", "SCHEDULED"] as const;
export const LESSON_PUBLISH_VISIBILITY = ["PUBLIC", "PRIVATE"] as const;
export const EDITOR_TITLE_MAX = 100;
export const EDITOR_SHORT_DESCRIPTION_MAX = 500;
export const EDITOR_CONTENT_MAX = 5000;

export const lessonEditorContentSchema = z
  .object({
    title: z.string().trim().min(3, "Lesson title must be at least 3 characters").max(EDITOR_TITLE_MAX, `Lesson title must be ${EDITOR_TITLE_MAX} characters or less`),
    shortDescription: z.string().trim().max(EDITOR_SHORT_DESCRIPTION_MAX, `Description must be ${EDITOR_SHORT_DESCRIPTION_MAX} characters or less`),
    moduleId: z.string().min(1, "Select a module"),
    type: z.enum(LESSON_TYPES, { error: "Select a lesson type" }),
    durationMinutes: z.number({ error: "Enter the duration" }).int("Whole minutes only").min(1, "At least 1 minute").max(600, "600 minutes or less"),
    /** Rich-text HTML. Limit is on plain-text length. */
    body: z.string(),
    status: z.enum(LESSON_STATUSES),
    visibility: z.enum(LESSON_PUBLISH_VISIBILITY),
    publishDate: dateString,
    publishTime: timeString,
    thumbnailUrl: z.string(),
    order: z.number({ error: "Enter an order number" }).int("Whole numbers only").min(1, "Order starts at 1").max(999, "999 or less"),
  })
  .superRefine((v, ctx) => {
    const text = v.body.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (text.length > EDITOR_CONTENT_MAX) ctx.addIssue({ code: "custom", path: ["body"], message: `Content must be ${EDITOR_CONTENT_MAX} characters or less` });
    if (v.status === "SCHEDULED") {
      const at = combine(v.publishDate, v.publishTime);
      if (Number.isNaN(at)) ctx.addIssue({ code: "custom", path: ["publishDate"], message: "Pick a publish date for a scheduled lesson" });
      else if (at <= Date.now()) ctx.addIssue({ code: "custom", path: ["publishDate"], message: "Scheduled date must be in the future" });
    }
  });

// ---------------------------------------------------------------- Media
export const EDITOR_VIDEO_SOURCES = ["UPLOAD", "YOUTUBE", "VIMEO", "LINK", "LIBRARY"] as const;
export const SUBTITLE_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const lessonSubtitleSchema = z.object({
  id: z.string(),
  language: z.string().trim().min(2, "Select a language"),
  fileName: z.string().trim().min(1, "Upload a subtitle file"),
  url: z.string(),
  status: z.enum(SUBTITLE_STATUSES),
});

export const lessonEditorMediaSchema = z
  .object({
    video: z.object({
      source: z.enum(EDITOR_VIDEO_SOURCES),
      url: z.string().trim(),
      fileName: z.string(),
      fileSize: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
      durationSeconds: z.number().min(0),
      format: z.string(),
    }),
    player: z.object({
      enabled: z.boolean(),
      allowDownload: z.boolean(),
      playbackSpeed: z.boolean(),
      pictureInPicture: z.boolean(),
      showSubtitles: z.boolean(),
    }),
    posterUrl: z.string(),
    subtitles: z.array(lessonSubtitleSchema).max(20, "Add up to 20 subtitle files"),
  })
  .superRefine((v, ctx) => {
    const url = v.video.url;
    if (url && (url.startsWith("blob:") || !isHttpUrl(url))) ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid video URL starting with https://" });
    if (url && v.video.source === "YOUTUBE" && !/(youtube\.com|youtu\.be)\//i.test(url)) ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid YouTube link" });
    if (url && v.video.source === "VIMEO" && !/vimeo\.com\//i.test(url)) ctx.addIssue({ code: "custom", path: ["video", "url"], message: "Enter a valid Vimeo link" });
  });

// ---------------------------------------------------------------- Settings (no screenshot — general lesson behaviour)
export const COMPLETION_RULES = ["MANUAL", "AUTO_VIDEO", "ASSESSMENT"] as const;
export const LESSON_DIFFICULTY = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const lessonEditorSettingsSchema = z.object({
  freePreview: z.boolean(),
  allowComments: z.boolean(),
  allowQuestions: z.boolean(),
  showInCurriculum: z.boolean(),
  downloadableContent: z.boolean(),
  completion: z.enum(COMPLETION_RULES),
  /** % of the video that counts as watched when completion = AUTO_VIDEO. */
  watchThreshold: z.number({ error: "Enter a percentage" }).int("Whole numbers only").min(10, "At least 10%").max(100, "100% or less"),
  difficulty: z.enum(LESSON_DIFFICULTY),
  tags: z.array(z.string().trim().min(1)).max(10, "You can add up to 10 tags"),
});

// ---------------------------------------------------------------- Access
export const ACCESS_VISIBILITY = ["PUBLIC", "PRIVATE", "LOCKED"] as const;
export const ACCESS_TYPES = ["AFTER_ENROLLMENT", "PREVIOUS_LESSON", "SPECIFIC_LESSON"] as const;
export const GROUP_MODES = ["ALL", "SPECIFIC", "EXCLUDE"] as const;

export const lessonEditorAccessSchema = z
  .object({
    visibility: z.enum(ACCESS_VISIBILITY),
    accessType: z.enum(ACCESS_TYPES),
    prerequisiteLessonId: z.string(),
    /** Not editable yet (no student groups / plans in the LMS): always "ALL" / off. */
    groupMode: z.enum(GROUP_MODES),
    groupIds: z.array(z.string()),
    planRestriction: z.object({ enabled: z.boolean(), planIds: z.array(z.string()) }),
    dateRestriction: z.object({ enabled: z.boolean(), startDate: dateString, startTime: timeString, endDate: dateString, endTime: timeString }),
    geoRestriction: z.object({ enabled: z.boolean(), countries: z.array(z.string()) }),
  })
  .superRefine((v, ctx) => {
    if (v.accessType === "SPECIFIC_LESSON" && !v.prerequisiteLessonId) ctx.addIssue({ code: "custom", path: ["prerequisiteLessonId"], message: "Select the prerequisite lesson" });
    if (v.dateRestriction.enabled) {
      const start = combine(v.dateRestriction.startDate, v.dateRestriction.startTime);
      const end = combine(v.dateRestriction.endDate, v.dateRestriction.endTime);
      if (Number.isNaN(start)) ctx.addIssue({ code: "custom", path: ["dateRestriction", "startDate"], message: "Pick a start date" });
      if (Number.isNaN(end)) ctx.addIssue({ code: "custom", path: ["dateRestriction", "endDate"], message: "Pick an end date" });
      if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) ctx.addIssue({ code: "custom", path: ["dateRestriction", "endDate"], message: "End must be after the start" });
    }
    if (v.geoRestriction.enabled && v.geoRestriction.countries.length === 0) ctx.addIssue({ code: "custom", path: ["geoRestriction", "countries"], message: "Select at least one country" });
  });

// ---------------------------------------------------------------- Drip schedule
export const DRIP_RELEASE_TYPES = ["IMMEDIATE", "AFTER_ENROLLMENT", "SPECIFIC_DATE", "MANUAL"] as const;
export const DRIP_UNITS = ["DAYS", "WEEKS", "MONTHS"] as const;
export const BEFORE_RELEASE_MODES = ["SHOW_MESSAGE", "HIDE"] as const;
export const DRIP_MESSAGE_MAX = 200;

export const lessonEditorDripSchema = z
  .object({
    releaseType: z.enum(DRIP_RELEASE_TYPES),
    releaseValue: z.number({ error: "Enter a number" }).int("Whole numbers only").min(1, "At least 1").max(365, "365 or less"),
    releaseUnit: z.enum(DRIP_UNITS),
    releaseDate: dateString,
    releaseTime: timeString,
    dependencies: z.object({ enabled: z.boolean(), lessonIds: z.array(z.string()) }),
    beforeRelease: z.enum(BEFORE_RELEASE_MODES),
    lockedMessage: z.string().trim().max(DRIP_MESSAGE_MAX, `Message must be ${DRIP_MESSAGE_MAX} characters or less`),
  })
  .superRefine((v, ctx) => {
    if (v.releaseType === "SPECIFIC_DATE" && Number.isNaN(combine(v.releaseDate, v.releaseTime))) ctx.addIssue({ code: "custom", path: ["releaseDate"], message: "Pick a release date" });
    if (v.dependencies.enabled && v.dependencies.lessonIds.length === 0) ctx.addIssue({ code: "custom", path: ["dependencies", "lessonIds"], message: "Add at least one prerequisite lesson" });
    if (v.beforeRelease === "SHOW_MESSAGE" && v.releaseType !== "IMMEDIATE" && !v.lockedMessage) ctx.addIssue({ code: "custom", path: ["lockedMessage"], message: "Write the message students will see" });
  });

// ---------------------------------------------------------------- SEO
export const SEO_TITLE_MAX = 70;
export const SEO_DESCRIPTION_MAX = 160;

export const lessonEditorSeoSchema = z.object({
  title: z.string().trim().min(10, "SEO title must be at least 10 characters").max(SEO_TITLE_MAX, `Keep it under ${SEO_TITLE_MAX} characters`),
  description: z.string().trim().min(50, "SEO description must be at least 50 characters").max(SEO_DESCRIPTION_MAX, `Keep it under ${SEO_DESCRIPTION_MAX} characters`),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters").max(100, "Slug is too long").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  focusKeyword: z.string().trim().max(60, "Keep the keyword under 60 characters"),
  metaKeywords: z.array(z.string().trim().min(1)).max(15, "Add up to 15 keywords"),
  canonicalUrl: optionalUrl(),
});

// ---------------------------------------------------------------- Quiz
export const QUIZ_KINDS = ["GRADED", "PRACTICE"] as const;
export const QUESTION_ORDERS = ["SEQUENTIAL", "RANDOM"] as const;
export const RESULT_TIMINGS = ["AFTER_SUBMISSION", "AFTER_DEADLINE", "NEVER"] as const;
export const ATTEMPT_OPTIONS = ["UNLIMITED", "1", "2", "3", "5"] as const;

export const lessonEditorQuizSchema = z
  .object({
    enabled: z.boolean(),
    /** Server quiz id when it exists; "" otherwise. */
    id: z.string(),
    title: z.string().trim().max(100, "Quiz title must be 100 characters or less"),
    description: z.string().trim().max(200, "Description must be 200 characters or less"),
    kind: z.enum(QUIZ_KINDS),
    passingScore: z.number({ error: "Enter a passing score" }).int("Whole numbers only").min(1, "At least 1%").max(100, "100% or less"),
    questions: z.array(lessonQuizQuestionSchema).max(50, "Add up to 50 questions"),
    questionOrder: z.enum(QUESTION_ORDERS),
    showResults: z.enum(RESULT_TIMINGS),
    showCorrectAnswers: z.boolean(),
    showExplanations: z.boolean(),
    /** null = no time limit. */
    timeLimitMinutes: z.number().int("Whole minutes only").min(1, "At least 1 minute").max(300, "300 minutes or less").nullable(),
    attempts: z.enum(ATTEMPT_OPTIONS),
    requireToComplete: z.boolean(),
    showInNavigation: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (!v.enabled) return;
    if (v.title.length < 3) ctx.addIssue({ code: "custom", path: ["title"], message: "Quiz title must be at least 3 characters" });
    if (v.questions.length === 0) ctx.addIssue({ code: "custom", path: ["questions"], message: "Add at least one question" });
  });

// ---------------------------------------------------------------- Resources
export const RESOURCE_KINDS = ["FILE", "LINK"] as const;
export const RESOURCE_DESCRIPTION_MAX = 200;

export const lessonEditorResourceSchema = z
  .object({
    id: z.string(),
    kind: z.enum(RESOURCE_KINDS),
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(120, "Title must be 120 characters or less"),
    description: z.string().trim().max(RESOURCE_DESCRIPTION_MAX, `Description must be ${RESOURCE_DESCRIPTION_MAX} characters or less`),
    /** Hosted file URL or external link. */
    url: z.string().trim(),
    fileName: z.string(),
    /** Bytes; 0 for links. */
    size: z.number().int().min(0),
    /** Upper-case extension ("PDF", "ZIP") or "LINK". */
    format: z.string(),
    visible: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.kind === "LINK" && !isHttpUrl(v.url)) ctx.addIssue({ code: "custom", path: ["url"], message: "Enter a valid URL starting with https://" });
    if (v.kind === "FILE" && !v.url) ctx.addIssue({ code: "custom", path: ["url"], message: "Upload a file" });
  });

export const lessonEditorResourcesSchema = z.object({
  items: z.array(lessonEditorResourceSchema).max(30, "Add up to 30 resources"),
});

// ---------------------------------------------------------------- Notes
export const NOTE_MAX = 2000;

export const lessonEditorNoteSchema = z.object({
  id: z.string(),
  /** Rich-text HTML. */
  html: z.string().refine((h) => h.replace(/<[^>]*>/g, "").trim().length > 0, "Write the note"),
  important: z.boolean(),
  visibleToAll: z.boolean(),
  /** ISO datetime. */
  createdAt: z.string(),
  author: z.string(),
});

export const lessonEditorNotesSchema = z.object({
  enabled: z.boolean(),
  showInInstructorView: z.boolean(),
  items: z.array(lessonEditorNoteSchema).max(100, "Too many notes"),
});

// ---------------------------------------------------------------- Whole page
export const lessonEditorSchema = z.object({
  content: lessonEditorContentSchema,
  media: lessonEditorMediaSchema,
  settings: lessonEditorSettingsSchema,
  access: lessonEditorAccessSchema,
  drip: lessonEditorDripSchema,
  seo: lessonEditorSeoSchema,
  quiz: lessonEditorQuizSchema,
  resources: lessonEditorResourcesSchema,
  notes: lessonEditorNotesSchema,
});

export type LessonEditorValues = z.infer<typeof lessonEditorSchema>;
export type LessonEditorResource = z.infer<typeof lessonEditorResourceSchema>;
export type LessonEditorNote = z.infer<typeof lessonEditorNoteSchema>;
export type LessonSubtitle = z.infer<typeof lessonSubtitleSchema>;

/** Section key → tab (1:1, kept explicit for error → tab jumps). */
export const LESSON_EDITOR_SECTION_TAB: Record<keyof LessonEditorValues, LessonEditorTab> = {
  content: "content",
  media: "media",
  settings: "settings",
  access: "access",
  drip: "drip",
  seo: "seo",
  quiz: "quiz",
  resources: "resources",
  notes: "notes",
};
