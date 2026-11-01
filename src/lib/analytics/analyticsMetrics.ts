/**
 * Analytics core: metrics. Pure functions `(sources, range) → numbers` — no React, no storage access,
 * no hard-coded values. `sources` comes from `getAnalyticsSources()` / `useAnalyticsSources()`,
 * `range` from `resolveRange()` (usually via `useAnalyticsRange()` → `resolveAnalyticsRange(sources, keys)`).
 *
 * Every `Kpi` carries the same metric for the equally long window immediately before the range
 * (`previous`, `changePct`) and a 10-point `spark`. All time has no comparison (changePct null).
 *
 * Definitions (mock phase — mirror these in the backend):
 *  - Revenue (net)    Σ amount of orders whose status is Paid, by payment date (paidAt ?? createdAt).
 *                     Equals the "Total Revenue" card on Orders/Payments for the same window.
 *  - Gross revenue    Paid + Refunded orders by payment date. Refunds = Refunded orders by payment date
 *                     (cohort view), so gross − refunds = net exactly.
 *  - Orders           Orders placed (createdAt) in the range; conversion = (Paid + Refunded) / placed.
 *  - Enrollment       One per course of a Paid order (refunded orders revoke access), dated paidAt.
 *  - Students         Student store; joinDate is display text ("Oct 18, 2026"). Total = joined by range end.
 *  - Active learners  Distinct store students (by email) with an order, quiz attempt, assignment submission,
 *                     attended live class or community post in the window.
 *  - Instructors      Instructor store; active = status Active and joined by range end.
 *  - Published course A catalogue course (see analyticsSources) with at least one order by range end.
 *  - Course revenue   Bundles are split across their courses by list price.
 *
 * API
 *   dataStart(s)                                   first data day (for All time)
 *   resolveAnalyticsRange(s, keys)                 picker keys → ResolvedRange
 *   makeKpi(range, measure)                        build any Kpi from a window → number function
 *   revenueSummary(s, r)        { gross, net, refunds, avgOrderValue, paidOrders }: Kpi
 *   revenueSeries(s, r, g?)     RevenuePoint[]
 *   revenueByPaymentMethod(s, r) / revenueByCourse(s, r) / revenueByCategory(s, r)   BreakdownRow[]
 *   orderSummary(s, r)          { placed, conversion: Kpi, byStatus: Record<OrderStatus, number> }
 *   enrollmentSummary(s, r)     { newEnrollments: Kpi }
 *   enrollmentSeries(s, r, g?)  CountPoint[]
 *   enrollmentsByCourse(s, r) / enrollmentsByCategory(s, r)   BreakdownRow[]
 *   studentSummary(s, r)        { total, newStudents, activeLearners: Kpi, active, inactive, avgCompletion }
 *   studentGrowthSeries(s, r, g?) StudentGrowthPoint[]
 *   completionBreakdown(s, r)   CompletionBreakdown
 *   instructorSummary(s, r)     { active: Kpi, total, inactive }
 *   topInstructors(s, r, by, n) InstructorRow[]
 *   courseSummary(s, r)         { published: Kpi, total }
 *   topCourses(s, r, by, n)     CourseRow[]
 *   learningSummary(s, r)       { quizAttempts, avgQuizScore, quizPassRate, submissions, onTimeRate,
 *                                 liveSessions, attendanceRate, certificatesIssued }: Kpi
 *   communitySummary(s, r)      { threads, replies, reports: Kpi, openReports }
 *   recentOrders(s, r, n) / recentEnrollments(s, r, n)
 *   countSeries(dates, r, g?)   generic "count timestamps per bucket" helper
 *   learnerActivity(s)          timestamped activity of store students (used by retention / top students)
 */

import type { OrderItem, OrderStatus } from "@/types/order";
import type { AnalyticsSources, CatalogCourse } from "./analyticsSources";
import {
  autoGranularity,
  buildBuckets,
  bucketIndex,
  isWithin,
  parseDisplayDate,
  previousRange,
  resolveRange,
  splitRange,
  type PickerRange,
} from "./analyticsRange";
import type {
  BreakdownRow,
  CompletionBreakdown,
  CountPoint,
  CourseRow,
  DateRange,
  Granularity,
  InstructorRow,
  Kpi,
  RecentEnrollmentRow,
  RecentOrderRow,
  ResolvedRange,
  RevenuePoint,
  StudentGrowthPoint,
} from "./analyticsTypes";

