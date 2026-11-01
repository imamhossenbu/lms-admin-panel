/**
 * Analytics core: shared types.
 *
 * Every number on the Dashboard (and the upcoming /analytics reports page) is derived by the pure
 * functions in `analyticsMetrics.ts` from an `AnalyticsSources` snapshot (`analyticsSources.ts`),
 * filtered by a resolved `DateRange`. Nothing here is hard-coded.
 *
 * - `DateRange`      Absolute, inclusive window (`from` = 00:00 of the first day, `to` = 23:59:59.999 of the last).
 * - `Granularity`    Bucket size of a time series. `autoGranularity(range)` picks one for you.
 * - `Kpi`            A value for the range + the same metric for the equally long window right before it.
 *                    `changePct` is null when the previous value is 0 (no meaningful % change).
 * - `TimeBucket`     One x-axis slot of a series (`label` is ready for chart ticks).
 * - `BreakdownRow`   Generic "label / value / share" row for donut legends, bar lists and tables.
 */

import type { OrderStatus } from "@/types/order";

export interface DateRange {
  from: Date;
  to: Date;
}

/** A DateRange plus how it was chosen (from the shared picker). */
export interface ResolvedRange extends DateRange {
  /** Picker keys ("YYYY-MM-DD") that produced this range; empty = All time. */
  fromKey?: string;
  toKey?: string;
  /** True when the picker is on "All time" (from = first data day, no previous-period comparison). */
  isAllTime: boolean;
  /** Whole days in the window. */
  days: number;
}

export type Granularity = "day" | "week" | "month";

export interface Kpi {
  value: number;
  /** Same metric for the window of equal length immediately before the range. */
  previous: number;
  /** (value − previous) / previous × 100, rounded to 1 dp; null when previous is 0 or the range is All time. */
  changePct: number | null;
  /** Ten evenly spaced points across the range (per-segment totals, or end-of-segment levels for stock metrics). */
  spark: number[];
}

export interface TimeBucket {
  /** Stable key, e.g. "2026-10-05". */
  key: string;
  /** Tick label, e.g. "Oct 05" (day/week) or "Oct 2026" (month). */
  label: string;
  /** Tooltip label, e.g. "Oct 05, 2026" or "Oct 05 – Oct 11, 2026". */
  fullLabel: string;
  start: Date;
  /** Exclusive end. */
  end: Date;
}

export interface RevenuePoint extends TimeBucket {
  /** Paid + later-refunded order amounts by payment date. */
  gross: number;
  /** Amounts of orders that are still Paid (gross − refunds); matches Orders/Payments "Total Revenue". */
  net: number;
  refunds: number;
  /** Orders placed (any status) by created date. */
  orders: number;
  /** Orders paid (still Paid) by payment date. */
  paidOrders: number;
}

export interface CountPoint extends TimeBucket {
  value: number;
}

export interface StudentGrowthPoint extends TimeBucket {
  /** Students whose join date falls in the bucket. */
  newStudents: number;
  /** Distinct learners with any activity (purchase, quiz, assignment, live class, community) in the bucket. */
  activeStudents: number;
}

export interface BreakdownRow {
  key: string;
  label: string;
  value: number;
  /** Supporting count (e.g. orders behind a revenue value). */
  count: number;
  /** value / Σ value × 100 (0–100, 1 dp). */
  share: number;
}

export interface CourseRow {
  courseId: string;
  title: string;
  instructor: string;
  category: string;
  thumbnailUrl: string;
  price: number;
  /** New enrollments (paid orders containing the course) in the range. */
  enrollments: number;
  /** Net revenue attributed to the course in the range (bundles split by list price). */
  revenue: number;
  /** Avg progress of students' matching enrollment records; null when no record exists. */
  completionPct: number | null;
  /** Rating from the instructor's course record with the same title; null when unknown. */
  rating: number | null;
}

export interface InstructorRow {
  /** Instructor store id, or the name when the instructor isn't in the store. */
  id: string;
  name: string;
  avatarUrl?: string;
  courses: number;
  enrollments: number;
  revenue: number;
  rating: number | null;
}

export interface RecentOrderRow {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  course: string;
  amount: number;
  status: OrderStatus;
  /** ISO created date. */
  date: string;
}

export interface RecentEnrollmentRow {
  /** `${orderId}:${courseId}` */
  id: string;
  orderId: string;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  courseId: string;
  course: string;
  /** 0–100: the student's record for this course, else the student's overall completion rate. */
  progress: number;
  /** ISO enrollment (payment) date. */
  enrolledAt: string;
}

export interface CompletionSegment {
  key: "completed" | "inProgress" | "stalled";
  label: string;
  count: number;
  /** Share of all course enrollments (0–100, integer). */
  pct: number;
}

export interface CompletionBreakdown {
  /** completed / enrolled course seats × 100 (integer). */
  completionRate: number;
  enrolled: number;
  segments: CompletionSegment[];
}
