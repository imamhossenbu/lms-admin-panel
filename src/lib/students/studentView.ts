import type { StudentItem } from "@/types/student";
import type {
  EnrolledCourseDetail,
  StudentActivityLogItem,
  StudentActivityTimelineItem,
  StudentAssignment,
  StudentCertificateItem,
  StudentFullDetails,
  StudentNoteItem,
  StudentQuizAttempt,
} from "@/types/studentDetails";
import type {
  StudentActivityApiItem,
  StudentAssignmentItem,
  StudentCertificateApiItem,
  StudentCourseItem,
  StudentDetails,
  StudentListItem,
  StudentNoteApiItem,
  StudentQuizItem,
} from "@/types/studentApi";

/** Maps Students API responses to the view models the student screens render. Pure functions. */

const DASH = "—";

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : DASH;

export const formatTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

/** "3 hours ago", "Yesterday", or the date for anything older than a week. */
export function timeAgo(iso: string, now = Date.now()) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

/** "18h 24m" / "45m" / "0m". */
export function formatWatchTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

/** "12m 30s" / "45s" / "—". */
export function formatDuration(seconds: number | null) {
  if (seconds === null || seconds === undefined) return DASH;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

type TechIcon = EnrolledCourseDetail["iconType"];
type AnyIcon = StudentQuizAttempt["iconType"];

const ICON_RULES: [RegExp, TechIcon][] = [
  [/react|next/i, "react"],
  [/node|express|backend|nest/i, "node"],
  [/javascript|\bjs\b|typescript/i, "javascript"],
  [/css|tailwind|style/i, "css"],
  [/html|web/i, "html"],
  [/ui|ux|design|figma|graphic/i, "uiux"],
];

/** Course tile icon picked from the course title / category (the API has no icon field). */
export function courseIcon(...texts: string[]): TechIcon {
  const text = texts.join(" ");
  return ICON_RULES.find(([re]) => re.test(text))?.[1] ?? "html";
}

const looseIcon = (...texts: string[]): AnyIcon => {
  const text = texts.join(" ");
  return ICON_RULES.find(([re]) => re.test(text))?.[1] ?? "tools";
};

// ---------------------------------------------------------------- list

/** Row for the students table. `index` is the row's absolute position (for the # column). */
export const toStudentRow = (s: StudentListItem, index: number): StudentItem => ({
  id: s.id,
  orderNumber: index + 1,
  name: s.name,
  email: s.email,
  avatarUrl: s.avatarUrl ?? undefined,
  enrolledCoursesCount: s.enrolledCoursesCount,
  completedCoursesCount: s.completedCoursesCount,
  completionRate: s.completionRate,
  status: s.status,
  joinDate: formatDate(s.joinDate),
  phone: s.phone,
  totalWatchTime: formatWatchTime(s.totalWatchSeconds),
  averageScore: s.averageScore,
  enrolledCourses: [],
  recentActivities: [],
});

// ---------------------------------------------------------------- details

export const toCourse = (c: StudentCourseItem, i: number): EnrolledCourseDetail => ({
  id: c.id,
  orderNumber: i + 1,
  title: c.title,
  category: c.category || DASH,
  instructor: { name: c.instructor.name || DASH, avatarUrl: c.instructor.avatarUrl ?? "" },
  progress: c.progress,
  status: c.status,
  enrolledDate: formatDate(c.enrolledDate),
  completedDate: formatDate(c.completedDate),
  iconType: courseIcon(c.title, c.category),
});

export const toAssignment = (a: StudentAssignmentItem, i: number): StudentAssignment => ({
  id: a.id,
  orderNumber: i + 1,
  title: a.title,
  courseTitle: a.courseTitle,
  dueDate: formatDate(a.dueDate),
  submissionStatus: a.submissionStatus,
  submittedOn: formatDate(a.submittedOn),
  score: a.marksObtained === null ? DASH : `${a.marksObtained}/${a.totalMarks}`,
  grade: a.grade ?? DASH,
  iconType: courseIcon(a.courseTitle, a.title),
});

export const toQuiz = (q: StudentQuizItem, i: number): StudentQuizAttempt => ({
  id: q.id,
  orderNumber: i + 1,
  title: q.title,
  course: q.course,
  attemptedOn: formatDate(q.attemptedOn),
  scoreCurrent: q.scoreCurrent,
  scoreTotal: q.scoreTotal,
  percentage: q.percentage,
  status: q.status,
  timeTaken: formatDuration(q.timeTakenSeconds),
  iconType: looseIcon(q.course, q.title),
});

const ACCENTS: StudentCertificateItem["accentColor"][] = ["amber", "blue", "purple", "green"];

export const toCertificate = (c: StudentCertificateApiItem, i: number): StudentCertificateItem => ({
  id: c.id,
  orderNumber: i + 1,
  title: "Certificate of Completion",
  subtitle: c.status === "Issued" ? `Verification code ${c.verificationCode ?? DASH}` : "Complete the course to earn it",
  course: c.course,
  issuedOn: formatDate(c.issuedOn),
  certificateId: c.certificateId ?? DASH,
  status: c.status,
  accentColor: ACCENTS[i % ACCENTS.length]!,
});

export const toActivityLog = (a: StudentActivityApiItem, i: number): StudentActivityLogItem => ({
  id: a.id,
  orderNumber: i + 1,
  date: formatDate(a.at),
  time: formatTime(a.at),
  activityType: a.activityType,
  activityTitle: a.activityTitle,
  details: a.details,
  relatedItemName: a.relatedItemName,
  relatedItemType: a.relatedItemType,
  relatedItemIcon: a.relatedItemType === "Account" ? null : looseIcon(a.relatedItemName),
});

const TIMELINE_TYPE: Record<StudentActivityApiItem["activityType"], StudentActivityTimelineItem["type"]> = {
  enrolled_course: "enroll",
  completed_quiz: "quiz",
  failed_quiz: "quiz",
  submitted_assignment: "assignment",
  earned_certificate: "lesson",
  account_created: "enroll",
};

export const toTimeline = (a: StudentActivityApiItem): StudentActivityTimelineItem => ({
  id: a.id,
  title: a.activityTitle,
  subtitle: a.relatedItemName || a.details,
  timestamp: timeAgo(a.at),
  type: TIMELINE_TYPE[a.activityType],
});

export const toNote = (n: StudentNoteApiItem, i: number): StudentNoteItem => ({
  id: n.id,
  orderNumber: i + 1,
  category: n.category,
  categoryLabel: n.categoryLabel,
  content: n.content,
  author: { name: n.author.name, role: n.author.role, avatarUrl: n.author.avatarUrl ?? "" },
  date: formatDate(n.createdAt),
  time: formatTime(n.createdAt),
});

export interface StudentRecords {
  courses: StudentCourseItem[];
  assignments: StudentAssignmentItem[];
  quizzes: StudentQuizItem[];
  certificates: StudentCertificateApiItem[];
  activity: StudentActivityApiItem[];
  notes: StudentNoteApiItem[];
}

export const toFullDetails = (s: StudentDetails, r: StudentRecords): StudentFullDetails => ({
  id: s.id,
  studentIdCode: s.studentIdCode,
  name: s.name,
  email: s.email,
  phone: s.phone,
  status: s.status,
  joinedDate: formatDate(s.joinDate),
  initials: initialsOf(s.name),
  overallProgress: s.overallProgress,
  learningMetrics: s.learningMetrics,
  enrolledCourses: r.courses.map(toCourse),
  assignments: r.assignments.map(toAssignment),
  recentActivities: r.activity.slice(0, 6).map(toTimeline),
  quizzes: r.quizzes.map(toQuiz),
  certificates: r.certificates.map(toCertificate),
  activityLogs: r.activity.map(toActivityLog),
  notes: r.notes.map(toNote),
});
