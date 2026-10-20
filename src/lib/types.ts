export interface AdminAnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  revenueGrowth: number;
  completionRate: number;
  monthlyRevenue: { month: string; revenue: number; enrollments: number }[];
  recentOrders: AdminOrder[];
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface CourseLessonItem {
  id: string;
  title: string;
  type?: "VIDEO" | "ARTICLE" | "QUIZ" | string;
  videoUrl?: string | null;
  content?: string | null;
  resources?: string | null;
  durationMinutes: number;
  order: number;
  isPreview?: boolean;
}

export interface CourseModuleItem {
  id: string;
  title: string;
  description?: string;
  order: number;
  durationMinutes?: number;
  isLocked?: boolean;
  lessons: CourseLessonItem[];
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: "ACTIVE" | "INACTIVE";
  _count?: { courses: number };
  courseCount?: number;
}

export interface AdminCourseItem {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  isFree: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: { id: string; name: string };
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  language?: string;
  durationMinutes?: number;
  totalStudents: number;
  ratingAverage: number;
  instructorName?: string;
  instructorAvatar?: string;
  requirements?: string[];
  learningOutcomes?: string[];
  modules?: CourseModuleItem[];
  totalLessons?: number;
  totalDuration?: string;
  createdAt?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  user: { name: string; email: string };
  courseTitle: string;
  amount: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
}
