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

export const DEFAULT_STUDENT_DETAILS: StudentFullDetails = {
  id: "std-2026001",
  studentIdCode: "STU-2026001",
  name: "Samira Akter",
  email: "samira@example.com",
  phone: "+880 1712 345678",
  status: "Active",
  joinedDate: "Oct 12, 2026",
  initials: "SA",
  overallProgress: 68,
  learningMetrics: {
    completedLessons: { current: 48, total: 70, percentage: 68 },
    quizzesPassed: { current: 5, total: 7, percentage: 71 },
    assignmentsSubmitted: { current: 4, total: 5, percentage: 80 },
    certificatesEarned: { current: 1, total: 3, percentage: 33 },
  },
  enrolledCourses: [
    {
      id: "c-1",
      orderNumber: 1,
      title: "HTML Fundamentals",
      category: "Web Development",
      instructor: {
        name: "John Doe",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      },
      progress: 85,
      status: "In Progress",
      enrolledDate: "Oct 12, 2026",
      completedDate: "—",
      iconType: "html",
    },
    {
      id: "c-2",
      orderNumber: 2,
      title: "CSS & Responsive Design",
      category: "Web Development",
      instructor: {
        name: "Sarah Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      },
      progress: 60,
      status: "In Progress",
      enrolledDate: "Oct 12, 2026",
      completedDate: "—",
      iconType: "css",
    },
    {
      id: "c-3",
      orderNumber: 3,
      title: "JavaScript Essentials",
      category: "Web Development",
      instructor: {
        name: "John Doe",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      },
      progress: 40,
      status: "In Progress",
      enrolledDate: "Oct 18, 2026",
      completedDate: "—",
      iconType: "javascript",
    },
    {
      id: "c-4",
      orderNumber: 4,
      title: "React for Beginners",
      category: "Web Development",
      instructor: {
        name: "Sarah Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      },
      progress: 0,
      status: "Not Started",
      enrolledDate: "Oct 20, 2026",
      completedDate: "—",
      iconType: "react",
    },
    {
      id: "c-5",
      orderNumber: 5,
      title: "Node.js Backend Basics",
      category: "Web Development",
      instructor: {
        name: "John Doe",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      },
      progress: 0,
      status: "Not Started",
      enrolledDate: "Oct 20, 2026",
      completedDate: "—",
      iconType: "node",
    },
    {
      id: "c-6",
      orderNumber: 6,
      title: "UI/UX Design Basics",
      category: "Design",
      instructor: {
        name: "Sarah Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      },
      progress: 25,
      status: "In Progress",
      enrolledDate: "Oct 22, 2026",
      completedDate: "—",
      iconType: "uiux",
    },
  ],
  assignments: [
    {
      id: "asg-1",
      orderNumber: 1,
      title: "Build a Simple Web Page",
      courseTitle: "HTML Fundamentals",
      dueDate: "Oct 15, 2026",
      submissionStatus: "Submitted",
      submittedOn: "Oct 14, 2026 10:24 AM",
      score: "92 / 100",
      grade: "A",
      iconType: "html",
    },
    {
      id: "asg-2",
      orderNumber: 2,
      title: "Create a Responsive Layout",
      courseTitle: "CSS & Responsive Design",
      dueDate: "Oct 20, 2026",
      submissionStatus: "Submitted",
      submittedOn: "Oct 19, 2026 04:18 PM",
      score: "85 / 100",
      grade: "A-",
      iconType: "css",
    },
    {
      id: "asg-3",
      orderNumber: 3,
      title: "JavaScript DOM Project",
      courseTitle: "JavaScript Essentials",
      dueDate: "Oct 25, 2026",
      submissionStatus: "Pending",
      submittedOn: "—",
      score: "—",
      grade: "—",
      iconType: "javascript",
    },
    {
      id: "asg-4",
      orderNumber: 4,
      title: "Build a React Component",
      courseTitle: "React for Beginners",
      dueDate: "Oct 28, 2026",
      submissionStatus: "Not Submitted",
      submittedOn: "—",
      score: "—",
      grade: "—",
      iconType: "react",
    },
    {
      id: "asg-5",
      orderNumber: 5,
      title: "API Integration Task",
      courseTitle: "Node.js Backend Basics",
      dueDate: "Nov 02, 2026",
      submissionStatus: "Not Submitted",
      submittedOn: "—",
      score: "—",
      grade: "—",
      iconType: "node",
    },
    {
      id: "asg-6",
      orderNumber: 6,
      title: "UI/UX Case Study",
      courseTitle: "UI/UX Design Basics",
      dueDate: "Nov 05, 2026",
      submissionStatus: "Pending",
      submittedOn: "—",
      score: "—",
      grade: "—",
      iconType: "uiux",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      title: "Completed lesson",
      subtitle: "Introduction to HTML",
      timestamp: "Oct 20, 2026 10:24 AM",
      type: "lesson",
    },
    {
      id: "act-2",
      title: "Passed quiz",
      subtitle: "HTML Basics Quiz (45/50)",
      timestamp: "Oct 19, 2026 04:18 PM",
      type: "quiz",
    },
    {
      id: "act-3",
      title: "Submitted assignment",
      subtitle: "Build a Simple Web Page",
      timestamp: "Oct 18, 2026 02:12 PM",
      type: "assignment",
    },
    {
      id: "act-4",
      title: "Enrolled in course",
      subtitle: "CSS & Responsive Design",
      timestamp: "Oct 16, 2026 11:05 AM",
      type: "enroll",
    },
  ],
  quizzes: [
    {
      id: "qz-1",
      orderNumber: 1,
      title: "HTML Basics Quiz",
      course: "HTML Fundamentals",
      attemptedOn: "Oct 14, 2026",
      scoreCurrent: 18,
      scoreTotal: 20,
      percentage: 90,
      status: "Passed",
      timeTaken: "12m 30s",
      iconType: "html",
    },
    {
      id: "qz-2",
      orderNumber: 2,
      title: "CSS Selectors Quiz",
      course: "CSS & Responsive Design",
      attemptedOn: "Oct 19, 2026",
      scoreCurrent: 14,
      scoreTotal: 20,
      percentage: 70,
      status: "Passed",
      timeTaken: "15m 12s",
      iconType: "css",
    },
    {
      id: "qz-3",
      orderNumber: 3,
      title: "JavaScript Basics Quiz",
      course: "JavaScript Essentials",
      attemptedOn: "Oct 22, 2026",
      scoreCurrent: 8,
      scoreTotal: 20,
      percentage: 40,
      status: "Failed",
      timeTaken: "20m 05s",
      iconType: "javascript",
    },
    {
      id: "qz-4",
      orderNumber: 4,
      title: "React Fundamentals Quiz",
      course: "React for Beginners",
      attemptedOn: "—",
      scoreCurrent: null,
      scoreTotal: null,
      percentage: null,
      status: "Not Attempted",
      timeTaken: "—",
      iconType: "react",
    },
    {
      id: "qz-5",
      orderNumber: 5,
      title: "Node.js Core Concepts",
      course: "Node.js Backend Basics",
      attemptedOn: "—",
      scoreCurrent: null,
      scoreTotal: null,
      percentage: null,
      status: "Not Attempted",
      timeTaken: "—",
      iconType: "node",
    },
    {
      id: "qz-6",
      orderNumber: 6,
      title: "UI/UX Principles Quiz",
      course: "UI/UX Design Basics",
      attemptedOn: "Oct 18, 2026",
      scoreCurrent: 16,
      scoreTotal: 20,
      percentage: 80,
      status: "Passed",
      timeTaken: "14m 20s",
      iconType: "uiux",
    },
    {
      id: "qz-7",
      orderNumber: 7,
      title: "Design Tools Quiz",
      course: "UI/UX Design Basics",
      attemptedOn: "Oct 25, 2026",
      scoreCurrent: 12,
      scoreTotal: 20,
      percentage: 60,
      status: "Passed",
      timeTaken: "18m 45s",
      iconType: "tools",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      orderNumber: 1,
      title: "HTML Fundamentals",
      subtitle: "Course Completion Certificate",
      course: "HTML Fundamentals",
      issuedOn: "Oct 18, 2026",
      certificateId: "CERT-2026-00124",
      status: "Issued",
      accentColor: "amber",
    },
    {
      id: "cert-2",
      orderNumber: 2,
      title: "CSS & Responsive Design",
      subtitle: "Course Completion Certificate",
      course: "CSS & Responsive Design",
      issuedOn: "Oct 25, 2026",
      certificateId: "CERT-2026-00137",
      status: "Issued",
      accentColor: "blue",
    },
    {
      id: "cert-3",
      orderNumber: 3,
      title: "JavaScript Essentials",
      subtitle: "Course Completion Certificate",
      course: "JavaScript Essentials",
      issuedOn: "Nov 02, 2026",
      certificateId: "CERT-2026-00152",
      status: "Issued",
      accentColor: "purple",
    },
    {
      id: "cert-4",
      orderNumber: 4,
      title: "React for Beginners",
      subtitle: "Course Completion Certificate",
      course: "React for Beginners",
      issuedOn: "—",
      certificateId: "—",
      status: "Not Earned",
      accentColor: "green",
    },
  ],
  activityLogs: [
    {
      id: "act-log-1",
      orderNumber: 1,
      date: "Oct 25, 2026",
      time: "04:18 PM",
      activityType: "completed_quiz",
      activityTitle: "Completed Quiz",
      details: "Scored 85% in CSS Selectors Quiz",
      relatedItemName: "CSS Selectors Quiz",
      relatedItemType: "Quiz",
      relatedItemIcon: "css",
    },
    {
      id: "act-log-2",
      orderNumber: 2,
      date: "Oct 22, 2026",
      time: "10:12 AM",
      activityType: "submitted_assignment",
      activityTitle: "Submitted Assignment",
      details: "JavaScript DOM Project submitted",
      relatedItemName: "JavaScript DOM Project",
      relatedItemType: "Assignment",
      relatedItemIcon: "javascript",
    },
    {
      id: "act-log-3",
      orderNumber: 3,
      date: "Oct 19, 2026",
      time: "04:05 PM",
      activityType: "enrolled_course",
      activityTitle: "Enrolled in Course",
      details: "Enrolled in CSS & Responsive Design",
      relatedItemName: "CSS & Responsive Design",
      relatedItemType: "Course",
      relatedItemIcon: "css",
    },
    {
      id: "act-log-4",
      orderNumber: 4,
      date: "Oct 14, 2026",
      time: "11:22 AM",
      activityType: "failed_quiz",
      activityTitle: "Failed Quiz",
      details: "Scored 40% in JavaScript Basics Quiz",
      relatedItemName: "JavaScript Basics Quiz",
      relatedItemType: "Quiz",
      relatedItemIcon: "javascript",
    },
    {
      id: "act-log-5",
      orderNumber: 5,
      date: "Oct 12, 2026",
      time: "02:10 PM",
      activityType: "enrolled_course",
      activityTitle: "Enrolled in Course",
      details: "Enrolled in HTML Fundamentals",
      relatedItemName: "HTML Fundamentals",
      relatedItemType: "Course",
      relatedItemIcon: "html",
    },
    {
      id: "act-log-6",
      orderNumber: 6,
      date: "Oct 12, 2026",
      time: "02:05 PM",
      activityType: "account_created",
      activityTitle: "Account Created",
      details: "Student account was created",
      relatedItemName: "—",
      relatedItemType: "",
      relatedItemIcon: null,
    },
  ],
  notes: [
    {
      id: "note-1",
      orderNumber: 1,
      category: "good_progress",
      categoryLabel: "Good Progress",
      content:
        "Student is performing well in the HTML and CSS modules. Keep an eye on JavaScript assignments.",
      author: {
        name: "Admin",
        role: "Super Admin",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      },
      date: "Oct 25, 2026",
      time: "04:18 PM",
    },
    {
      id: "note-2",
      orderNumber: 2,
      category: "needs_improvement",
      categoryLabel: "Needs Improvement",
      content:
        "Several quiz attempts were unsuccessful. Suggested to review the basic concepts again.",
      author: {
        name: "Sarah Khan",
        role: "Instructor",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      },
      date: "Oct 19, 2026",
      time: "01:12 PM",
    },
    {
      id: "note-3",
      orderNumber: 3,
      category: "student_support",
      categoryLabel: "Student Support",
      content:
        "Student faced an issue submitting the JavaScript assignment. Helped to resolve the problem.",
      author: {
        name: "John Doe",
        role: "Instructor",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      },
      date: "Oct 16, 2026",
      time: "11:05 AM",
    },
    {
      id: "note-4",
      orderNumber: 4,
      category: "counseling_call",
      categoryLabel: "Counseling Call",
      content:
        "Had a call with the student regarding course completion. Student is motivated and will complete remaining modules soon.",
      author: {
        name: "Admin",
        role: "Super Admin",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      },
      date: "Oct 12, 2026",
      time: "02:30 PM",
    },
    {
      id: "note-5",
      orderNumber: 5,
      category: "payment_issue",
      categoryLabel: "Payment Issue",
      content:
        "Student reported a payment issue for certificate. Forwarded to the billing team.",
      author: {
        name: "Fatima Noor",
        role: "Support Staff",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80",
      },
      date: "Oct 12, 2026",
      time: "10:45 AM",
    },
  ],
};
