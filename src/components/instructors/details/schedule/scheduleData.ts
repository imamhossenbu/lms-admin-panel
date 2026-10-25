import { InstructorCourseRow } from "../instructorDetailsData";

export type ScheduleEventType = "live" | "webinar" | "assignment" | "exam" | "other";
export type ScheduleEventStatus = "Upcoming" | "Completed" | "Cancelled";
export type CalendarView = "month" | "week" | "day";

export interface ScheduleEvent {
  id: string;
  title: string;
  shortTitle: string;
  type: ScheduleEventType;
  course: InstructorCourseRow;
  /** ISO strings so events survive JSON/state round trips. */
  start: string;
  end: string;
  status: ScheduleEventStatus;
}

export const EVENT_TYPE_META: Record<ScheduleEventType, { label: string; dot: string; soft: string }> = {
  live: { label: "Live Class", dot: "bg-blue", soft: "bg-blue-14 text-blue" },
  webinar: { label: "Webinar", dot: "bg-green", soft: "bg-green-bg text-green" },
  assignment: { label: "Assignment", dot: "bg-brand-orange", soft: "bg-brand-orange-light text-brand-orange" },
  exam: { label: "Exam", dot: "bg-red", soft: "bg-red-14 text-red" },
  other: { label: "Other", dot: "bg-purple", soft: "bg-purple-14 text-purple" },
};

const TOPICS: Record<string, string[]> = {
  html: ["HTML Basics", "Forms & Semantics", "Accessibility Basics"],
  css: ["CSS Layout & Flexbox", "Grid Deep Dive", "Responsive Patterns"],
  javascript: ["JavaScript Fundamentals", "Async & Promises", "DOM Projects"],
  react: ["React Components", "Hooks in Practice", "State Management"],
  node: ["Node.js Introduction", "Building REST APIs", "Auth with JWT"],
  uiux: ["UI/UX Design Principles", "Wireframing Workshop", "Usability Testing"],
};

const TYPE_CYCLE: ScheduleEventType[] = ["live", "live", "webinar", "live", "assignment", "live", "exam", "other"];
const TYPE_PREFIX: Record<ScheduleEventType, string> = {
  live: "Live Class: ",
  webinar: "Webinar: ",
  assignment: "Assignment Due: ",
  exam: "Exam: ",
  other: "",
};
const SLOTS: [number, number][] = [[10, 0], [14, 0], [16, 0], [10, 0], [14, 0]];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Classes spread from two weeks ago to three weeks ahead of `today`. */
export function buildScheduleEvents(
  instructorId: string,
  courses: InstructorCourseRow[],
  today: Date = new Date()
): ScheduleEvent[] {
  if (courses.length === 0) return [];
  const base = startOfDay(today);
  const now = today.getTime();

  return Array.from({ length: 16 }, (_, i) => {
    const course = courses[i % courses.length];
    const type = TYPE_CYCLE[i % TYPE_CYCLE.length];
    const topics = TOPICS[course.iconType ?? ""] ?? [`${course.title} Session`];
    const topic = topics[Math.floor(i / courses.length) % topics.length];
    const [hour, minute] = SLOTS[i % SLOTS.length];

    const start = new Date(base);
    start.setDate(base.getDate() - 14 + Math.round(i * 2.3));
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + 90 * 60 * 1000);

    return {
      id: `${instructorId}-evt-${i + 1}`,
      title: `${TYPE_PREFIX[type]}${topic}`,
      shortTitle: topic.length > 16 ? `${topic.slice(0, 14)}…` : topic,
      type,
      course,
      start: start.toISOString(),
      end: end.toISOString(),
      status: end.getTime() < now ? "Completed" : "Upcoming",
    };
  });
}

// ---------------------------------------------------------------------------
// Date helpers for the calendar
// ---------------------------------------------------------------------------

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const fromDateKey = (key: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return isNaN(date.getTime()) ? null : date;
};

export const isSameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const startOfWeek = (date: Date) => {
  const d = startOfDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

/** 6-row (42-day) grid covering the month that contains `anchor`. */
export const getMonthGrid = (anchor: Date): Date[] => {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const lastOfMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const days = Math.ceil((first.getDay() + lastOfMonth.getDate()) / 7) * 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
};

export const shiftAnchor = (anchor: Date, view: CalendarView, direction: 1 | -1) => {
  const next = new Date(anchor);
  if (view === "month") next.setMonth(anchor.getMonth() + direction, 1);
  else if (view === "week") next.setDate(anchor.getDate() + 7 * direction);
  else next.setDate(anchor.getDate() + direction);
  return next;
};

export const getRangeLabel = (anchor: Date, view: CalendarView) => {
  if (view === "month") return `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`;
  if (view === "day") {
    return anchor.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  }
  const start = startOfWeek(anchor);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
};
