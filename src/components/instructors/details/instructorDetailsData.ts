import { InstructorItem } from "@/types/instructor";
import {
  ENROLLMENT_COURSES,
  EnrollmentCourse,
} from "@/components/students/create/mockEnrollmentCourses";

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

// ---------------------------------------------------------------------------
// Deterministic mock helpers (same instructor always produces the same data)
// ---------------------------------------------------------------------------

const CATALOG_EXTRAS: Record<string, { subtitle: string; status: CourseStatus }> = {
  "course-1": { subtitle: "Learn the basics of HTML from scratch", status: "Active" },
  "course-2": { subtitle: "Build modern responsive websites", status: "Active" },
  "course-3": { subtitle: "Master JavaScript step by step", status: "Active" },
  "course-4": { subtitle: "Build modern web apps with React", status: "Draft" },
  "course-5": { subtitle: "Learn server-side development", status: "Active" },
  "course-6": { subtitle: "Design intuitive user experiences", status: "Active" },
};

const PORTRAITS = [
  "1494790108377-be9c29b29330",
  "1507003211169-0a1dd7228f2d",
  "1438761681033-6461ffad8d80",
  "1500648767791-00dcc994a43e",
  "1544005313-94ddf0286df2",
  "1506794778202-cad84cf45f1d",
  "1531746020798-e6953c6e8e04",
  "1519085360753-af0119f7cbe7",
  "1524504388940-b1c1722653e1",
  "1472099645785-5658abf4ff4e",
  "1508214751196-bcfd4ca60f91",
  "1535713875002-d1d0cf377fde",
  "1517841905240-472988babdf9",
  "1548142813-c348350df52b",
].map((id) => `https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`);

const FIRST_NAMES = [
  "Samira", "Arif", "Nusrat", "Tanvir", "Faria", "Rahat", "Mehedi", "Tania",
  "Imran", "Sharmin", "Rafiq", "Ayesha", "Sabbir", "Nadia", "Fahad", "Lamia",
  "Shakil", "Raisa", "Kamrul", "Jannat",
];
const LAST_NAMES = [
  "Akter", "Hossain", "Jahan", "Ahmed", "Islam", "Mia", "Hasan", "Rahman",
  "Chowdhury", "Karim", "Sultana", "Uddin", "Begum", "Sarker",
];

