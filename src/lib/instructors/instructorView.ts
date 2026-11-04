import type { InstructorItem, InstructorNoteItem as InstructorNoteView } from "@/types/instructor";
import type {
  InstructorCourseRow as CourseView,
  InstructorFullDetails,
  InstructorReviewRow as ReviewView,
  InstructorStudentRow as StudentView,
  InstructorTimelineItem,
  TimelineKind,
} from "@/components/instructors/details/instructorDetailsData";
import type { ScheduleEvent as ScheduleView } from "@/components/instructors/details/schedule/scheduleData";
import type { ActivityLogEntry as ActivityView } from "@/components/instructors/details/activity/activityLogData";
import type {
  ActivityLogEntry,
  InstructorCourseRow,
  InstructorDetails,
  InstructorListItem,
  InstructorNoteItem,
  InstructorReviewRow,
  InstructorStudentRow,
  Revenue,
  ScheduleEvent,
} from "@/types/instructorApi";
import { courseIcon, formatDate } from "@/lib/students/studentView";
import { coursePrice, formatMoney } from "@/lib/money";

/** Maps Instructors API responses to the view models the instructor screens render. Pure functions. */

const DASH = "—";

/** "$1,234" (or "৳1,234" for BDT); the API sums PAID orders. */
export const formatRevenue = ({ amount, currency }: Revenue) => formatMoney(amount, { currency });

export const formatMinutes = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);

const priceLabel = (c: InstructorCourseRow) => coursePrice(c.price, c.isFree);

// ---------------------------------------------------------------- list / header

export const toInstructorItem = (i: InstructorListItem | InstructorDetails, index: number, courses: InstructorCourseRow[] = []): InstructorItem => ({
  id: i.id,
  orderNumber: index + 1,
  name: i.name,
  title: i.title || "Instructor",
  expertise: i.expertise || DASH,
  email: i.email,
  phone: i.phone,
  avatarUrl: i.avatarUrl ?? undefined,
  coursesCount: i.coursesCount,
  studentsCount: i.studentsCount,
  totalRevenue: formatRevenue(i.totalRevenue),
  numericRevenue: i.totalRevenue.amount,
  rating: i.rating,
  reviewsCount: i.reviewsCount,
  status: i.status,
  joinDate: formatDate(i.joinDate),
  bio: "bio" in i ? i.bio : "",
  skills: "skills" in i ? i.skills : [],
  courses: courses.map((c) => ({
    id: c.id,
    title: c.title,
    thumbnailUrl: c.thumbnailUrl ?? undefined,
    studentsCount: c.studentsCount,
    rating: c.rating,
    reviewsCount: c.reviewsCount,
    revenue: formatRevenue(c.revenue),
    category: c.category,
    lessonsCount: c.lessonsCount,
  })),
});

// ---------------------------------------------------------------- details

export const toCourseView = (c: InstructorCourseRow): CourseView => ({
  id: c.id,
  title: c.title,
  subtitle: c.subtitle,
  iconType: courseIcon(c.title, c.category),
  thumbnailUrl: c.thumbnailUrl ?? undefined,
  category: c.category || DASH,
  studentsCount: c.studentsCount,
  duration: c.durationMinutes ? formatMinutes(c.durationMinutes) : DASH,
  price: priceLabel(c),
  status: c.status,
  assignedOn: DASH,
});

/** Course row for a reference (`{ id, title }`) that may not be in the instructor's course list. */
const courseFor = (ref: { id: string; title: string }, courses: CourseView[]): CourseView =>
  courses.find((c) => c.id === ref.id) ?? {
    id: ref.id,
    title: ref.title,
    subtitle: "",
    iconType: courseIcon(ref.title),
    category: DASH,
    studentsCount: 0,
    duration: DASH,
    price: DASH,
    status: "Active",
    assignedOn: DASH,
  };

