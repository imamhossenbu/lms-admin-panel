import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { WizardAssignmentFields } from "@/lib/assignmentWizardMapping";
import { buildAssignmentSeed, ENROLLED_STUDENTS, type AssignmentSeed } from "@/data/mockAssignmentData";
import { MOCK_LESSON_COURSE_ID } from "@/data/mockLessonEditorData";

/**
 * Mock-first persistence for Assignments (localStorage). All functions are async and simulate
 * latency so loading states / toasts behave like the real API. Replace with API calls later.
 */

const STORAGE_KEY = "edupro_assignments_v2";
export const ASSIGNMENTS_UPDATED_EVENT = "edupro_assignments_updated";
const LATENCY = 450;

const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function read(): AssignmentSeed {
  if (typeof window === "undefined") return buildAssignmentSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AssignmentSeed;
      if (Array.isArray(parsed?.assignments) && Array.isArray(parsed?.submissions)) return parsed;
    }
  } catch {
    /* fall through to a fresh seed */
  }
  const seed = buildAssignmentSeed();
  write(seed);
  return seed;
}

function write(data: AssignmentSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(ASSIGNMENTS_UPDATED_EVENT));
}

// ---------------------------------------------------------------- reads (sync snapshot + async)
/** Synchronous snapshot (for initial render / derived stats). */
export const getAssignmentsSnapshot = (courseId: string = MOCK_LESSON_COURSE_ID) =>
  read().assignments.filter((a) => a.courseId === courseId);

export const getSubmissionsSnapshot = (assignmentId?: string) =>
  read().submissions.filter((s) => !assignmentId || s.assignmentId === assignmentId);

export async function fetchAssignments(courseId: string = MOCK_LESSON_COURSE_ID): Promise<AssignmentItem[]> {
  await wait(300);
  return getAssignmentsSnapshot(courseId);
}

export async function fetchAssignment(id: string): Promise<AssignmentItem | null> {
  await wait(300);
  return read().assignments.find((a) => a.id === id) ?? null;
}

export async function fetchSubmissions(assignmentId?: string): Promise<AssignmentSubmission[]> {
  await wait(300);
  return getSubmissionsSnapshot(assignmentId);
}

// ---------------------------------------------------------------- writes
/** Create from the wizard (status: PUBLISHED on "Create Assignment"). */
export async function createAssignment(fields: WizardAssignmentFields, status: AssignmentItem["status"] = "PUBLISHED"): Promise<AssignmentItem> {
  await wait();
  const data = read();
  const now = new Date().toISOString();
  const item: AssignmentItem = { ...fields, id: uid("assignment"), status, enrolledCount: ENROLLED_STUDENTS, createdAt: now, updatedAt: now };
  write({ ...data, assignments: [item, ...data.assignments] });
  return item;
}

export async function updateAssignment(id: string, patch: Partial<Omit<AssignmentItem, "id" | "courseId" | "createdAt">>): Promise<AssignmentItem> {
  await wait();
  const data = read();
  const current = data.assignments.find((a) => a.id === id);
  if (!current) throw new Error("This assignment no longer exists.");
  const next: AssignmentItem = { ...current, ...patch, updatedAt: new Date().toISOString() };
  write({ ...data, assignments: data.assignments.map((a) => (a.id === id ? next : a)) });
  return next;
}

export async function deleteAssignment(id: string): Promise<void> {
  await wait();
  const data = read();
  write({ assignments: data.assignments.filter((a) => a.id !== id), submissions: data.submissions.filter((s) => s.assignmentId !== id) });
}

/** Copy as a DRAFT without submissions. */
export async function duplicateAssignment(id: string): Promise<AssignmentItem> {
  await wait();
  const data = read();
  const source = data.assignments.find((a) => a.id === id);
  if (!source) throw new Error("This assignment no longer exists.");
  const now = new Date().toISOString();
  const copy: AssignmentItem = { ...structuredClone(source), id: uid("assignment"), title: `${source.title} (Copy)`.slice(0, 100), status: "DRAFT", createdAt: now, updatedAt: now };
  const index = data.assignments.findIndex((a) => a.id === id);
  const assignments = [...data.assignments];
  assignments.splice(index + 1, 0, copy);
  write({ ...data, assignments });
  return copy;
}

export async function gradeSubmission(
  submissionId: string,
  grade: { score: number; feedback: string; criterionScores?: Record<string, number> }
): Promise<AssignmentSubmission> {
  await wait();
  const data = read();
  const current = data.submissions.find((s) => s.id === submissionId);
  if (!current) throw new Error("This submission no longer exists.");
  const next: AssignmentSubmission = {
    ...current,
    status: "GRADED",
    score: grade.score,
    feedback: grade.feedback,
    criterionScores: grade.criterionScores ?? current.criterionScores,
    gradedAt: new Date().toISOString(),
  };
  write({ ...data, submissions: data.submissions.map((s) => (s.id === submissionId ? next : s)) });
  return next;
}

/** Mock: pretend to email students with pending work; returns how many would be reminded. */
export async function sendPendingReminders(assignmentId: string): Promise<number> {
  await wait(700);
  const data = read();
  const assignment = data.assignments.find((a) => a.id === assignmentId);
  if (!assignment) throw new Error("This assignment no longer exists.");
  const submitted = new Set(data.submissions.filter((s) => s.assignmentId === assignmentId).map((s) => s.student.id));
  return Math.max(0, assignment.enrolledCount - submitted.size);
}

/** Reset to the original seed (handy while designing). */
export function resetAssignmentMockData() {
  write(buildAssignmentSeed());
}
