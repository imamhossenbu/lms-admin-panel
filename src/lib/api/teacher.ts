import { apiClient } from "@/lib/api";
import type { ApiPage } from "@/types/api";
import type { AttemptPage, SubmissionPage, TeacherCourse, TeacherCourseDetail, TeacherDashboard, TeacherLive, TeacherProfile, TeacherQuestion, TeacherStudentRow } from "@/types/teacher";

export interface TeacherListQuery {
  q?: string;
  courseId?: string;
  status?: string;
  result?: string;
  page?: number;
  limit?: number;
}

const clean = (q: object) => Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined && v !== "" && v !== "All"));
const get = async <T>(url: string, params?: object) => (await apiClient.get<T>(url, { params: params ? clean(params) : undefined })).data;

/** Teacher mode API — the server limits everything to the signed-in teacher's own courses. */
export const teacherApi = {
  dashboard: () => get<TeacherDashboard>("/teacher/dashboard"),
  courses: () => get<TeacherCourse[]>("/teacher/courses"),
  course: (id: string) => get<TeacherCourseDetail>(`/teacher/courses/${encodeURIComponent(id)}`),
  students: (q: TeacherListQuery) => get<ApiPage<TeacherStudentRow>>("/teacher/students", q),
  submissions: (q: TeacherListQuery) => get<SubmissionPage>("/teacher/submissions", q),
  grade: async (id: string, marks: number, feedback: string) => (await apiClient.patch(`/teacher/submissions/${encodeURIComponent(id)}/grade`, { marks, feedback })).data,
  attempts: (q: TeacherListQuery) => get<AttemptPage>("/teacher/quiz-attempts", q),
  live: (when: "upcoming" | "past") => get<TeacherLive[]>("/teacher/live-classes", { when }),
  questions: (q: TeacherListQuery) => get<ApiPage<TeacherQuestion>>("/teacher/questions", q),
  reply: async (id: string, body: string) => (await apiClient.post(`/teacher/questions/${encodeURIComponent(id)}/reply`, { body })).data,
  profile: () => get<TeacherProfile>("/teacher/profile"),
  saveProfile: async (v: { name: string; phone: string; headline: string; bio: string; expertise: string }) => (await apiClient.patch<TeacherProfile>("/teacher/profile", v)).data,
  changePassword: async (currentPassword: string, newPassword: string) => (await apiClient.post("/teacher/password", { currentPassword, newPassword })).data,
};
