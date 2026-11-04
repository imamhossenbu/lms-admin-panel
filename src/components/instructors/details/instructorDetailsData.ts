import { InstructorItem } from "@/types/instructor";
import type { EnrollmentCourse } from "@/types/enrollmentCourse";

/** View models for the instructor details screens (built from the Instructors API by `lib/instructors/instructorView`). */

export type CourseIconType = EnrollmentCourse["iconType"];
export type CourseStatus = "Active" | "Draft";
export type EnrollmentStatus = "Active" | "Inactive";

export interface InstructorCourseRow {
  id: string;
  title: string;
  subtitle: string;
  iconType?: CourseIconType;
  thumbnailUrl?: string;
  category: string;
  studentsCount: number;
  duration: string;
  price: string;
  status: CourseStatus;
  assignedOn: string;
}

export interface InstructorStudentRow {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  course: InstructorCourseRow;
  enrolledOn: string;
  progress: number;
  status: EnrollmentStatus;
}

export interface InstructorReviewRow {
  id: string;
  studentName: string;
  avatarUrl: string;
  studentEmail: string;
  course: InstructorCourseRow;
  rating: number;
  comment: string;
  date: string;
}

export type TimelineKind =
  | "lesson"
  | "assignment"
  | "update"
  | "live"
  | "enroll"
  | "course"
  | "review"
  | "payout"
  | "message";

export interface InstructorTimelineItem {
  id: string;
  kind: TimelineKind;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
}

export interface InstructorFullDetails {
  instructor: InstructorItem;
  courses: InstructorCourseRow[];
  students: InstructorStudentRow[];
  reviews: InstructorReviewRow[];
  activities: InstructorTimelineItem[];
  teachingTime: string;
  account: {
    twoFactorEnabled: boolean;
    createdAt: string;
    lastLogin: string;
  };
  website: string;
  socials: { linkedin: string; twitter: string; website: string };
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
