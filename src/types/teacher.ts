/** Teacher mode (/teach) — shapes of the API's /teacher/* (lms-ai-backend src/teacher). */
import type { ApiPage } from "@/types/api";

export interface TeacherLive {
  id: string;
  courseId: string;
  /** The teacher teaches it (an admin may schedule a class on their course for someone else → read-only). */
  mine: boolean;
  title: string;
  startTime: string;
  endTime: string;
  meetingUrl: string;
  recordingUrl: string | null;
  platform: string;
  course: { title: string };
  attendees: number;
  status: "LIVE" | "UPCOMING" | "ENDED";
}

export interface TeacherPerson {
  id?: string;
  name: string;
  email?: string;
  avatar: string | null;
}

export interface TeacherDashboard {
  stats: { courses: number; publishedCourses: number; students: number; pendingSubmissions: number; openQuestions: number; rating: number; reviews: number };
  upcomingLive: TeacherLive[];
  recentSubmissions: { id: string; status: "PENDING" | "GRADED"; submittedAt: string; isLate: boolean; student: TeacherPerson; assignment: string; course: string }[];
}

export interface TeacherCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  status: string;
  level: string;
  price: number;
  isFree: boolean;
  rating: number;
  category: { name: string } | null;
  students: number;
  reviews: number;
  assignments: number;
  quizzes: number;
  liveClasses: number;
  lessons: number;
  pendingSubmissions: number;
}

export interface TeacherCourseDetail {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  status: string;
  level: string;
  shortDescription: string;
  rating: number;
  category: { name: string } | null;
  students: number;
  averageProgress: number;
  completed: number;
  modules: { id: string; title: string; lessons: { id: string; title: string; type: string; status: string; durationMinutes: number; isPreview: boolean; completions: number }[] }[];
  reviews: { id: string; rating: number; reviewText: string | null; createdAt: string; user: TeacherPerson }[];
}

export interface TeacherStudentRow {
  id: string;
  enrolledAt: string;
  progressPercentage: number;
  completedAt: string | null;
  lastAccessedAt: string | null;
  user: { id: string; name: string; email: string; avatar: string | null };
  course: { id: string; title: string };
}

export interface TeacherSubmission {
  id: string;
  status: "PENDING" | "GRADED";
  submittedAt: string;
  isLate: boolean;
  attempt: number;
  fileUrl: string | null;
  fileName: string;
  textAnswer: string | null;
  marksObtained: number | null;
  feedback: string | null;
  gradedAt: string | null;
  user: { id: string; name: string; email: string; avatar: string | null };
  assignment: { id: string; title: string; type: string; marks: number; dueDate: string; course: { id: string; title: string } };
}

export interface TeacherAttempt {
  id: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  timeTakenSeconds: number;
  submittedAt: string;
  user: { name: string; email: string; avatar: string | null };
  quiz: { title: string; course: { title: string } };
}

export interface TeacherQuestion {
  id: string;
  title: string;
  bodyHtml: string;
  isResolved: boolean;
  createdAt: string;
  course: string;
  author: { id: string; name: string; avatar: string | null; role: string };
  answered: boolean;
  replies: { id: string; bodyHtml: string; isAccepted: boolean; createdAt: string; author: { id: string; name: string; avatar: string | null; role: string }; mine: boolean }[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  headline: string | null;
  bio: string | null;
  expertise: string | null;
  createdAt: string;
}

export type SubmissionPage = ApiPage<TeacherSubmission> & { pending: number };
export type AttemptPage = ApiPage<TeacherAttempt> & { stats: { attempts: number; averagePercentage: number; passRate: number } };

export const TEACHER_LESSON_TYPES = ["VIDEO", "TEXT", "CODING", "QUIZ", "ASSIGNMENT", "LIVE"] as const;
export type TeacherLessonType = (typeof TEACHER_LESSON_TYPES)[number];

/** A lesson as the teacher edits it (GET /teacher/courses/:id/lessons/:lessonId). */
export interface TeacherLessonFull {
  id: string;
  moduleId: string;
  title: string;
  type: string;
  durationMinutes: number;
  videoUrl: string | null;
  content: string | null;
  isPreview: boolean;
  status: string;
  order: number;
}

export interface TeacherLessonInput {
  moduleId: string;
  title: string;
  type: TeacherLessonType;
  durationMinutes: number;
  videoUrl: string;
  content: string;
  isPreview: boolean;
  status: "DRAFT" | "PUBLISHED";
}

export const LIVE_PLATFORMS = ["ZOOM", "GOOGLE_MEET", "TEAMS", "CUSTOM"] as const;

/** Live class form values (date / time in the workspace's local time). */
export interface TeacherLiveInput {
  courseId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  platform: (typeof LIVE_PLATFORMS)[number];
  meetingUrl: string;
}

export interface TeacherLiveFull extends TeacherLiveInput {
  id: string;
  recordingUrl: string;
  status: string;
}