// ---------------------------------------------------------------- helpers
const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const pct = (part: number, total: number) => (total > 0 ? round1((part / total) * 100) : 0);
const sum = <T>(rows: T[], f: (r: T) => number) => rows.reduce((s, r) => s + f(r), 0);
const norm = (s: string) => s.trim().toLowerCase();
const ms = (iso: string) => Date.parse(iso);

export const paymentDate = (o: OrderItem) => o.paidAt ?? o.createdAt;

/** Build a Kpi from any window → number measure (value, previous window, 10-point spark). */
export function makeKpi(range: ResolvedRange, measure: (win: DateRange) => number): Kpi {
  const value = measure(range);
  const previous = range.isAllTime ? 0 : measure(previousRange(range));
  const changePct = range.isAllTime || previous === 0 ? null : round1(((value - previous) / Math.abs(previous)) * 100);
  return { value, previous, changePct, spark: splitRange(range, 10).map(measure) };
}

/** First day with data (orders or student joins); All time starts here. */
export function dataStart(s: Pick<AnalyticsSources, "orders" | "students" | "now">): Date {
  let min = s.now.getTime();
  s.orders.forEach((o) => {
    const t = ms(o.createdAt);
    if (t < min) min = t;
  });
  s.students.forEach((st) => {
    const d = parseDisplayDate(st.joinDate);
    if (d && d.getTime() < min) min = d.getTime();
  });
  return new Date(min);
}

/** Picker keys → ResolvedRange using the snapshot clock and first data day. */
export const resolveAnalyticsRange = (s: AnalyticsSources, keys: PickerRange) =>
  resolveRange(keys, { now: s.now, earliest: dataStart(s) });

// ---------------------------------------------------------------- course share (bundles)
/** Splits an order amount across its courses by list price. */
function courseShares(o: OrderItem): { course: OrderItem["courses"][number]; amount: number }[] {
  const listTotal = sum(o.courses, (c) => c.price) || o.courses.length || 1;
  return o.courses.map((c) => ({
    course: c,
    amount: o.courses.length === 1 ? o.amount : (o.amount * (c.price || 1)) / listTotal,
  }));
}

const courseOf = (s: AnalyticsSources, id: string): CatalogCourse | undefined => s.courses.find((c) => c.id === id);

// ---------------------------------------------------------------- revenue
const paidIn = (s: AnalyticsSources, win: DateRange, statuses: OrderStatus[]) =>
  s.orders.filter((o) => statuses.includes(o.status) && isWithin(paymentDate(o), win));

export function revenueSummary(s: AnalyticsSources, r: ResolvedRange) {
  const net = (w: DateRange) => round2(sum(paidIn(s, w, ["Paid"]), (o) => o.amount));
  return {
    gross: makeKpi(r, (w) => round2(sum(paidIn(s, w, ["Paid", "Refunded"]), (o) => o.amount))),
    net: makeKpi(r, net),
    refunds: makeKpi(r, (w) => round2(sum(paidIn(s, w, ["Refunded"]), (o) => o.amount))),
    paidOrders: makeKpi(r, (w) => paidIn(s, w, ["Paid"]).length),
    avgOrderValue: makeKpi(r, (w) => {
      const n = paidIn(s, w, ["Paid"]).length;
      return n ? round2(net(w) / n) : 0;
    }),
  };
}

export function revenueSeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): RevenuePoint[] {
  const buckets = buildBuckets(r, g);
  const points: RevenuePoint[] = buckets.map((b) => ({ ...b, gross: 0, net: 0, refunds: 0, orders: 0, paidOrders: 0 }));
  s.orders.forEach((o) => {
    const placed = bucketIndex(o.createdAt, buckets);
    if (placed >= 0) points[placed].orders++;
    if (o.status !== "Paid" && o.status !== "Refunded") return;
    const i = bucketIndex(paymentDate(o), buckets);
    if (i < 0) return;
    points[i].gross += o.amount;
    if (o.status === "Paid") {
      points[i].net += o.amount;
      points[i].paidOrders++;
    } else points[i].refunds += o.amount;
  });
  return points.map((p) => ({ ...p, gross: round2(p.gross), net: round2(p.net), refunds: round2(p.refunds) }));
}

