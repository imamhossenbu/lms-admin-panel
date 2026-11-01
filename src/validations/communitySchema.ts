import { z } from "zod";

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

export const THREAD_TITLE_MAX = 150;
export const THREAD_BODY_MAX = 5000;
export const REPLY_MAX = 3000;
export const THREAD_TAGS_MAX = 5;

/** New / Edit discussion form (/community/new, /community/[id]/edit). */
export const threadFormSchema = z.object({
  title: z.string().trim().min(8, "Title must be at least 8 characters").max(THREAD_TITLE_MAX, `Title must be ${THREAD_TITLE_MAX} characters or less`),
  category: z.enum(["QUESTION", "DISCUSSION", "ANNOUNCEMENT", "SHOWCASE", "FEEDBACK"]),
  courseId: z.string().min(1, "Select a course"),
  moduleId: z.string(),
  bodyHtml: z
    .string()
    .refine((h) => plainLength(h) >= 20, "Write at least 20 characters")
    .refine((h) => plainLength(h) <= THREAD_BODY_MAX, `Keep it under ${THREAD_BODY_MAX} characters`),
  tags: z
    .array(z.string().trim().toLowerCase().min(2, "Tags need at least 2 characters").max(24, "Tags must be 24 characters or less").regex(/^[a-z0-9-]+$/, "Use letters, numbers and dashes"))
    .max(THREAD_TAGS_MAX, `Up to ${THREAD_TAGS_MAX} tags`),
  isPinned: z.boolean(),
  isLocked: z.boolean(),
});
export type ThreadFormValues = z.infer<typeof threadFormSchema>;

/** Reply composer (thread page). */
export const replyFormSchema = z.object({
  bodyHtml: z
    .string()
    .refine((h) => plainLength(h) >= 2, "Write a reply")
    .refine((h) => plainLength(h) <= REPLY_MAX, `Keep it under ${REPLY_MAX} characters`),
});
export type ReplyFormValues = z.infer<typeof replyFormSchema>;

/** Moderator note when resolving a report. */
export const reportResolutionSchema = z.object({
  action: z.enum(["DISMISS", "REMOVE_CONTENT", "HIDE_THREAD"]),
  note: z.string().trim().max(300, "300 characters or less"),
});
export type ReportResolutionValues = z.infer<typeof reportResolutionSchema>;
