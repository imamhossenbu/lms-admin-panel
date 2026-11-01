import type { AssignmentItem, AttemptsOption, GradingType, LateSubmissionPolicy, AssignmentType } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";

/** Display labels + formatters shared by the Assignment Details page. */

export const ASSIGNMENT_TYPE_LABEL: Record<AssignmentType, string> = { FILE_UPLOAD: "File Upload", TEXT: "Text Entry" };
export const GRADING_TYPE_LABEL: Record<GradingType, string> = { POINTS: "Points Based", PASS_FAIL: "Pass / Fail", NOT_GRADED: "Not Graded" };
export const LATE_POLICY_LABEL: Record<LateSubmissionPolicy, string> = {
  ALLOW: "Allowed",
  ALLOW_WITH_PENALTY: "Allowed with penalty",
  DISALLOW: "Not allowed",
};
export const attemptsLabel = (a: AttemptsOption) => (a === "UNLIMITED" ? "Unlimited" : `${a} attempt${a === "1" ? "" : "s"}`);

/** "Oct 25, 2026" from "YYYY-MM-DD" (local, no timezone shift). */
export function formatDueDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "—";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "11:59 PM" from "HH:mm". */
export function formatDueTime(time: string) {
  const [h, min] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(min)) return "—";
  return new Date(2000, 0, 1, h, min).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** "Oct 20, 2026, 10:24 AM". */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** "1h 24m" / "45m" / "-". */
export function formatDuration(minutes: number | null) {
  if (minutes === null || minutes < 0) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/** "Module 1: Getting Started" and "Lesson 4: Your First HTML Page" (lesson "" when not tied to one). */
export function assignmentLocation(assignment: Pick<AssignmentItem, "moduleId" | "lessonId">, context: LessonEditorContext) {
  const mod = context.modules.find((m) => m.id === assignment.moduleId);
  const lesson = context.lessons.find((l) => l.id === assignment.lessonId);
  return {
    moduleLabel: mod ? `Module ${mod.order}: ${mod.title}` : "",
    lessonLabel: lesson ? `Lesson ${lesson.order}: ${lesson.title}` : "",
  };
}
