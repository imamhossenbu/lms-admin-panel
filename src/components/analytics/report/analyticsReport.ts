/**
 * Analytics page: per-tab report data. Pure — every number comes from the analytics core
 * (`@/lib/analytics`); the same object feeds the tab UI and the CSV export.
 */

import {
  assignmentPerformance,
  autoGranularity,
  avgCompletionKpi,
  certificateSeries,
  communityActivitySeries,
  communitySummary,
  completionBreakdown,
  courseSummary,
  enrollmentSeries,
  enrollmentSummary,
  enrollmentsByCategory,
  enrollmentsByCourse,
  granularityOptions,
  instructorSummary,
  learnerRetentionSeries,
  learningSummary,
  liveAttendanceSeries,
  orderSummary,
  previousRange,
  quizActivitySeries,
  quizPerformance,
  revenueByCategory,
  revenueByCourse,
  revenueByPaymentMethod,
  revenueSeries,
  revenueSummary,
  studentGrowthSeries,
  studentSummary,
  submissionSeries,
  topCourses,
  topInstructors,
  topStudents,
  type AnalyticsSources,
  type BreakdownRow,
  type Granularity,
  type Kpi,
  type ResolvedRange,
  type StudentRankBy,
} from "@/lib/analytics";

export type AnalyticsTab = "overview" | "revenue" | "students" | "courses" | "engagement";
export const ANALYTICS_TABS: AnalyticsTab[] = ["overview", "revenue", "students", "courses", "engagement"];

export type InstructorRankBy = "revenue" | "enrollments";

export interface ReportOptions {
  /** Revenue trend bucket (validated against granularityOptions). */
  granularity: Granularity;
  instructorRank: InstructorRankBy;
  studentRank: StudentRankBy;
}

/** Validates URL options against the range. */
export function resolveReportOptions(range: ResolvedRange, raw: { granularity?: string; instructorRank?: string; studentRank?: string }): ReportOptions {
  const allowed = granularityOptions(range);
  const granularity = allowed.includes(raw.granularity as Granularity) ? (raw.granularity as Granularity) : autoGranularity(range);
  const instructorRank: InstructorRankBy = raw.instructorRank === "enrollments" ? "enrollments" : "revenue";
  const studentRank: StudentRankBy = raw.studentRank === "score" || raw.studentRank === "spent" ? raw.studentRank : "completion";
  return { granularity, instructorRank, studentRank };
}

export interface RevenueCourseRow extends BreakdownRow {
  /** Revenue change vs the previous window (null when All time or no previous revenue). */
  changePct: number | null;
}

// ---------------------------------------------------------------- overview
function buildOverview(s: AnalyticsSources, r: ResolvedRange) {
  const revenue = revenueSummary(s, r);
  const orders = orderSummary(s, r);
  const enrollments = enrollmentSummary(s, r);
  const students = studentSummary(s, r);
  const learning = learningSummary(s, r);
  const avgCompletion = avgCompletionKpi(s, r);

  const g = autoGranularity(r);
  const rev = revenueSeries(s, r, g);
  const enr = enrollmentSeries(s, r, g);
  const combo = rev.map((p, i) => ({ ...p, enrollments: enr[i]?.value ?? 0 }));

  const daily = revenueSeries(s, r, "day");
  const bestDay = daily.reduce<(typeof daily)[number] | null>((best, p) => (p.net > 0 && (!best || p.net > best.net) ? p : best), null);
  const bestCourse = topCourses(s, r, "revenue", 1)[0] ?? null;
  const topMethod = revenueByPaymentMethod(s, r)[0] ?? null;
  const topCategory = enrollmentsByCategory(s, r)[0] ?? null;

  const kpis = {
    netRevenue: revenue.net,
    orders: orders.placed,
    conversion: orders.conversion,
    newEnrollments: enrollments.newEnrollments,
    activeLearners: students.activeLearners,
    avgCompletion,
    certificates: learning.certificatesIssued,
    quizPassRate: learning.quizPassRate,
  };

  const labels: Record<keyof typeof kpis, string> = {
    netRevenue: "Net revenue",
    orders: "Orders",
    conversion: "Conversion",
    newEnrollments: "New enrollments",
    activeLearners: "Active learners",
    avgCompletion: "Avg completion",
    certificates: "Certificates issued",
    quizPassRate: "Quiz pass rate",
  };
  const biggestChange = (Object.keys(kpis) as (keyof typeof kpis)[])
    .map((key) => ({ key, label: labels[key], kpi: kpis[key] as Kpi }))
    .filter((k) => k.kpi.changePct !== null)
    .sort((a, b) => Math.abs(b.kpi.changePct!) - Math.abs(a.kpi.changePct!))[0] ?? null;

  return { kpis, combo, highlights: { bestCourse, bestDay, biggestChange, topMethod, topCategory } };
}

