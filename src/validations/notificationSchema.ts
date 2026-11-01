import { z } from "zod";
import type { TemplateTrigger } from "@/types/notification";

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
const isHttpOrPath = (v: string) => v.startsWith("/") || /^https?:\/\/[^\s]+\.[^\s]+/.test(v);

export const BROADCAST_TITLE_MAX = 100;
export const BROADCAST_MESSAGE_MAX = 2000;
/** Push notifications are truncated by devices — keep the plain-text message short when PUSH is selected. */
export const PUSH_MESSAGE_MAX = 180;

/** Compose / edit broadcast (/notifications/compose, /notifications/broadcasts/[id]/edit). */
export const broadcastFormSchema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(BROADCAST_TITLE_MAX, `${BROADCAST_TITLE_MAX} characters or less`),
    messageHtml: z
      .string()
      .refine((h) => plainLength(h) >= 10, "Write at least 10 characters")
      .refine((h) => plainLength(h) <= BROADCAST_MESSAGE_MAX, `Keep it under ${BROADCAST_MESSAGE_MAX} characters`),
    audience: z.enum(["ALL_STUDENTS", "COURSE", "INSTRUCTORS", "INACTIVE_STUDENTS"]),
    courseIds: z.array(z.string()),
    channels: z.array(z.enum(["IN_APP", "EMAIL", "PUSH"])).min(1, "Choose at least one channel"),
    priority: z.enum(["NORMAL", "HIGH"]),
    ctaLabel: z.string().trim().max(30, "30 characters or less"),
    ctaUrl: z.string().trim(),
    timing: z.enum(["NOW", "SCHEDULE"]),
    /** "YYYY-MM-DDTHH:mm" (datetime-local) when timing = SCHEDULE. */
    scheduledAt: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.audience === "COURSE" && v.courseIds.length === 0) ctx.addIssue({ code: "custom", path: ["courseIds"], message: "Select at least one course" });
    if ((v.ctaLabel && !v.ctaUrl) || (!v.ctaLabel && v.ctaUrl))
      ctx.addIssue({ code: "custom", path: [v.ctaLabel ? "ctaUrl" : "ctaLabel"], message: "Add both a button label and a link" });
    if (v.ctaUrl && !isHttpOrPath(v.ctaUrl)) ctx.addIssue({ code: "custom", path: ["ctaUrl"], message: "Use an https:// link or a page path like /courses" });
    if (v.channels.includes("PUSH") && plainLength(v.messageHtml) > PUSH_MESSAGE_MAX)
      ctx.addIssue({ code: "custom", path: ["messageHtml"], message: `Push messages must be ${PUSH_MESSAGE_MAX} characters or less — shorten it or turn off Push` });
    if (v.timing === "SCHEDULE") {
      const t = Date.parse(v.scheduledAt);
      if (Number.isNaN(t)) ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "Pick a date and time" });
      else if (t < Date.now() + 5 * 60000) ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "Schedule at least 5 minutes from now" });
    }
  });
export type BroadcastFormValues = z.infer<typeof broadcastFormSchema>;

/** Placeholders available per automated trigger (subject/body may only use these). */
export const TRIGGER_PLACEHOLDERS: Record<TemplateTrigger, string[]> = {
  ENROLLMENT_CONFIRMED: ["{student_name}", "{course_title}", "{course_url}"],
  PAYMENT_RECEIPT: ["{student_name}", "{order_id}", "{amount}", "{payment_method}"],
  ASSIGNMENT_GRADED: ["{student_name}", "{assignment_title}", "{score}", "{course_title}"],
  QUIZ_RESULT: ["{student_name}", "{quiz_title}", "{score}", "{result}"],
  LIVE_CLASS_REMINDER: ["{student_name}", "{class_title}", "{start_time}", "{join_url}"],
  CERTIFICATE_ISSUED: ["{student_name}", "{course_title}", "{certificate_url}"],
  COMMUNITY_REPLY: ["{student_name}", "{discussion_title}", "{reply_author}", "{discussion_url}"],
  COURSE_COMPLETED: ["{student_name}", "{course_title}"],
  PASSWORD_RESET: ["{student_name}", "{reset_url}", "{expires_in}"],
};

/** Automated template editor. `trigger` is passed in to validate placeholders. */
export const templateEditorSchema = (trigger: TemplateTrigger) =>
  z
    .object({
      name: z.string().trim().min(3, "Name is required").max(60, "60 characters or less"),
      subject: z.string().trim().min(3, "Subject is required").max(120, "120 characters or less"),
      body: z.string().trim().min(10, "Write at least 10 characters").max(1500, "1500 characters or less"),
      channels: z.array(z.enum(["IN_APP", "EMAIL", "PUSH"])).min(1, "Choose at least one channel"),
      enabled: z.boolean(),
    })
    .superRefine((v, ctx) => {
      const allowed = TRIGGER_PLACEHOLDERS[trigger];
      (["subject", "body"] as const).forEach((field) => {
        const unknown = (v[field].match(/\{[a-z_]+\}/g) ?? []).find((p) => !allowed.includes(p));
        if (unknown) ctx.addIssue({ code: "custom", path: [field], message: `${unknown} isn't available for this event` });
      });
    });
export type TemplateEditorValues = z.infer<ReturnType<typeof templateEditorSchema>>;