function toBreakdown(map: Map<string, { label: string; value: number; count: number }>): BreakdownRow[] {
  const total = sum(Array.from(map.values()), (v) => v.value);
  return Array.from(map.entries())
    .map(([key, v]) => ({ key, label: v.label, value: round2(v.value), count: v.count, share: pct(v.value, total) }))
    .sort((a, b) => b.value - a.value || b.count - a.count);
}

function addTo(map: Map<string, { label: string; value: number; count: number }>, key: string, label: string, value: number, count = 1) {
  const cur = map.get(key) ?? { label, value: 0, count: 0 };
  cur.value += value;
  cur.count += count;
  map.set(key, cur);
}

export function revenueByPaymentMethod(s: AnalyticsSources, r: DateRange): BreakdownRow[] {
  const map = new Map<string, { label: string; value: number; count: number }>();
  paidIn(s, r, ["Paid"]).forEach((o) => addTo(map, o.paymentMethod, o.paymentMethod, o.amount));
  return toBreakdown(map);
}

export function revenueByCourse(s: AnalyticsSources, r: DateRange): BreakdownRow[] {
  const map = new Map<string, { label: string; value: number; count: number }>();
  paidIn(s, r, ["Paid"]).forEach((o) => courseShares(o).forEach(({ course, amount }) => addTo(map, course.id, course.title, amount)));
  return toBreakdown(map);
}

export function revenueByCategory(s: AnalyticsSources, r: DateRange): BreakdownRow[] {
  const map = new Map<string, { label: string; value: number; count: number }>();
  paidIn(s, r, ["Paid"]).forEach((o) =>
    courseShares(o).forEach(({ course, amount }) => {
      const cat = courseOf(s, course.id)?.category ?? "Other";
      addTo(map, cat, cat, amount);
    })
  );
  return toBreakdown(map);
}

// ---------------------------------------------------------------- orders
const ORDER_STATUSES: OrderStatus[] = ["Paid", "Pending", "Failed", "Cancelled", "Refunded"];

export function orderSummary(s: AnalyticsSources, r: ResolvedRange) {
  const placedIn = (w: DateRange) => s.orders.filter((o) => isWithin(o.createdAt, w));
  const byStatus = Object.fromEntries(ORDER_STATUSES.map((st) => [st, 0])) as Record<OrderStatus, number>;
  placedIn(r).forEach((o) => byStatus[o.status]++);
  return {
    placed: makeKpi(r, (w) => placedIn(w).length),
    /** % of placed orders that were paid (Paid + Refunded). */
    conversion: makeKpi(r, (w) => {
      const rows = placedIn(w);
      return pct(rows.filter((o) => o.status === "Paid" || o.status === "Refunded").length, rows.length);
    }),
    byStatus,
  };
}

// ---------------------------------------------------------------- enrollments
interface EnrollmentRecord {
  order: OrderItem;
  courseId: string;
  title: string;
  at: string;
}

const enrollmentsIn = (s: AnalyticsSources, win: DateRange): EnrollmentRecord[] =>
  paidIn(s, win, ["Paid"]).flatMap((o) => o.courses.map((c) => ({ order: o, courseId: c.id, title: c.title, at: paymentDate(o) })));

export function enrollmentSummary(s: AnalyticsSources, r: ResolvedRange) {
  return { newEnrollments: makeKpi(r, (w) => enrollmentsIn(s, w).length) };
}

/** Count timestamps per bucket — reusable for any dated list. */
export function countSeries(dates: (string | null | undefined)[], r: DateRange, g: Granularity = autoGranularity(r)): CountPoint[] {
  const buckets = buildBuckets(r, g);
  const points: CountPoint[] = buckets.map((b) => ({ ...b, value: 0 }));
  dates.forEach((d) => {
    if (!d) return;
    const i = bucketIndex(d, buckets);
    if (i >= 0) points[i].value++;
  });
  return points;
}

export const enrollmentSeries = (s: AnalyticsSources, r: DateRange, g?: Granularity) =>
  countSeries(enrollmentsIn(s, r).map((e) => e.at), r, g);

export function enrollmentsByCourse(s: AnalyticsSources, r: DateRange): BreakdownRow[] {
  const map = new Map<string, { label: string; value: number; count: number }>();
  enrollmentsIn(s, r).forEach((e) => addTo(map, e.courseId, e.title, 1));
  return toBreakdown(map);
}

export function enrollmentsByCategory(s: AnalyticsSources, r: DateRange): BreakdownRow[] {
  const map = new Map<string, { label: string; value: number; count: number }>();
  enrollmentsIn(s, r).forEach((e) => {
    const cat = courseOf(s, e.courseId)?.category ?? "Other";
    addTo(map, cat, cat, 1);
  });
  return toBreakdown(map);
}

