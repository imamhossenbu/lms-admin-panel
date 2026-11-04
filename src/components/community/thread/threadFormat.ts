import type { Tone } from "@/components/ui/ToneBadge";
import { courseTitleOf, useCourseContext } from "@/lib/courseCatalog";
import { apiErrorMessage } from "@/lib/apiError";
import { htmlToText } from "@/lib/sanitizeHtml";
import type { ReportReason, ReportStatus } from "@/types/community";

/** Friendly message for a thrown error (never a raw stack / status code). */
export const errorText = (e: unknown) => apiErrorMessage(e, "Something went wrong. Please try again.");

/** "Oct 20, 2026, 9:41 AM" — used for hover titles and info rows. */
export const exactDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

/** "Oct 20, 2026". */
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Course + module titles for a thread ("Course-wide" when no module); loads the course curriculum (cached). */
export function useCourseLabels(courseId: string, moduleId: string) {
  const ctx = useCourseContext(courseId);
  const mod = moduleId ? ctx?.modules.find((m) => m.id === moduleId) : null;
  return { course: ctx?.course.title || courseTitleOf(courseId) || "Loading course…", module: mod ? mod.title : moduleId && !ctx ? "…" : "Course-wide" };
}

/** Plain-text length of rich text (matches the zod schema's counting). */
export const plainLength = (html: string) => htmlToText(html).length;

/** One-line plain-text excerpt. */
export function excerpt(html: string, max = 90) {
  const text = htmlToText(html);
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export const plural = (n: number, word: string, many = `${word}s`) => `${n.toLocaleString()} ${n === 1 ? word : many}`;

export const REPORT_REASON_META: Record<ReportReason, { label: string; tone: Tone }> = {
  SPAM: { label: "Spam", tone: "yellow" },
  ABUSIVE: { label: "Abusive", tone: "red" },
  OFF_TOPIC: { label: "Off-topic", tone: "blue" },
  PLAGIARISM: { label: "Plagiarism", tone: "purple" },
  OTHER: { label: "Other", tone: "gray" },
};

export const REPORT_STATUS_META: Record<ReportStatus, { label: string; tone: Tone }> = {
  OPEN: { label: "Open", tone: "red" },
  DISMISSED: { label: "Dismissed", tone: "gray" },
  ACTIONED: { label: "Actioned", tone: "green" },
};

/** DOM id of a reply card (used for jump links and scroll-to-new-reply). */
export const replyDomId = (id: string) => `reply-${id}`;

export function scrollToReply(id: string) {
  document.getElementById(replyDomId(id))?.scrollIntoView({ behavior: "smooth", block: "center" });
}
