/** View models used by the student details screens (built from the Students API by `lib/students/studentView`). */

export interface EnrolledCourseDetail {
  id: string;
  orderNumber: number;
  title: string;
  category: string;
  instructor: {
    name: string;
    avatarUrl: string;
  };
  progress: number;
  status: "In Progress" | "Not Started" | "Completed";
  enrolledDate: string;
  completedDate: string;
  iconType: "html" | "css" | "javascript" | "react" | "node" | "uiux";
}

export interface StudentAssignment {
  id: string;
  orderNumber: number;
  title: string;
  courseTitle: string;
  dueDate: string;
  submissionStatus: "Submitted" | "Pending" | "Not Submitted";
  submittedOn: string;
  score: string;
  grade: string;
  iconType: "html" | "css" | "javascript" | "react" | "node" | "uiux";
}

export interface StudentActivityTimelineItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: "lesson" | "quiz" | "assignment" | "enroll";
}

export interface StudentQuizAttempt {
  id: string;
  orderNumber: number;
  title: string;
  course: string;
  attemptedOn: string;
  scoreCurrent: number | null;
  scoreTotal: number | null;
  percentage: number | null;
  status: "Passed" | "Failed" | "Not Attempted";
  timeTaken: string;
  iconType: "html" | "css" | "javascript" | "react" | "node" | "uiux" | "tools" | "design";
}

export interface StudentCertificateItem {
  id: string;
  orderNumber: number;
  title: string;
  subtitle: string;
  course: string;
  issuedOn: string;
  certificateId: string;
  status: "Issued" | "Not Earned";
  accentColor: "amber" | "blue" | "purple" | "green";
}

export interface StudentActivityLogItem {
  id: string;
  orderNumber: number;
  date: string;
  time: string;
  activityType:
    | "completed_quiz"
    | "submitted_assignment"
    | "enrolled_course"
    | "failed_quiz"
    | "earned_certificate"
    | "account_created";
  activityTitle: string;
  details: string;
  relatedItemName: string;
  relatedItemType: string;
  relatedItemIcon: "html" | "css" | "javascript" | "react" | "node" | "uiux" | "tools" | "design" | null;
}

export type StudentNoteCategory =
  | "good_progress"
  | "needs_improvement"
  | "student_support"
  | "counseling_call"
  | "payment_issue"
  | "general";

export interface StudentNoteAuthor {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface StudentNoteItem {
  id: string;
  orderNumber: number;
  category: StudentNoteCategory;
  categoryLabel: string;
  content: string;
  author: StudentNoteAuthor;
  date: string;
  time: string;
}

export interface StudentFullDetails {
  id: string;
  studentIdCode: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Suspended";
  joinedDate: string;
  initials: string;
  overallProgress: number;
  learningMetrics: {
    completedLessons: { current: number; total: number; percentage: number };
    quizzesPassed: { current: number; total: number; percentage: number };
    assignmentsSubmitted: { current: number; total: number; percentage: number };
    certificatesEarned: { current: number; total: number; percentage: number };
  };
  enrolledCourses: EnrolledCourseDetail[];
  assignments: StudentAssignment[];
  recentActivities: StudentActivityTimelineItem[];
  quizzes: StudentQuizAttempt[];
  certificates: StudentCertificateItem[];
  activityLogs: StudentActivityLogItem[];
  notes: StudentNoteItem[];
}
