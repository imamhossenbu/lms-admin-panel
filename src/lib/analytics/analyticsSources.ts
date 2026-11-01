/**
 * Analytics core: data sources.
 *
 * `getAnalyticsSources(now?)` returns ONE immutable snapshot of every mock store the analytics read
 * (orders, students, instructors, the sellable course catalogue, categories, quizzes + attempts,
 * assignments + submissions, live classes + attendance, certificates, community, notifications,
 * platform currency). On the server (no `window`) every store returns its seed, so the call is safe
 * anywhere; in the browser it reads localStorage (seeding it on first use, exactly like the feature pages).
 *
 * `useAnalyticsSources()` is the React hook: `null` until mounted (render a skeleton), then the snapshot,
 * re-read whenever any store broadcasts one of `ANALYTICS_EVENTS` (or another tab writes localStorage).
 * Events are coalesced into one re-read per tick.
 *
 * Course universe (mock phase): the 10 courses that are sold through Orders (`ORDER_COURSES`). The /courses
 * page reads the real API and the quiz/assignment catalogue has 4 different demo courses, so neither can be
 * joined to revenue. Each catalogue course gets a category (`COURSE_CATEGORY`, names from the Categories
 * seed) and, where the instructor store has a course with the same title, that course's rating.
 * Swap this module for API calls in the backend phase; `analyticsMetrics.ts` only depends on the shape.
 */

