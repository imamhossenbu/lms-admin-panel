import { Tone } from "@/components/ui/ToneBadge";

export type ActivityLogType =
  | "profile_updated"
  | "course_published"
  | "course_updated"
  | "student_enrolled"
  | "live_class"
  | "new_review"
  | "earning"
  | "note_added"
  | "account_action";

export type ActivityActorRole = "Super Admin" | "Admin" | "Instructor" | "Student" | "Automated";

export interface ActivityLogEntry {
  id: string;
  type: ActivityLogType;
  /** ISO timestamp */
  at: string;
  actor: { name: string; role: ActivityActorRole; avatarUrl?: string };
  details: string;
  /** "—" when the API didn't record one. */
  ip: string;
  device: "Web" | "Mobile" | "System";
}

export const ACTIVITY_TYPE_META: Record<ActivityLogType, { label: string; tone: Tone }> = {
  profile_updated: { label: "Profile Updated", tone: "blue" },
  course_published: { label: "Course Published", tone: "green" },
  course_updated: { label: "Course Updated", tone: "indigo" },
  student_enrolled: { label: "Student Enrolled", tone: "purple" },
  live_class: { label: "Live Class Conducted", tone: "orange" },
  new_review: { label: "New Review", tone: "red" },
  earning: { label: "Earning Received", tone: "green" },
  note_added: { label: "Note Added", tone: "purple" },
  account_action: { label: "Account Action", tone: "gray" },
};

export const DATE_RANGE_OPTIONS = [
  { value: "All", label: "All Time", days: Infinity },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
] as const;
