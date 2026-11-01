import type { AssignmentItem, AssignmentStatus, AssignmentSubmission, AssignmentType } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { Tone } from "@/components/ui/ToneBadge";
import { dueAt } from "@/lib/assignmentStats";

/** Tabs on the Assignments list (?tab=…). */
export const ASSIGNMENT_LIST_TABS = [
  { id: "all", label: "All Assignments" },
  { id: "pending", label: "Pending Review" },
  { id: "graded", label: "Graded" },
  { id: "drafts", label: "Drafts" },
] as const;
export type AssignmentListTab = (typeof ASSIGNMENT_LIST_TABS)[number]["id"];

export const parseListTab = (value: string): AssignmentListTab =>
  (ASSIGNMENT_LIST_TABS.find((t) => t.id === value)?.id ?? "all") as AssignmentListTab;

export const ASSIGNMENT_TYPE_VIEW: Record<AssignmentType, { label: string; tone: Tone }> = {
  FILE_UPLOAD: { label: "File Upload", tone: "blue" },
  TEXT: { label: "Text Submission", tone: "purple" },
};

export const ASSIGNMENT_STATUS_VIEW: Record<AssignmentStatus, { label: string; tone: Tone }> = {
  PUBLISHED: { label: "Published", tone: "green" },
  DRAFT: { label: "Draft", tone: "gray" },
};

export const STATUS_FILTER_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
];

export const TYPE_FILTER_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "FILE_UPLOAD", label: "File Upload" },
  { value: "TEXT", label: "Text Submission" },
];

export type DueSort = "asc" | "desc" | null;
export const parseDueSort = (value: string): DueSort => (value === "asc" || value === "desc" ? value : null);
export const nextDueSort = (current: DueSort): DueSort => (current === null ? "asc" : current === "asc" ? "desc" : null);

/** Per-assignment submission counters, built once per render. */
export interface SubmissionCounts {
  submitted: number;
  pending: number;
}

export function countSubmissions(submissions: AssignmentSubmission[]) {
  const map = new Map<string, SubmissionCounts>();
  submissions.forEach((s) => {
    const entry = map.get(s.assignmentId) ?? { submitted: 0, pending: 0 };
    entry.submitted += 1;
    if (s.status === "PENDING") entry.pending += 1;
    map.set(s.assignmentId, entry);
  });
  return map;
}

const EMPTY_COUNTS: SubmissionCounts = { submitted: 0, pending: 0 };
export const countsFor = (map: Map<string, SubmissionCounts>, id: string) => map.get(id) ?? EMPTY_COUNTS;

export function matchesTab(a: AssignmentItem, tab: AssignmentListTab, counts: SubmissionCounts) {
  if (tab === "pending") return counts.pending > 0;
  if (tab === "graded") return a.status === "PUBLISHED" && counts.submitted > 0 && counts.pending === 0;
  if (tab === "drafts") return a.status === "DRAFT";
  return true;
}

/** "Module 1: Getting Started" / "Lesson 3: Your First HTML Page" (lesson line is null when not linked). */
export function moduleLessonLabels(a: Pick<AssignmentItem, "moduleId" | "lessonId">, context: LessonEditorContext) {
  const mod = context.modules.find((m) => m.id === a.moduleId);
  const lesson = a.lessonId ? context.lessons.find((l) => l.id === a.lessonId) : undefined;
  return {
    module: mod ? `Module ${mod.order}: ${mod.title}` : "Unassigned module",
    lesson: lesson ? `Lesson ${lesson.order}: ${lesson.title}` : null,
  };
}

export const moduleFilterOptions = (context: LessonEditorContext) => [
  { value: "All", label: "All Modules" },
  ...context.modules.map((m) => ({ value: m.id, label: `Module ${m.order}: ${m.title}` })),
];

/** "Oct 25, 2026" */
export const formatDueDate = (a: Pick<AssignmentItem, "dueDate" | "dueTime">) =>
  dueAt(a).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const sortByDue = (list: AssignmentItem[], sort: DueSort) =>
  sort ? [...list].sort((x, y) => (dueAt(x).getTime() - dueAt(y).getTime()) * (sort === "asc" ? 1 : -1)) : list;

export const submissionPct = (submitted: number, enrolled: number) => (enrolled > 0 ? Math.min(100, Math.round((submitted / enrolled) * 100)) : 0);

/** Empty-state copy per tab when nothing is filtered. */
export const EMPTY_TAB_COPY: Record<AssignmentListTab, { title: string; text: string }> = {
  all: { title: "No assignments yet", text: "Create your first assignment to start collecting student work." },
  pending: { title: "Nothing to review", text: "Every submission has been graded. New submissions will show up here." },
  graded: { title: "No fully graded assignments", text: "Published assignments appear here once all their submissions are graded." },
  drafts: { title: "No drafts", text: "Assignments saved as drafts are listed here until you publish them." },
};