import { useSyncExternalStore } from "react";
import type { OrderCourse, OrderItem } from "@/types/order";
import type { StudentItem } from "@/types/student";
import type { InstructorItem } from "@/types/instructor";
import type { CategoryItem } from "@/types/category";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { LiveClassItem, LiveEnrollment } from "@/types/liveClass";
import type { IssuedCertificate } from "@/types/certificate";
import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";
import type { NotificationSeed } from "@/data/mockNotificationData";
import { ORDER_COURSES } from "@/data/mockOrderData";
import { MOCK_CATEGORIES } from "@/data/mockCategoryData";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";
import { getStoredStudents } from "@/lib/studentStorage";
import { getStoredInstructors, INSTRUCTORS_UPDATED_EVENT } from "@/lib/instructorStorage";
import { getQuizAttemptsSnapshot, getQuizzesSnapshot, QUIZZES_UPDATED_EVENT } from "@/lib/quizStorage";
import { ASSIGNMENTS_UPDATED_EVENT, getAssignmentsSnapshot, getSubmissionsSnapshot } from "@/lib/assignmentStorage";
import { getLiveClassesSnapshot, getLiveEnrollmentsSnapshot, LIVE_CLASSES_UPDATED_EVENT } from "@/lib/liveClassStorage";
import { CERTIFICATES_UPDATED_EVENT, getCertificatesSnapshot } from "@/lib/certificateStorage";
import { COMMUNITY_UPDATED_EVENT, getCommunitySnapshot } from "@/lib/communityStorage";
import { getNotificationsSnapshot, NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notificationStorage";
import { getSettingsSnapshot, SETTINGS_UPDATED_EVENT } from "@/lib/settingsStorage";

/** studentStorage dispatches this literal (it has no exported constant). */
export const STUDENTS_UPDATED_EVENT = "edupro_students_updated";

/** Every store event that should refresh analytics. */
export const ANALYTICS_EVENTS: readonly string[] = [
  ORDERS_UPDATED_EVENT,
  STUDENTS_UPDATED_EVENT,
  INSTRUCTORS_UPDATED_EVENT,
  QUIZZES_UPDATED_EVENT,
  ASSIGNMENTS_UPDATED_EVENT,
  LIVE_CLASSES_UPDATED_EVENT,
  CERTIFICATES_UPDATED_EVENT,
  COMMUNITY_UPDATED_EVENT,
  NOTIFICATIONS_UPDATED_EVENT,
  SETTINGS_UPDATED_EVENT,
];

/** Mock-phase category of each sellable course (names match the Categories seed). */
export const COURSE_CATEGORY: Record<string, string> = {
  "c-101": "Development",
  "c-102": "Development",
  "c-103": "Development",
  "c-104": "Development",
  "c-201": "Design",
  "c-301": "Marketing",
  "c-501": "Data Science",
  "c-601": "Development",
  "c-602": "Business",
  "c-701": "Design",
};

export interface CatalogCourse extends OrderCourse {
  category: string;
  /** Rating of the instructor's course record with the same title, else null. */
  rating: number | null;
}

export interface AnalyticsSources {
  /** Clock used for "today", All time and live-class status. */
  now: Date;
  /** ISO 4217 code from Settings → General (orders are stored in USD). */
  currency: string;
  orders: OrderItem[];
  students: StudentItem[];
  instructors: InstructorItem[];
  courses: CatalogCourse[];
  categories: CategoryItem[];
  quizzes: QuizItem[];
  quizAttempts: QuizAttempt[];
  assignments: AssignmentItem[];
  submissions: AssignmentSubmission[];
  liveClasses: LiveClassItem[];
  liveEnrollments: LiveEnrollment[];
  certificates: IssuedCertificate[];
  threads: CommunityThread[];
  replies: ThreadReply[];
  reports: ThreadReport[];
  notifications: NotificationSeed;
}

const norm = (s: string) => s.trim().toLowerCase();

function buildCatalog(orders: OrderItem[], instructors: InstructorItem[]): CatalogCourse[] {
  // Catalogue courses first, then any course that only exists on stored orders.
  const byId = new Map<string, OrderCourse>(ORDER_COURSES.map((c) => [c.id, c]));
  orders.forEach((o) => o.courses.forEach((c) => !byId.has(c.id) && byId.set(c.id, c)));
  return Array.from(byId.values()).map((c) => {
    const owner = instructors.find((i) => norm(i.name) === norm(c.instructor));
    const match = owner?.courses.find((ic) => norm(ic.title) === norm(c.title));
    return { ...c, category: COURSE_CATEGORY[c.id] ?? "Other", rating: match ? match.rating : null };
  });
}

/** One snapshot of every store (seeds on the server). */
export function getAnalyticsSources(now: Date = new Date()): AnalyticsSources {
  const orders = getStoredOrders();
  const instructors = getStoredInstructors();
  const community = getCommunitySnapshot();
  let currency = "USD";
  try {
    currency = getSettingsSnapshot().settings.general.currency || "USD";
  } catch {
    /* keep USD */
  }
  return {
    now,
    currency,
    orders,
    students: getStoredStudents(),
    instructors,
    courses: buildCatalog(orders, instructors),
    categories: MOCK_CATEGORIES,
    quizzes: getQuizzesSnapshot(),
    quizAttempts: getQuizAttemptsSnapshot(),
    assignments: getAssignmentsSnapshot(),
    submissions: getSubmissionsSnapshot(),
    liveClasses: getLiveClassesSnapshot(),
    liveEnrollments: getLiveEnrollmentsSnapshot(),
    certificates: getCertificatesSnapshot().certificates,
    threads: community.threads,
    replies: community.replies,
    reports: community.reports,
    notifications: getNotificationsSnapshot(),
  };
}

// ---------------------------------------------------------------- React hook (client)
let cache: AnalyticsSources | null = null;
let dirty = true;

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onEvent = () => {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(onChange, 0);
  };
  ANALYTICS_EVENTS.forEach((e) => window.addEventListener(e, onEvent));
  window.addEventListener("storage", onEvent);
  return () => {
    clearTimeout(timer);
    ANALYTICS_EVENTS.forEach((e) => window.removeEventListener(e, onEvent));
    window.removeEventListener("storage", onEvent);
  };
}

function getSnapshot() {
  if (dirty || !cache) {
    cache = getAnalyticsSources();
    // Reset after reading: first-time seeding dispatches store events synchronously.
    dirty = false;
  }
  return cache;
}

const getServerSnapshot = () => null;

/**
 * Live analytics snapshot: null on the server / during hydration (render a skeleton), then the cached
 * snapshot, re-read once per tick after any `ANALYTICS_EVENTS` event or cross-tab storage write.
 */
export function useAnalyticsSources(): AnalyticsSources | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
