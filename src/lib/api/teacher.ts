import { apiClient } from "@/lib/api";
import type { ApiPage } from "@/types/api";
import type { AttemptPage, SubmissionPage, TeacherCourse, TeacherCourseDetail, TeacherDashboard, TeacherLessonFull, TeacherLessonInput, TeacherLive, TeacherLiveFull, TeacherLiveInput, TeacherProfile, TeacherQuestion, TeacherStudentRow } from "@/types/teacher";

export interface TeacherListQuery {
  q?: string;
  courseId?: string;
  status?: string;
  result?: string;
  page?: number;
  limit?: number;
}

const clean = (q: object) => Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined && v !== "" && v !== "All"));
const enc = encodeURIComponent;
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
  // curriculum (own courses)
  addModule: async (courseId: string, title: string) => (await apiClient.post(`/teacher/courses/${enc(courseId)}/modules`, { title })).data,
  renameModule: async (courseId: string, moduleId: string, title: string) => (await apiClient.patch(`/teacher/courses/${enc(courseId)}/modules/${enc(moduleId)}`, { title })).data,
  deleteModule: async (courseId: string, moduleId: string) => (await apiClient.delete(`/teacher/courses/${enc(courseId)}/modules/${enc(moduleId)}`)).data,
  reorderModules: async (courseId: string, ids: string[]) => (await apiClient.patch(`/teacher/courses/${enc(courseId)}/modules/order`, { ids })).data,
  reorderLessons: async (courseId: string, moduleId: string, ids: string[]) => (await apiClient.patch(`/teacher/courses/${enc(courseId)}/modules/${enc(moduleId)}/lessons/order`, { ids })).data,
  lesson: (courseId: string, lessonId: string) => get<TeacherLessonFull>(`/teacher/courses/${enc(courseId)}/lessons/${enc(lessonId)}`),
  addLesson: async (courseId: string, v: TeacherLessonInput) => (await apiClient.post<TeacherLessonFull>(`/teacher/courses/${enc(courseId)}/lessons`, v)).data,
  updateLesson: async (courseId: string, lessonId: string, v: TeacherLessonInput) => (await apiClient.put<TeacherLessonFull>(`/teacher/courses/${enc(courseId)}/lessons/${enc(lessonId)}`, v)).data,
  deleteLesson: async (courseId: string, lessonId: string) => (await apiClient.delete(`/teacher/courses/${enc(courseId)}/lessons/${enc(lessonId)}`)).data,
  // live classes
  liveClass: (id: string) => get<TeacherLiveFull>(`/teacher/live-classes/${enc(id)}`),
  scheduleLive: async (v: TeacherLiveInput) => (await apiClient.post<TeacherLiveFull>("/teacher/live-classes", v)).data,
  updateLive: async (id: string, v: TeacherLiveInput) => (await apiClient.put<TeacherLiveFull>(`/teacher/live-classes/${enc(id)}`, v)).data,
  cancelLive: async (id: string) => (await apiClient.post(`/teacher/live-classes/${enc(id)}/cancel`)).data,
  setRecording: async (id: string, recordingUrl: string) => (await apiClient.patch(`/teacher/live-classes/${enc(id)}/recording`, { recordingUrl })).data,
  changePassword: async (currentPassword: string, newPassword: string) => (await apiClient.post("/teacher/password", { currentPassword, newPassword })).data,
};