// ---------------------------------------------------------------- students
const joinedAt = (joinDate: string) => parseDisplayDate(joinDate);
const joinedBy = (joinDate: string, to: Date) => {
  const d = joinedAt(joinDate);
  return !d || d.getTime() <= to.getTime();
};

/**
 * Timestamped activity of students in the student store (matched by email) across orders, quizzes,
 * assignments, attended live classes and community posts. Other stores seed their own learner lists in
 * the mock phase; those learners are ignored so "active" never exceeds the student total.
 */
export function learnerActivity(s: AnalyticsSources): { email: string; at: string }[] {
  const known = new Set(s.students.map((st) => norm(st.email)));
  const liveById = new Map(s.liveClasses.map((c) => [c.id, c]));
  return [
    ...s.orders.map((o) => ({ email: o.student.email, at: o.createdAt })),
    ...s.quizAttempts.map((a) => ({ email: a.student.email, at: a.submittedAt })),
    ...s.submissions.map((x) => ({ email: x.student.email, at: x.submittedAt })),
    ...s.liveEnrollments
      .filter((e) => e.status === "ATTENDED" && liveById.get(e.classId)?.status !== "CANCELLED")
      .map((e) => {
        const c = liveById.get(e.classId);
        return { email: e.student.email, at: c ? new Date(`${c.date}T${c.startTime}`).toISOString() : "" };
      }),
    ...s.threads.filter((t) => t.author.role === "STUDENT").map((t) => ({ email: t.author.email, at: t.createdAt })),
    ...s.replies.filter((x) => x.author.role === "STUDENT").map((x) => ({ email: x.author.email, at: x.createdAt })),
  ].filter((a) => a.at && known.has(norm(a.email)));
}

const distinctActive = (activity: { email: string; at: string }[], win: DateRange) =>
  new Set(activity.filter((a) => isWithin(a.at, win)).map((a) => norm(a.email))).size;

export function studentSummary(s: AnalyticsSources, r: ResolvedRange) {
  const activity = learnerActivity(s);
  const joined = s.students.filter((st) => joinedBy(st.joinDate, r.to));
  return {
    total: makeKpi(r, (w) => s.students.filter((st) => joinedBy(st.joinDate, w.to)).length),
    newStudents: makeKpi(r, (w) => s.students.filter((st) => isWithin(joinedAt(st.joinDate), w)).length),
    activeLearners: makeKpi(r, (w) => distinctActive(activity, w)),
    active: joined.filter((st) => st.status === "Active").length,
    inactive: joined.filter((st) => st.status !== "Active").length,
    /** Mean of students' completion rates (%), students joined by range end. */
    avgCompletion: joined.length ? round1(sum(joined, (st) => st.completionRate) / joined.length) : 0,
  };
}

export function studentGrowthSeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): StudentGrowthPoint[] {
  const buckets = buildBuckets(r, g);
  const activity = learnerActivity(s);
  return buckets.map((b) => {
    const win = { from: b.start, to: new Date(b.end.getTime() - 1) };
    return {
      ...b,
      newStudents: s.students.filter((st) => isWithin(joinedAt(st.joinDate), win)).length,
      activeStudents: distinctActive(activity, win),
    };
  });
}

/**
 * Course-seat completion for students joined by range end: completed seats vs open seats of Active
 * students (in progress) and of Inactive students (stalled).
 */
export function completionBreakdown(s: AnalyticsSources, r: DateRange): CompletionBreakdown {
  const joined = s.students.filter((st) => joinedBy(st.joinDate, r.to));
  const completed = sum(joined, (st) => Math.min(st.completedCoursesCount, st.enrolledCoursesCount));
  const open = (active: boolean) =>
    sum(
      joined.filter((st) => (st.status === "Active") === active),
      (st) => Math.max(0, st.enrolledCoursesCount - st.completedCoursesCount)
    );
  const inProgress = open(true);
  const stalled = open(false);
  const enrolled = completed + inProgress + stalled;
  const share = (n: number) => (enrolled ? Math.round((n / enrolled) * 100) : 0);
  return {
    completionRate: share(completed),
    enrolled,
    segments: [
      { key: "completed", label: "Completed", count: completed, pct: share(completed) },
      { key: "inProgress", label: "In Progress", count: inProgress, pct: share(inProgress) },
      { key: "stalled", label: "Inactive", count: stalled, pct: share(stalled) },
    ],
  };
}

