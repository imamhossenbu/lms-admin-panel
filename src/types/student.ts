export type StudentStatus = "Active" | "Inactive";

export interface EnrolledCourseItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  progress: number; // 0 to 100
  enrolledDate: string;
  completedLessons: number;
  totalLessons: number;
  instructor: string;
  category: string;
  grade?: string;
  certificateEarned?: boolean;
}

export interface StudentActivityItem {
  id: string;
  action: string;
  timestamp: string;
  iconType: "lesson" | "quiz" | "enroll" | "certificate";
  details?: string;
}

export interface StudentItem {
  id: string;
  orderNumber: number;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  completionRate: number; // e.g. 60
  status: StudentStatus;
  joinDate: string;
  phone: string;
  totalWatchTime: string; // e.g. "18h 24m"
  averageScore: number; // e.g. 78
  enrolledCourses: EnrolledCourseItem[];
  recentActivities: StudentActivityItem[];
}
