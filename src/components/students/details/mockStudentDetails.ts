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
};
