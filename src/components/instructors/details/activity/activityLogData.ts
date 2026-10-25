import { InstructorItem, InstructorNoteItem } from "@/types/instructor";
import { Tone } from "@/components/ui/ToneBadge";
import { htmlToText } from "@/lib/sanitizeHtml";
import { InstructorCourseRow, InstructorReviewRow, InstructorStudentRow } from "../instructorDetailsData";

export type ActivityLogType =
  | "profile_updated"
  | "course_published"
  | "course_updated"
  | "student_enrolled"
  | "live_class"
  | "new_review"
  | "earning"
  | "note_added";

export type ActivityActorRole = "Super Admin" | "Instructor" | "Student" | "Automated";

export interface ActivityLogEntry {
  id: string;
  type: ActivityLogType;
  /** ISO timestamp */
  at: string;
  actor: { name: string; role: ActivityActorRole; avatarUrl?: string };
  details: string;
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
};

export const DATE_RANGE_OPTIONS = [
  { value: "All", label: "All Time", days: Infinity },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
] as const;

const ADMIN = {
  name: "Admin",
  role: "Super Admin" as const,
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
};

const ADMIN_IP = "103.24.56.78";
const INSTRUCTOR_IP = "182.160.12.45";

const TEMPLATE: ActivityLogType[] = [
  "profile_updated",
  "course_published",
  "course_updated",
  "student_enrolled",
  "live_class",
  "new_review",
  "earning",
];

/**
 * 42 deterministic log entries (newest first) built from the instructor's real
 * courses/students/reviews, merged with the admin notes stored for them.
 */
export function buildActivityLog(
  instructor: InstructorItem,
  courses: InstructorCourseRow[],
  students: InstructorStudentRow[],
  reviews: InstructorReviewRow[],
  notes: InstructorNoteItem[],
  now: Date = new Date()
): ActivityLogEntry[] {
  const self = { name: instructor.name, role: "Instructor" as const, avatarUrl: instructor.avatarUrl };
  const generated: ActivityLogEntry[] = [];

  if (courses.length > 0) {
    for (let i = 0; i < 42; i++) {
      const type = TEMPLATE[i % TEMPLATE.length];
      const course = courses[i % courses.length];
      const at = new Date(now.getTime() - (i * 19 + 3) * 60 * 60 * 1000);
      const base = { id: `${instructor.id}-log-${i}`, type, at: at.toISOString() };

      switch (type) {
        case "profile_updated":
          generated.push({ ...base, actor: ADMIN, details: "Updated instructor profile information (Phone number and bio)", ip: ADMIN_IP, device: "Web" });
          break;
        case "course_published":
          generated.push({ ...base, actor: self, details: `Published new course "${course.title}"`, ip: INSTRUCTOR_IP, device: "Web" });
          break;
        case "course_updated":
          generated.push({ ...base, actor: self, details: `Updated course content "${course.title}"`, ip: INSTRUCTOR_IP, device: i % 3 ? "Web" : "Mobile" });
          break;
        case "student_enrolled": {
          const count = (i % 5) + 2;
          generated.push({ ...base, actor: self, details: `${count} new students enrolled in "${course.title}"`, ip: INSTRUCTOR_IP, device: "Web" });
          break;
        }
        case "live_class":
          generated.push({ ...base, actor: self, details: `Conducted live class "${course.title}"`, ip: INSTRUCTOR_IP, device: "Web" });
          break;
        case "new_review": {
          const review = reviews[i % Math.max(1, reviews.length)];
          const student = students[i % Math.max(1, students.length)];
          generated.push({
            ...base,
            actor: {
              name: review?.studentName ?? student?.name ?? "Student",
              role: "Student",
              avatarUrl: review?.avatarUrl ?? student?.avatarUrl,
            },
            details: `Gave a ${review?.rating ?? 5}-star review for "${review?.course.title ?? course.title}"`,
            ip: "103.54.12.90",
            device: i % 2 ? "Mobile" : "Web",
          });
          break;
        }
        case "earning":
          generated.push({
            ...base,
            actor: { name: "System", role: "Automated" },
            details: `Received course payment (${course.price === "Free" ? "$0" : course.price}) for "${course.title}"`,
            ip: "-",
            device: "System",
          });
          break;
      }
    }
  }

  const noteEntries: ActivityLogEntry[] = notes.map((note) => ({
    id: `log-${note.id}`,
    type: "note_added",
    at: new Date(note.createdAt).toISOString(),
    actor: { name: note.author.name, role: "Super Admin", avatarUrl: note.author.avatarUrl },
    details: `Added an internal note "${note.title || htmlToText(note.content).slice(0, 40)}"`,
    ip: ADMIN_IP,
    device: "Web",
  }));

  return [...generated, ...noteEntries].sort((a, b) => b.at.localeCompare(a.at));
}
