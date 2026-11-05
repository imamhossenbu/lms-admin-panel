import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { WizardAssignmentFields } from "@/lib/assignmentWizardMapping";
import { apiClient } from "@/lib/api";

/**
 * Assignments data layer, backed by the Assignments API (`/admin/assignments*`, workspace-scoped).
 * Function names match the earlier mock store so the screens didn't change. Every write announces
 * ASSIGNMENTS_UPDATED_EVENT so open lists refresh. Errors are Axios errors (show them with apiErrorMessage).
 */

export const ASSIGNMENTS_UPDATED_EVENT = "edupro_assignments_updated";

/** Per-assignment submission counters returned with every list row. */
export interface AssignmentSubmissionCounts {
  total: number;
  graded: number;
  pending: number;
  late: number;
}
export type AssignmentListItem = AssignmentItem & { submissionCounts: AssignmentSubmissionCounts };

export interface CourseAssignmentStats {
  totalAssignments: number;
  totalSubmissions: number;
  pendingReview: number;
  graded: number;
}

interface Page<T> {
  data: T[];
  meta: { page: number; totalPages: number; total: number };
}

const enc = encodeURIComponent;
const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(ASSIGNMENTS_UPDATED_EVENT));
let lastList: AssignmentListItem[] = [];

async function allPages<T>(url: string, params: Record<string, unknown>): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data } = await apiClient.get<Page<T>>(url, { params: { ...params, page, limit: 100 } });
    rows.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return rows;
}

// ---------------------------------------------------------------- reads

/** The last fetched list (sync, for pickers such as "copy rubric from"). */
export const getAssignmentsSnapshot = (courseId?: string): AssignmentListItem[] => lastList.filter((a) => !courseId || a.courseId === courseId);

/** Every assignment (of one course when `courseId` is given), with submission counters. */
export async function fetchAssignments(courseId?: string): Promise<AssignmentListItem[]> {
  const rows = await allPages<AssignmentListItem>("/admin/assignments", courseId ? { courseId } : {});
  lastList = courseId ? [...lastList.filter((a) => a.courseId !== courseId), ...rows] : rows;
  return rows;
}

/** Assignments list query, mirrored in the panel URL ("All" / "" = no filter). */
export interface AssignmentQuery {
  courseId?: string;
  tab?: string;
  q?: string;
  moduleId?: string;
  status?: string;
  type?: string;
  /** Due-date sort; null = newest first. */
  dueSort?: "asc" | "desc" | null;
  page: number;
  limit: number;
}

/** One page of assignments (with submission counters) for the list screen. */
export async function fetchAssignmentsPage(q: AssignmentQuery): Promise<{ rows: AssignmentListItem[]; total: number }> {
  const params: Record<string, unknown> = { page: q.page, limit: q.limit, ...(q.dueSort ? { sortBy: "dueDate", sortOrder: q.dueSort } : { sortBy: "createdAt", sortOrder: "desc" }) };
  for (const k of ["courseId", "tab", "q", "moduleId", "status", "type"] as const) {
    const v = q[k]?.trim();
    if (v && v !== "All" && v !== "all") params[k] = v;
  }
  const { data } = await apiClient.get<Page<AssignmentListItem>>("/admin/assignments", { params });
  lastList = [...lastList.filter((a) => !data.data.some((r) => r.id === a.id)), ...data.data];
  return { rows: data.data, total: data.meta.total };
}

/** Stat cards (totals across the course's assignments, or all of them). */
export const fetchAssignmentStats = async (courseId?: string) =>
  (await apiClient.get<CourseAssignmentStats>("/admin/assignments/stats", { params: courseId ? { courseId } : {} })).data;

/** One assignment, or null when it isn't in this workspace. */
export async function fetchAssignment(id: string): Promise<AssignmentItem | null> {
  try {
    return (await apiClient.get<AssignmentItem>(`/admin/assignments/${enc(id)}`)).data;
  } catch (err) {
    if ((err as { response?: { status?: number } }).response?.status === 404) return null;
    throw err;
  }
}

/** Every submission of an assignment. */
export async function fetchSubmissions(assignmentId?: string): Promise<AssignmentSubmission[]> {
  if (!assignmentId) return [];
  return allPages<AssignmentSubmission>(`/admin/assignments/${enc(assignmentId)}/submissions`, {});
}

// ---------------------------------------------------------------- writes

/** Create from the wizard (status: PUBLISHED on "Create Assignment"). */
export async function createAssignment(fields: WizardAssignmentFields, status: AssignmentItem["status"] = "PUBLISHED"): Promise<AssignmentItem> {
  const { data } = await apiClient.post<AssignmentItem>("/admin/assignments", { ...fields, status });
  announce();
  return data;
}

export async function updateAssignment(id: string, patch: Partial<Omit<AssignmentItem, "id" | "courseId" | "createdAt">>): Promise<AssignmentItem> {
  // Server-computed fields are never sent back.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enrolledCount, updatedAt, ...body } = patch as Partial<AssignmentItem>;
  const { data } = await apiClient.patch<AssignmentItem>(`/admin/assignments/${enc(id)}`, body);
  announce();
  return data;
}

/** Deletes the assignment with its submissions and grades. */
export async function deleteAssignment(id: string): Promise<void> {
  await apiClient.delete(`/admin/assignments/${enc(id)}`);
  lastList = lastList.filter((a) => a.id !== id);
  announce();
}

/** Copy as a DRAFT without submissions. */
export async function duplicateAssignment(id: string): Promise<AssignmentItem> {
  const { data } = await apiClient.post<AssignmentItem>(`/admin/assignments/${enc(id)}/duplicate`);
  announce();
  return data;
}

export async function gradeSubmission(submissionId: string, grade: { score: number; feedback: string; criterionScores?: Record<string, number> }): Promise<AssignmentSubmission> {
  const { data } = await apiClient.patch<AssignmentSubmission>(`/admin/assignments/submissions/${enc(submissionId)}/grade`, grade);
  announce();
  return data;
}

/** Emails enrolled students who haven't submitted yet; resolves to how many were reminded. */
export async function sendPendingReminders(assignmentId: string): Promise<number> {
  const { data } = await apiClient.post<{ reminded: number; failed: number }>(`/admin/assignments/${enc(assignmentId)}/reminders`);
  return data.reminded;
}