// ---------------------------------------------------------------- instructors
export function instructorSummary(s: AnalyticsSources, r: ResolvedRange) {
  const joined = s.instructors.filter((i) => joinedBy(i.joinDate, r.to));
  return {
    active: makeKpi(r, (w) => s.instructors.filter((i) => i.status === "Active" && joinedBy(i.joinDate, w.to)).length),
    total: joined.length,
    inactive: joined.filter((i) => i.status !== "Active").length,
  };
}

export function topInstructors(s: AnalyticsSources, r: DateRange, by: "revenue" | "enrollments" = "revenue", n = 5): InstructorRow[] {
  const rows = new Map<string, InstructorRow & { courseIds: Set<string> }>();
  paidIn(s, r, ["Paid"]).forEach((o) =>
    courseShares(o).forEach(({ course, amount }) => {
      const store = s.instructors.find((i) => norm(i.name) === norm(course.instructor));
      const key = store?.id ?? course.instructor;
      const row = rows.get(key) ?? {
        id: key,
        name: store?.name ?? course.instructor,
        avatarUrl: store?.avatarUrl,
        courses: 0,
        enrollments: 0,
        revenue: 0,
        rating: store?.rating ?? null,
        courseIds: new Set<string>(),
      };
      row.courseIds.add(course.id);
      row.enrollments++;
      row.revenue += amount;
      rows.set(key, row);
    })
  );
  return Array.from(rows.values())
    .map((row) => ({
      id: row.id,
      name: row.name,
      avatarUrl: row.avatarUrl,
      courses: row.courseIds.size,
      enrollments: row.enrollments,
      revenue: round2(row.revenue),
      rating: row.rating,
    }))
    .sort((a, b) => (by === "revenue" ? b.revenue - a.revenue : b.enrollments - a.enrollments) || b.revenue - a.revenue)
    .slice(0, n);
}

// ---------------------------------------------------------------- courses
function firstOrderAt(s: AnalyticsSources): Map<string, number> {
  const first = new Map<string, number>();
  s.orders.forEach((o) =>
    o.courses.forEach((c) => {
      const t = ms(o.createdAt);
      if (!first.has(c.id) || t < first.get(c.id)!) first.set(c.id, t);
    })
  );
  return first;
}

export function courseSummary(s: AnalyticsSources, r: ResolvedRange) {
  const first = firstOrderAt(s);
  return {
    published: makeKpi(r, (w) => s.courses.filter((c) => (first.get(c.id) ?? Infinity) <= w.to.getTime()).length),
    total: s.courses.length,
  };
}

/** Avg progress of student enrollment records whose title matches the course (null when none). */
function courseCompletion(s: AnalyticsSources, title: string): number | null {
  const records = s.students.flatMap((st) => st.enrolledCourses ?? []).filter((e) => norm(e.title) === norm(title));
  return records.length ? Math.round(sum(records, (e) => e.progress) / records.length) : null;
}

export function topCourses(s: AnalyticsSources, r: DateRange, by: "enrollments" | "revenue" = "enrollments", n = 5): CourseRow[] {
  const stats = new Map<string, { enrollments: number; revenue: number }>();
  paidIn(s, r, ["Paid"]).forEach((o) =>
    courseShares(o).forEach(({ course, amount }) => {
      const cur = stats.get(course.id) ?? { enrollments: 0, revenue: 0 };
      cur.enrollments++;
      cur.revenue += amount;
      stats.set(course.id, cur);
    })
  );
  return s.courses
    .map((c) => {
      const st = stats.get(c.id) ?? { enrollments: 0, revenue: 0 };
      return {
        courseId: c.id,
        title: c.title,
        instructor: c.instructor,
        category: c.category,
        thumbnailUrl: c.thumbnailUrl,
        price: c.price,
        enrollments: st.enrollments,
        revenue: round2(st.revenue),
        completionPct: courseCompletion(s, c.title),
        rating: c.rating,
      };
    })
    .filter((c) => c.enrollments > 0)
    .sort((a, b) => (by === "revenue" ? b.revenue - a.revenue : b.enrollments - a.enrollments) || b.revenue - a.revenue)
    .slice(0, n);
}

