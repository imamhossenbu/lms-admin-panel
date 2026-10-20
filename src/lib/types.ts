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

export interface AdminCourseItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  isFree: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: { id: string; name: string };
  totalStudents: number;
  ratingAverage: number;
  instructorName?: string;
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
