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

export type InstructorNoteType =
  | "General"
  | "Performance"
  | "Content Update"
  | "Onboarding"
  | "Meeting"
  | "Issue"
  | "Payment";

export type InstructorNotePriority = "Low" | "Medium" | "High";

export interface InstructorNoteItem {
  id: string;
  instructorId: string;
  title: string;
  /** Sanitized HTML from the rich text editor. */
  content: string;
  type: InstructorNoteType;
  priority: InstructorNotePriority;
  tags: string[];
  /** ISO date (yyyy-mm-dd) when a reminder is set. */
  reminderDate?: string;
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  updatedAt?: string;
}
