export type InstructorStatus = "Active" | "Inactive";

export interface InstructorCourseItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  revenue: string;
  category: string;
  lessonsCount?: number;
}

export interface InstructorStudentItem {
  id: string;
  name: string;
  avatarUrl?: string;
  courseTitle: string;
  joinDate: string;
  progress: number;
}

export interface InstructorActivityItem {
  id: string;
  action: string;
  timestamp: string;
  iconType: "course" | "review" | "payout" | "message";
  details?: string;
}

export interface InstructorItem {
  id: string;
  orderNumber: number;
  name: string;
  title: string;
  expertise: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  coursesCount: number;
  studentsCount: number;
  totalRevenue: string;
  numericRevenue: number;
  rating: number;
  reviewsCount: number;
  status: InstructorStatus;
  joinDate: string;
  bio: string;
  skills: string[];
  courses: InstructorCourseItem[];
  recentStudents?: InstructorStudentItem[];
  recentActivities?: InstructorActivityItem[];
}
