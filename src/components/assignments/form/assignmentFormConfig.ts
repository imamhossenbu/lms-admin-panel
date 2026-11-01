import type { AssignmentItem } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { assignmentFormSchema, type AssignmentFormValues } from "@/validations/assignmentSchema";
import { dueAt } from "@/lib/assignmentStats";

export type AssignmentFormMode = "create" | "edit";

const pad = (n: number) => String(n).padStart(2, "0");
const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** New assignment: first module, due in 7 days at 23:59, 100 points, published. */
export function defaultAssignmentValues(context: LessonEditorContext, now: Date = new Date()): AssignmentFormValues {
  const due = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  return {
    title: "",
    descriptionHtml: "",
    moduleId: context.modules[0]?.id ?? "",
    lessonId: "",
    type: "FILE_UPLOAD",
    dueDate: toDateInput(due),
    dueTime: "23:59",
    totalPoints: 100,
    attempts: "UNLIMITED",
    lateSubmission: "ALLOW",
    gradingType: "POINTS",
    showRubric: true,
    peerReview: false,
    status: "PUBLISHED",
    attachments: [],
  };
}

/** Picks exactly the form fields from a stored assignment (edit mode). */
export const toFormValues = (a: AssignmentItem): AssignmentFormValues => ({
  title: a.title,
  descriptionHtml: a.descriptionHtml,
  moduleId: a.moduleId,
  lessonId: a.lessonId,
  type: a.type,
  dueDate: a.dueDate,
  dueTime: a.dueTime,
  totalPoints: a.totalPoints,
  attempts: a.attempts,
  lateSubmission: a.lateSubmission,
  gradingType: a.gradingType,
  showRubric: a.showRubric,
  peerReview: a.peerReview,
  status: a.status,
  attachments: a.attachments.map((f) => ({ ...f })),
});

/** Create mode additionally requires the due moment to be in the future (error shown under Due Date). */
export const createAssignmentSchema = assignmentFormSchema.superRefine((v, ctx) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(v.dueDate) && /^\d{2}:\d{2}$/.test(v.dueTime) && dueAt(v).getTime() <= Date.now()) {
    ctx.addIssue({ code: "custom", path: ["dueDate"], message: "Due date and time must be in the future" });
  }
});

/** Plain-text length of rich-text HTML (matches the schema's counting). */
export const plainTextLength = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

// ---------------------------------------------------------------- option lists
export const TYPE_OPTIONS = [
  { value: "FILE_UPLOAD" as const, title: "File Upload", description: "Students will upload files (PDF, ZIP, images, etc.)" },
  { value: "TEXT" as const, title: "Text Submission", description: "Students will submit text or code directly" },
];

export const GRADING_OPTIONS = [
  { value: "POINTS" as const, title: "Points Based", description: "Grade out of total points" },
  { value: "PASS_FAIL" as const, title: "Pass/Fail", description: "Simple pass or fail grading" },
  { value: "NOT_GRADED" as const, title: "Not Graded", description: "This assignment will not be graded" },
];

export const VISIBILITY_OPTIONS = [
  { value: "PUBLISHED" as const, title: "Published", description: "Visible to students immediately" },
  { value: "DRAFT" as const, title: "Draft", description: "Save as draft, not visible to students" },
];

export const ATTEMPT_OPTIONS = [
  { value: "UNLIMITED", label: "Unlimited" },
  { value: "1", label: "1 attempt" },
  { value: "2", label: "2 attempts" },
  { value: "3", label: "3 attempts" },
  { value: "5", label: "5 attempts" },
];

export const LATE_OPTIONS = [
  { value: "ALLOW", label: "Allow" },
  { value: "ALLOW_WITH_PENALTY", label: "Allow with penalty" },
  { value: "DISALLOW", label: "Don't allow" },
];

/** Radix Select can't hold "" — the "no lesson" option uses this sentinel. */
export const NO_LESSON = "__none__";

// ---------------------------------------------------------------- attachments
export const ATTACHMENT_EXTENSIONS = ["PDF", "DOC", "DOCX", "PPT", "PPTX", "ZIP"] as const;
export const ATTACHMENT_ACCEPT = ATTACHMENT_EXTENSIONS.map((e) => `.${e.toLowerCase()}`).join(",");
export const ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024;
export const ATTACHMENT_MAX_COUNT = 10;
