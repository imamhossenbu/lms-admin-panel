/** Shapes returned by the Students API (`/students*`). Dates are ISO strings. */

export type StudentStatusLabel = "Active" | "Inactive" | "Suspended";

export interface ApiPage<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface StudentListItem {
  id: string;
  studentIdCode: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  status: StudentStatusLabel;
  emailVerified: boolean;
  joinDate: string;
  lastLoginAt: string | null;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  /** completed ÷ enrolled courses, 0–100. */
  completionRate: number;
  /** Average quiz percentage (best attempt per quiz), 0–100. */
  averageScore: number;
  totalWatchSeconds: number;
}

export interface Metric {
  current: number;
  total: number;
  percentage: number;
}

export interface StudentDetails extends StudentListItem {
  overallProgress: number;
  learningMetrics: {
    completedLessons: Metric;
    quizzesPassed: Metric;
    assignmentsSubmitted: Metric;
    certificatesEarned: Metric;
  };
}

export interface StudentCourseItem {
  id: string;
  enrollmentId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  category: string;
  instructor: { id: string; name: string; avatarUrl: string | null };
  progress: number;
  status: "Not Started" | "In Progress" | "Completed";
  completedLessons: number;
  totalLessons: number;
  enrolledDate: string;
  completedDate: string | null;
  lastAccessedAt: string | null;
  certificateEarned: boolean;
}

export interface StudentQuizItem {
  id: string;
  title: string;
  courseId: string;
  course: string;
  attemptsCount: number;
  attemptedOn: string | null;
  scoreCurrent: number | null;
  scoreTotal: number;
  percentage: number | null;
  passingScore: number;
  status: "Passed" | "Failed" | "Not Attempted";
  timeTakenSeconds: number | null;
}

export interface StudentAssignmentItem {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  dueDate: string;
  submissionStatus: "Submitted" | "Pending" | "Not Submitted";
  submittedOn: string | null;
  marksObtained: number | null;
  totalMarks: number;
  grade: string | null;
  fileUrl: string | null;
}

export interface StudentCertificateApiItem {
  id: string;
  courseId: string;
  course: string;
  status: "Issued" | "Not Earned";
  issuedOn: string | null;
  certificateId: string | null;
  verificationCode: string | null;
  certificateUrl: string | null;
}

export type StudentActivityType = "enrolled_course" | "completed_quiz" | "failed_quiz" | "submitted_assignment" | "earned_certificate" | "account_created";

export interface StudentActivityApiItem {
  id: string;
  activityType: StudentActivityType;
  activityTitle: string;
  details: string;
  relatedItemName: string;
  relatedItemType: "Course" | "Quiz" | "Assignment" | "Certificate" | "Account";
  at: string;
}

export type StudentNoteCategoryValue = "good_progress" | "needs_improvement" | "student_support" | "counseling_call" | "payment_issue" | "general";

export interface StudentNoteApiItem {
  id: string;
  category: StudentNoteCategoryValue;
  categoryLabel: string;
  content: string;
  author: { id: string; name: string; role: string; avatarUrl: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface StudentListQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: StudentStatusLabel;
  courseId?: string;
  joinedWithinDays?: 7 | 30 | 90;
  sortBy?: "joinDate" | "name";
  sortOrder?: "asc" | "desc";
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  phone?: string;
  status: StudentStatusLabel;
  enrolledCourseIds?: string[];
}

export type UpdateStudentPayload = Partial<Pick<CreateStudentPayload, "name" | "email" | "phone" | "status">>;
