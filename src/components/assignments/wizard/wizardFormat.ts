import { FileUp, Link2, Type, type LucideIcon } from "lucide-react";
import type { AssignmentDifficulty, AssignmentType } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { htmlToText } from "@/lib/sanitizeHtml";
import { cachedCourseContext, courseTitleOf, emptyCourseContext } from "@/lib/courseCatalog";

/** Labels + small formatters shared by the Create/Edit Assignment wizard. */

export const WIZARD_TYPE_LABEL: Record<AssignmentType, string> = {
  FILE_UPLOAD: "File Upload",
  TEXT: "Text Submission",
  LINK: "External Link",
};

export const WIZARD_TYPE_ICON: Record<AssignmentType, LucideIcon> = {
  FILE_UPLOAD: FileUp,
  TEXT: Type,
  LINK: Link2,
};

export const WIZARD_DIFFICULTY_LABEL: Record<AssignmentDifficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/** "~1 hour" / "~2 hours" / "~30 min" / "" when 0. */
export function estimatedTimeLabel(time: number, unit: "MINUTES" | "HOURS") {
  if (!Number.isFinite(time) || time <= 0) return "";
  if (unit === "MINUTES") return `~${time} min`;
  return `~${time} hour${time === 1 ? "" : "s"}`;
}

/** Placeholder context before a course is chosen: empty title (UI shows "Select a course"), no modules / lessons. */
/** The selected course's curriculum from the catalogue cache (empty until it loads, or with no course). */
export const wizardCourseContext = (courseId: string): LessonEditorContext =>
  (courseId && cachedCourseContext(courseId)) || emptyCourseContext(courseId, courseId ? courseTitleOf(courseId) : "");

export const wizardCourseTitle = (context: LessonEditorContext) => context.course.title || "Select a course";

/** "Module 1: Getting Started" (or "" when not found). */
export function wizardModuleLabel(context: LessonEditorContext, moduleId: string) {
  const mod = context.modules.find((m) => m.id === moduleId);
  return mod ? `Module ${mod.order}: ${mod.title}` : "";
}

/** Plain text of rich-text HTML. */
export const plainText = (html: string) => htmlToText(html ?? "");

/** Text of each <li> in the HTML. */
export function htmlListItems(html: string): string[] {
  return Array.from((html ?? "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((m) => htmlToText(m[1]))
    .filter(Boolean);
}

/** Text of the first paragraph (used as "Assignment Overview"). */
export function firstParagraph(html: string): string {
  const match = (html ?? "").match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return match ? htmlToText(match[1]) : "";
}

/** "Oct 25, 2026 at 11:59 PM" from "YYYY-MM-DD" + "HH:mm". */
export function formatDateAt(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "—";
  const [h, min] = (time || "00:00").split(":").map(Number);
  const dt = new Date(y, m - 1, d, h || 0, min || 0);
  const day = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const t = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day} at ${t}`;
}

/** "24 (75%)" / "Not set". */
export function passingScoreLabel(passingScore: number | null, totalPoints: number) {
  if (passingScore === null) return "Not set";
  const pct = totalPoints > 0 ? Math.round((passingScore / totalPoints) * 100) : 0;
  return `${passingScore} (${pct}%)`;
}