// ---------------------------------------------------------------- learning
export function learningSummary(s: AnalyticsSources, r: ResolvedRange) {
  const attemptsIn = (w: DateRange) => s.quizAttempts.filter((a) => isWithin(a.submittedAt, w));
  const finished = (w: DateRange) => attemptsIn(w).filter((a) => a.completed);
  const subsIn = (w: DateRange) => s.submissions.filter((x) => isWithin(x.submittedAt, w));
  const now = s.now.getTime();
  const sessionsIn = (w: DateRange) =>
    s.liveClasses.filter((c) => {
      if (c.status === "CANCELLED") return false;
      const start = new Date(`${c.date}T${c.startTime}`);
      const end = new Date(`${c.date}T${c.endTime}`).getTime();
      return isWithin(start, w) && end <= now;
    });
  const seatsOf = (w: DateRange) => {
    const ids = new Set(sessionsIn(w).map((c) => c.id));
    return s.liveEnrollments.filter((e) => ids.has(e.classId));
  };
  return {
    quizAttempts: makeKpi(r, (w) => attemptsIn(w).length),
    /** Mean score % of finished attempts. */
    avgQuizScore: makeKpi(r, (w) => {
      const rows = finished(w).filter((a) => a.totalMarks > 0);
      return rows.length ? round1(sum(rows, (a) => (a.score / a.totalMarks) * 100) / rows.length) : 0;
    }),
    quizPassRate: makeKpi(r, (w) => {
      const rows = finished(w);
      return pct(rows.filter((a) => a.passed).length, rows.length);
    }),
    submissions: makeKpi(r, (w) => subsIn(w).length),
    onTimeRate: makeKpi(r, (w) => {
      const rows = subsIn(w);
      return pct(rows.filter((x) => !x.isLate).length, rows.length);
    }),
    liveSessions: makeKpi(r, (w) => sessionsIn(w).length),
    attendanceRate: makeKpi(r, (w) => {
      const seats = seatsOf(w);
      return pct(seats.filter((e) => e.status === "ATTENDED").length, seats.length);
    }),
    certificatesIssued: makeKpi(r, (w) => s.certificates.filter((c) => isWithin(c.issuedAt, w)).length),
  };
}

// ---------------------------------------------------------------- community
export function communitySummary(s: AnalyticsSources, r: ResolvedRange) {
  return {
    threads: makeKpi(r, (w) => s.threads.filter((t) => isWithin(t.createdAt, w)).length),
    replies: makeKpi(r, (w) => s.replies.filter((x) => isWithin(x.createdAt, w)).length),
    reports: makeKpi(r, (w) => s.reports.filter((x) => isWithin(x.createdAt, w)).length),
    /** Current moderation queue (not range-bound). */
    openReports: s.reports.filter((x) => x.status === "OPEN").length,
  };
}

// ---------------------------------------------------------------- recent rows
const byNewest = <T>(rows: T[], at: (r: T) => string) => [...rows].sort((a, b) => ms(at(b)) - ms(at(a)));

export function recentOrders(s: AnalyticsSources, r: DateRange, n = 5): RecentOrderRow[] {
  return byNewest(
    s.orders.filter((o) => isWithin(o.createdAt, r)),
    (o) => o.createdAt
  )
    .slice(0, n)
    .map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      studentId: o.student.id,
      studentName: o.student.name,
      avatarUrl: o.student.avatarUrl,
      course: o.isBundle ? `${o.courses[0].title} (Bundle)` : o.courses.map((c) => c.title).join(", "),
      amount: o.amount,
      status: o.status,
      date: o.createdAt,
    }));
}

export function recentEnrollments(s: AnalyticsSources, r: DateRange, n = 5): RecentEnrollmentRow[] {
  const studentById = new Map(s.students.map((st) => [st.id, st]));
  return byNewest(enrollmentsIn(s, r), (e) => e.at)
    .slice(0, n)
    .map((e) => {
      const st = studentById.get(e.order.student.id);
      const record = st?.enrolledCourses?.find((c) => norm(c.title) === norm(e.title));
      return {
        id: `${e.order.id}:${e.courseId}`,
        orderId: e.order.id,
        studentId: e.order.student.id,
        studentName: e.order.student.name,
        avatarUrl: e.order.student.avatarUrl ?? st?.avatarUrl,
        courseId: e.courseId,
        course: e.title,
        progress: Math.max(0, Math.min(100, record?.progress ?? st?.completionRate ?? 0)),
        enrolledAt: e.at,
      };
    });
}
