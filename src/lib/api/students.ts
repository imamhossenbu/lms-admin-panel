import { apiClient } from "@/lib/api";
import type {
  ApiPage,
  CreateStudentPayload,
  StudentActivityApiItem,
  StudentAssignmentItem,
  StudentCertificateApiItem,
  StudentCourseItem,
  StudentDetails,
  StudentListItem,
  StudentListQuery,
  StudentNoteApiItem,
  StudentNoteCategoryValue,
  StudentQuizItem,
  StudentStatusLabel,
  UpdateStudentPayload,
} from "@/types/studentApi";

const base = (id: string) => `/students/${encodeURIComponent(id)}`;
const get = async <T>(url: string, params?: object) => (await apiClient.get<T>(url, { params })).data;

/** Students API (workspace-scoped; the API checks the `students` team permission). */
export const studentsApi = {
  list: (query: StudentListQuery) => get<ApiPage<StudentListItem>>("/students", query),
  get: (id: string) => get<StudentDetails>(base(id)),
  create: async (payload: CreateStudentPayload) => (await apiClient.post<StudentDetails>("/students", payload)).data,
  update: async (id: string, payload: UpdateStudentPayload) => (await apiClient.patch<StudentDetails>(base(id), payload)).data,
  setStatus: async (id: string, status: StudentStatusLabel) => (await apiClient.patch<StudentDetails>(`${base(id)}/status`, { status })).data,
  /** Soft delete: records are kept, sign-in is blocked. */
  remove: async (id: string) => (await apiClient.delete<{ id: string; deleted: true }>(base(id))).data,

  courses: (id: string) => get<StudentCourseItem[]>(`${base(id)}/courses`),
  quizzes: (id: string) => get<StudentQuizItem[]>(`${base(id)}/quizzes`),
  assignments: (id: string) => get<StudentAssignmentItem[]>(`${base(id)}/assignments`),
  certificates: (id: string) => get<StudentCertificateApiItem[]>(`${base(id)}/certificates`),
  activity: (id: string) => get<StudentActivityApiItem[]>(`${base(id)}/activity`),

  enroll: async (id: string, courseIds: string[]) => (await apiClient.post<{ enrolledCourseIds: string[]; skipped: number }>(`${base(id)}/enrollments`, { courseIds })).data,
  unenroll: async (id: string, courseId: string) => (await apiClient.delete(`${base(id)}/enrollments/${encodeURIComponent(courseId)}`)).data,

  notes: (id: string) => get<StudentNoteApiItem[]>(`${base(id)}/notes`),
  addNote: async (id: string, note: { category: StudentNoteCategoryValue; content: string }) => (await apiClient.post<StudentNoteApiItem>(`${base(id)}/notes`, note)).data,
  updateNote: async (id: string, noteId: string, note: { category: StudentNoteCategoryValue; content: string }) =>
    (await apiClient.patch<StudentNoteApiItem>(`${base(id)}/notes/${encodeURIComponent(noteId)}`, note)).data,
  removeNote: async (id: string, noteId: string) => (await apiClient.delete(`${base(id)}/notes/${encodeURIComponent(noteId)}`)).data,
};