const REVIEW_COMMENTS: Record<number, string[]> = {
  5: [
    "The instructor explains everything very clearly. The course content is well organized and easy to follow. Highly recommended!",
    "Best course I've taken so far. The instructor is very patient and knowledgeable.",
    "Clear explanations, hands-on examples, and great support. Loved the course!",
    "Every lesson builds on the last one perfectly. I finally understand the fundamentals.",
  ],
  4: [
    "Great teaching style and very helpful in doubt clearing. The examples are practical and easy to understand.",
    "Explains complex topics in a simple way. The live class sessions were very helpful.",
    "Very good course with practical examples. Could include more advanced topics, but overall great.",
  ],
  3: [
    "Good content overall, but some sections felt rushed. More exercises would help.",
    "Useful course, though the pace was a little uneven in the middle modules.",
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Small deterministic PRNG so mock rows are stable across renders and reloads. */
const seeded = (seed: number) => {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const hashString = (value: string) =>
  value.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);

const parseDate = (value: string) => {
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date(2026, 9, 12) : parsed;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const formatDate = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;

const formatTime = (hours: number, minutes: number) => {
  const suffix = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const durationToMinutes = (duration: string) => {
  const h = /(\d+)\s*h/.exec(duration)?.[1] ?? "0";
  const m = /(\d+)\s*m/.exec(duration)?.[1] ?? "0";
  return Number(h) * 60 + Number(m);
};

const minutesToDuration = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

const buildCourses = (instructor: InstructorItem, joined: Date): InstructorCourseRow[] =>
  instructor.courses.map((course, idx) => {
    const catalog = ENROLLMENT_COURSES.find((c) => c.id === course.id);
    const assignedOn = formatDate(addDays(joined, idx * 3));

    if (catalog) {
      const extras = CATALOG_EXTRAS[catalog.id];
      return {
        id: catalog.id,
        title: catalog.title,
        subtitle: extras?.subtitle ?? catalog.category,
        iconType: catalog.iconType,
        category: catalog.category,
        studentsCount: catalog.studentsCount,
        duration: catalog.duration,
        price: catalog.price,
        status: extras?.status ?? "Active",
        assignedOn,
      };
    }

    const lessons = course.lessonsCount ?? 20;
    const revenue = Number(course.revenue.replace(/[^\d.]/g, "")) || 0;
    const unitPrice = course.studentsCount > 0 ? Math.round(revenue / course.studentsCount) : 0;
    return {
      id: course.id,
      title: course.title,
      subtitle: `${lessons} lessons`,
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      studentsCount: course.studentsCount,
      duration: minutesToDuration(lessons * 12),
      price: unitPrice > 0 ? `$${unitPrice}` : "Free",
      status: "Active",
      assignedOn,
    };
  });

const buildStudents = (
  instructor: InstructorItem,
  courses: InstructorCourseRow[],
  joined: Date
): InstructorStudentRow[] => {
  if (courses.length === 0) return [];
  const rand = seeded(hashString(instructor.id));

  return Array.from({ length: instructor.studentsCount }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length + i) % LAST_NAMES.length];
    const suffix = i < FIRST_NAMES.length ? "" : String(i);
    return {
      id: `${instructor.id}-std-${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}${suffix}@example.com`,
      avatarUrl: PORTRAITS[i % PORTRAITS.length],
      course: courses[i % courses.length],
      enrolledOn: formatDate(addDays(joined, 2 + i)),
      progress: Math.round(rand() * 19 + 1) * 5,
      status: rand() < 0.88 ? "Active" : "Inactive",
    };
  });
};

const buildReviews = (
  instructor: InstructorItem,
  courses: InstructorCourseRow[],
  students: InstructorStudentRow[],
  joined: Date
): InstructorReviewRow[] => {
  const total = instructor.reviewsCount;
  if (total === 0 || courses.length === 0) return [];

  // Pick a rating mix whose average matches the instructor's overall rating
  const rating = Math.min(5, Math.max(3, instructor.rating));
  const high = rating >= 4 ? 5 : 4;
  const low = high - 1;
  const highCount = Math.round(total * (rating - low));
  const rand = seeded(hashString(`${instructor.id}-reviews`));
  const ratings = Array.from({ length: total }, (_, i) => (i < highCount ? high : low))
    // Interleave so the first page isn't all one rating
    .map((value) => ({ value, sort: rand() }))
    .sort((a, b) => a.sort - b.sort)
    .map((r) => r.value);

  return ratings.map((stars, i) => {
    const student = students[i % Math.max(1, students.length)];
    const comments = REVIEW_COMMENTS[stars] ?? REVIEW_COMMENTS[4];
    return {
      id: `${instructor.id}-rev-${i + 1}`,
      studentName: student?.name ?? `${FIRST_NAMES[i % FIRST_NAMES.length]} Rahman`,
      studentEmail: student?.email ?? "student@example.com",
      avatarUrl: student?.avatarUrl ?? PORTRAITS[i % PORTRAITS.length],
      course: student?.course ?? courses[i % courses.length],
      rating: stars,
      comment: comments[i % comments.length],
      date: formatDate(addDays(joined, 2 + i)),
    };
  });
};

const ACTIVITY_TEMPLATES: { kind: TimelineKind; title: string }[] = [
  { kind: "lesson", title: "Published a new lesson" },
  { kind: "assignment", title: "Created a new assignment" },
  { kind: "update", title: "Updated course content" },
  { kind: "live", title: "Live class completed" },
  { kind: "enroll", title: "Student enrolled" },
];

const buildActivities = (
  instructor: InstructorItem,
  courses: InstructorCourseRow[]
): InstructorTimelineItem[] => {
  const stored: InstructorTimelineItem[] = (instructor.recentActivities ?? [])
    .filter((a) => a.timestamp === "Just now")
    .map((a) => ({ id: a.id, kind: a.iconType, title: a.action, date: "Just now" }));

  const latest = new Date(2026, 9, 25);
  const generated = courses.length
    ? ACTIVITY_TEMPLATES.map((template, idx) => ({
        id: `${instructor.id}-act-${idx}`,
        kind: template.kind,
        title: template.title,
        subtitle: courses[idx % courses.length].title,
        date: formatDate(addDays(latest, -idx * 3)),
        time: formatTime(10 + ((idx * 3) % 7), (idx * 17) % 60),
      }))
    : [];

  return [...stored, ...generated];
};

export function buildInstructorDetails(instructor: InstructorItem): InstructorFullDetails {
  const joined = parseDate(instructor.joinDate);
  const courses = buildCourses(instructor, joined);
  const students = buildStudents(instructor, courses, joined);
  const reviews = buildReviews(instructor, courses, students, joined);
  const teachingMinutes = courses.reduce((sum, c) => sum + durationToMinutes(c.duration), 0);
  const handle = instructor.name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");

  return {
    instructor,
    courses,
    students,
    reviews,
    activities: buildActivities(instructor, courses),
    teachingTime: minutesToDuration(teachingMinutes),
    account: {
      twoFactorEnabled: false,
      createdAt: `${formatDate(joined)} 09:30 AM`,
      lastLogin: `${formatDate(new Date(2026, 9, 25))} 10:45 AM`,
    },
    website: "https://example.com",
    socials: {
      linkedin: `https://www.linkedin.com/in/${handle}`,
      twitter: `https://twitter.com/${handle}`,
      website: "https://example.com",
    },
  };
}
