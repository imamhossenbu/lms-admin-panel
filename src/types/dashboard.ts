export interface StatMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparedTo: string;
  iconName: "users" | "user" | "book-open" | "database";
  colorScheme: "orange" | "blue" | "green" | "purple";
  sparklineData: number[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  formattedRevenue: string;
}

export interface StudentGrowthPoint {
  date: string;
  newStudents: number;
  activeStudents: number;
}

export interface CourseEnrollmentPoint {
  courseName: string;
  shortName: string;
  enrollments: number;
}

export interface CourseCompletionData {
  completionRate: number;
  categories: {
    label: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export type OrderStatus = "Completed" | "Pending" | "Failed";

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  student: {
    name: string;
    avatarUrl: string;
  };
  course: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

export interface DashboardEnrollment {
  id: string;
  student: {
    name: string;
    avatarUrl: string;
  };
  course: string;
  progress: number;
  enrolledAt: string;
}

export interface DashboardData {
  stats: StatMetric[];
  revenueData: RevenueDataPoint[];
  studentGrowthData: StudentGrowthPoint[];
  courseEnrollments: CourseEnrollmentPoint[];
  courseCompletion: CourseCompletionData;
  recentOrders: DashboardOrder[];
  recentEnrollments: DashboardEnrollment[];
}