export const toStudentView = (s: InstructorStudentRow, courses: CourseView[]): StudentView => ({
  id: s.id,
  name: s.student.name,
  email: s.student.email,
  avatarUrl: s.student.avatarUrl ?? "",
  course: courseFor(s.course, courses),
  enrolledOn: formatDate(s.enrolledOn),
  progress: s.progress,
  status: s.status,
});

export const toReviewView = (r: InstructorReviewRow, courses: CourseView[]): ReviewView => ({
  id: r.id,
  studentName: r.student.name,
  avatarUrl: r.student.avatarUrl ?? "",
  studentEmail: r.student.email,
  course: courseFor(r.course, courses),
  rating: r.rating,
  comment: r.comment,
  date: formatDate(r.date),
});

const TIMELINE_KIND: Record<ActivityLogEntry["type"], TimelineKind> = {
  student_enrolled: "enroll",
  new_review: "review",
  live_class: "live",
  earning: "payout",
  note_added: "update",
  account_action: "update",
};

const TIMELINE_TITLE: Record<ActivityLogEntry["type"], string> = {
  student_enrolled: "Student enrolled",
  new_review: "New review",
  live_class: "Live class",
  earning: "Earning received",
  note_added: "Note added",
  account_action: "Account updated",
};

export const toTimelineItem = (a: ActivityLogEntry): InstructorTimelineItem => ({
  id: a.id,
  kind: TIMELINE_KIND[a.type],
  title: TIMELINE_TITLE[a.type],
  subtitle: a.details,
  date: formatDate(a.at),
  time: new Date(a.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
});

export const toActivityView = (a: ActivityLogEntry): ActivityView => ({
  id: a.id,
  type: a.type,
  at: a.at,
  actor: { name: a.actor.name, role: a.actor.role, avatarUrl: a.actor.avatarUrl ?? undefined },
  details: a.details,
  ip: a.ip ?? DASH,
  device: a.device,
});

export const toScheduleView = (e: ScheduleEvent, courses: CourseView[]): ScheduleView => {
  const sourceId = e.id.replace(/^(live|assignment)-/, "");
  return {
    id: e.id,
    title: e.title,
    shortTitle: e.title.length > 16 ? `${e.title.slice(0, 14)}…` : e.title,
    type: e.type,
    course: courseFor(e.course, courses),
    start: e.start,
    end: e.end,
    status: e.status,
    href: e.type === "live" ? `/live-classes/${sourceId}` : `/assignments/${sourceId}`,
    meetingUrl: e.meetingUrl,
  };
};

export const toNoteView = (n: InstructorNoteItem): InstructorNoteView => ({
  id: n.id,
  instructorId: n.instructorId,
  title: n.title,
  content: n.content,
  type: n.type,
  priority: n.priority,
  tags: n.tags,
  reminderDate: n.reminderDate ?? undefined,
  author: { name: n.author.name, avatarUrl: n.author.avatarUrl ?? undefined },
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
});

export interface InstructorRecords {
  courses: InstructorCourseRow[];
  students: InstructorStudentRow[];
  reviews: InstructorReviewRow[];
  activity: ActivityLogEntry[];
}

export function toFullDetails(d: InstructorDetails, r: InstructorRecords): InstructorFullDetails {
  const courses = r.courses.map(toCourseView);
  return {
    instructor: toInstructorItem(d, 0, r.courses),
    courses,
    students: r.students.map((s) => toStudentView(s, courses)),
    reviews: r.reviews.map((rv) => toReviewView(rv, courses)),
    activities: r.activity.slice(0, 8).map(toTimelineItem),
    teachingTime: formatMinutes(d.teachingMinutes),
    account: {
      twoFactorEnabled: d.account.twoFactorEnabled,
      createdAt: formatDate(d.account.createdAt),
      lastLogin: d.account.lastLogin ? formatDate(d.account.lastLogin) : "Never",
    },
    website: d.website,
    socials: d.socials,
  };
}
