import type { LiveClassItem, LiveDisplayStatus, LiveEnrollment } from "@/types/liveClass";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { attendeesOf, courseOf, formatClock, instructorOf, liveStatus, startOf } from "@/lib/liveClassStats";
import { LIVE_COURSES, LIVE_INSTRUCTORS } from "@/lib/liveClassStorage";
import { toCsv } from "@/components/commerce/exportFile";
import { LIVE_PLATFORM_LABEL, LIVE_STATUS_VIEW, LIVE_TYPE_LABEL, formatLiveDate } from "../shared/liveClassView";

/** One table row: the class plus everything derived for display (status / attendees by clock + storage). */
export interface LiveClassRow {
  id: string;
  item: LiveClassItem;
  status: LiveDisplayStatus;
  attendees: number;
  courseTitle: string;
  instructorName: string;
}

export type DateSort = "asc" | "desc";
export const parseDateSort = (v: string): DateSort => (v === "asc" ? "asc" : "desc");

export const STATUS_PARAM: Record<string, LiveDisplayStatus> = {
  live: "LIVE",
  upcoming: "UPCOMING",
  scheduled: "SCHEDULED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

export const STATUS_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Status" },
  ...Object.entries(STATUS_PARAM).map(([value, s]) => ({ value, label: LIVE_STATUS_VIEW[s].label })),
];

export const INSTRUCTOR_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Instructors" },
  ...LIVE_INSTRUCTORS.map((i) => ({ value: i.id, label: i.name })),
];

export const COURSE_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Courses" },
  ...LIVE_COURSES.map((c) => ({ value: c.id, label: c.title })),
];

export const toRows = (classes: LiveClassItem[], enrollments: LiveEnrollment[], now: Date): LiveClassRow[] =>
  classes.map((item) => ({
    id: item.id,
    item,
    status: liveStatus(item, now),
    attendees: attendeesOf(item.id, enrollments),
    courseTitle: courseOf(item.courseId)?.title ?? "Unknown course",
    instructorName: instructorOf(item.instructorId)?.name ?? "Unassigned",
  }));

export interface LiveListFilters {
  q: string;
  status: string;
  instructor: string;
  course: string;
  from: string;
  to: string;
  sort: DateSort;
}

export function filterRows(rows: LiveClassRow[], f: LiveListFilters) {
  const q = f.q.trim().toLowerCase();
  const wanted = STATUS_PARAM[f.status];
  const list = rows.filter((r) => {
    if (wanted && r.status !== wanted) return false;
    if (f.instructor !== "All" && r.item.instructorId !== f.instructor) return false;
    if (f.course !== "All" && r.item.courseId !== f.course) return false;
    if (f.from && r.item.date < f.from) return false;
    if (f.to && r.item.date > f.to) return false;
    if (!q) return true;
    return [r.item.title, r.courseTitle, r.instructorName].some((s) => s.toLowerCase().includes(q));
  });
  const dir = f.sort === "asc" ? 1 : -1;
  return list.sort((a, b) => dir * (startOf(a.item).getTime() - startOf(b.item).getTime()));
}

/** Seats taken shown as "120 / 150": attendees once the class started, 0 before. */
export const hasStarted = (s: LiveDisplayStatus) => s === "LIVE" || s === "COMPLETED";

export const timeRange = (item: Pick<LiveClassItem, "startTime" | "endTime">) => `${formatClock(item.startTime)} - ${formatClock(item.endTime)}`;

export function liveClassesCsv(rows: LiveClassRow[]) {
  return toCsv(
    ["Title", "Type", "Course", "Instructor", "Date", "Time", "Attendees", "Capacity", "Status", "Platform", "Meeting Link"],
    rows.map((r) => [
      r.item.title,
      LIVE_TYPE_LABEL[r.item.type],
      r.courseTitle,
      r.instructorName,
      formatLiveDate(r.item.date),
      timeRange(r.item),
      hasStarted(r.status) ? r.attendees : 0,
      r.item.capacity,
      LIVE_STATUS_VIEW[r.status].label,
      LIVE_PLATFORM_LABEL[r.item.platform],
      r.item.meetingLink,
    ])
  );
}
