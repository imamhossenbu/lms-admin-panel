import { apiClient } from "@/lib/api";
import type { ApiPage } from "@/types/api";
import type {
  ActivityLogEntry,
  CreateInstructorPayload,
  InstructorCourseRow,
  InstructorDetails,
  InstructorListItem,
  InstructorListQuery,
  InstructorNoteItem,
  InstructorNotePayload,
  InstructorReviewRow,
  InstructorStatusLabel,
  InstructorStudentRow,
  ReviewSummary,
  ScheduleEvent,
  UpdateInstructorPayload,
} from "@/types/instructorApi";

const base = (id: string) => `/instructors/${encodeURIComponent(id)}`;
const get = async <T>(url: string, params?: object) => (await apiClient.get<T>(url, { params })).data;
const send = async <T>(method: "post" | "patch" | "delete", url: string, body?: unknown) => (await apiClient.request<T>({ method, url, data: body })).data;

/** Instructors API (workspace-scoped; the API checks the `instructors` team permission). */
export const instructorsApi = {
  list: (query: InstructorListQuery) => get<ApiPage<InstructorListItem>>("/instructors", query),
  expertiseOptions: () => get<string[]>("/instructors/expertise-options"),
  get: (id: string) => get<InstructorDetails>(base(id)),
  create: (payload: CreateInstructorPayload) => send<InstructorDetails>("post", "/instructors", payload),
  update: (id: string, payload: UpdateInstructorPayload) => send<InstructorDetails>("patch", base(id), payload),
  setStatus: (id: string, status: InstructorStatusLabel) => send<InstructorDetails>("patch", `${base(id)}/status`, { status }),
  /** Makes this instructor the teacher of the given courses (moves them from their current instructor). */
  assignCourses: (id: string, courseIds: string[]) => send<{ assigned: number }>("post", `${base(id)}/courses`, { courseIds }),
  sendMessage: (id: string, message: { subject: string; body: string }) => send<{ sent: true }>("post", `${base(id)}/messages`, message),
  /** Fails with 409 while the instructor still teaches courses. */
  remove: (id: string) => send<{ id: string; deleted: true }>("delete", base(id)),

  courses: (id: string) => get<InstructorCourseRow[]>(`${base(id)}/courses`),
  students: (id: string, query: { page?: number; limit?: number; q?: string; courseId?: string } = {}) => get<ApiPage<InstructorStudentRow>>(`${base(id)}/students`, query),
  reviews: (id: string) => get<{ summary: ReviewSummary; data: InstructorReviewRow[] }>(`${base(id)}/reviews`),
  schedule: (id: string, range: { from?: string; to?: string } = {}) => get<ScheduleEvent[]>(`${base(id)}/schedule`, range),
  activity: (id: string) => get<ActivityLogEntry[]>(`${base(id)}/activity`),

  notes: (id: string) => get<InstructorNoteItem[]>(`${base(id)}/notes`),
  note: (id: string, noteId: string) => get<InstructorNoteItem>(`${base(id)}/notes/${encodeURIComponent(noteId)}`),
  addNote: (id: string, note: InstructorNotePayload) => send<InstructorNoteItem>("post", `${base(id)}/notes`, note),
  updateNote: (id: string, noteId: string, note: InstructorNotePayload) => send<InstructorNoteItem>("patch", `${base(id)}/notes/${encodeURIComponent(noteId)}`, note),
  removeNote: (id: string, noteId: string) => send<{ id: string; deleted: true }>("delete", `${base(id)}/notes/${encodeURIComponent(noteId)}`),
};