// ---------------------------------------------------------------- revenue
function buildRevenue(s: AnalyticsSources, r: ResolvedRange, o: ReportOptions) {
  const current = revenueByCourse(s, r);
  const previous = r.isAllTime ? [] : revenueByCourse(s, previousRange(r));
  const byCourse: RevenueCourseRow[] = current.map((row) => {
    const prev = previous.find((p) => p.key === row.key)?.value ?? 0;
    return { ...row, changePct: r.isAllTime || prev === 0 ? null : Math.round(((row.value - prev) / prev) * 1000) / 10 };
  });
  return {
    summary: revenueSummary(s, r),
    series: revenueSeries(s, r, o.granularity),
    granularity: o.granularity,
    granularityOptions: granularityOptions(r),
    byMethod: revenueByPaymentMethod(s, r),
    byCategory: revenueByCategory(s, r),
    byCourse,
    orders: orderSummary(s, r),
  };
}

// ---------------------------------------------------------------- students
function buildStudents(s: AnalyticsSources, r: ResolvedRange, o: ReportOptions) {
  return {
    summary: studentSummary(s, r),
    avgCompletion: avgCompletionKpi(s, r),
    growth: studentGrowthSeries(s, r),
    retention: learnerRetentionSeries(s, r),
    completion: completionBreakdown(s, r),
    byCategory: enrollmentsByCategory(s, r),
    topStudents: topStudents(s, r, o.studentRank, 10),
    studentRank: o.studentRank,
  };
}

// ---------------------------------------------------------------- courses
function buildCourses(s: AnalyticsSources, r: ResolvedRange, o: ReportOptions) {
  return {
    courses: courseSummary(s, r),
    enrollments: enrollmentSummary(s, r).newEnrollments,
    revenue: revenueSummary(s, r).net,
    instructors: instructorSummary(s, r),
    topCourses: topCourses(s, r, "enrollments", s.courses.length),
    byCourse: enrollmentsByCourse(s, r),
    leaderboard: topInstructors(s, r, o.instructorRank, 8),
    instructorRank: o.instructorRank,
  };
}

// ---------------------------------------------------------------- engagement
function buildEngagement(s: AnalyticsSources, r: ResolvedRange) {
  return {
    learning: learningSummary(s, r),
    community: communitySummary(s, r),
    quizSeries: quizActivitySeries(s, r),
    quizzes: quizPerformance(s, r),
    submissionSeries: submissionSeries(s, r),
    assignments: assignmentPerformance(s, r),
    liveSeries: liveAttendanceSeries(s, r).map((p) => ({ ...p, absent: p.seats - p.attended })),
    certificateSeries: certificateSeries(s, r),
    communitySeries: communityActivitySeries(s, r),
  };
}

export type OverviewReport = ReturnType<typeof buildOverview>;
export type RevenueReport = ReturnType<typeof buildRevenue>;
export type StudentsReport = ReturnType<typeof buildStudents>;
export type CoursesReport = ReturnType<typeof buildCourses>;
export type EngagementReport = ReturnType<typeof buildEngagement>;

export type AnalyticsReport =
  | { tab: "overview"; data: OverviewReport }
  | { tab: "revenue"; data: RevenueReport }
  | { tab: "students"; data: StudentsReport }
  | { tab: "courses"; data: CoursesReport }
  | { tab: "engagement"; data: EngagementReport };

/** Data for the active tab only. */
export function buildAnalyticsReport(tab: AnalyticsTab, s: AnalyticsSources, r: ResolvedRange, o: ReportOptions): AnalyticsReport {
  switch (tab) {
    case "revenue":
      return { tab, data: buildRevenue(s, r, o) };
    case "students":
      return { tab, data: buildStudents(s, r, o) };
    case "courses":
      return { tab, data: buildCourses(s, r, o) };
    case "engagement":
      return { tab, data: buildEngagement(s, r) };
    default:
      return { tab: "overview", data: buildOverview(s, r) };
  }
}
