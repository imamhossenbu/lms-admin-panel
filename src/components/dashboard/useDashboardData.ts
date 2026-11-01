"use client";

import { useMemo } from "react";
import {
  comparisonLabel,
  completionBreakdown,
  courseSummary,
  enrollmentsByCourse,
  formatCurrency,
  formatNumber,
  instructorSummary,
  recentEnrollments,
  recentOrders,
  revenueSeries,
  revenueSummary,
  studentGrowthSeries,
  studentSummary,
  topCourses,
  type AnalyticsSources,
  type ResolvedRange,
} from "@/lib/analytics";
import type { DashboardStat } from "./StatCard";

/** Every Dashboard widget's data, derived from the analytics core for one range. */
export function useDashboardData(sources: AnalyticsSources | null, range: ResolvedRange | null) {
  return useMemo(() => {
    if (!sources || !range) return null;
    const caption = comparisonLabel(range);
    const students = studentSummary(sources, range);
    const instructors = instructorSummary(sources, range);
    const courses = courseSummary(sources, range);
    const revenue = revenueSummary(sources, range);

    const stats: DashboardStat[] = [
      { id: "total-students", label: "Total Students", value: formatNumber(students.total.value), kpi: students.total, caption, icon: "users", colorScheme: "orange" },
      { id: "active-instructors", label: "Active Instructors", value: formatNumber(instructors.active.value), kpi: instructors.active, caption, icon: "user", colorScheme: "blue" },
      { id: "published-courses", label: "Published Courses", value: formatNumber(courses.published.value), kpi: courses.published, caption, icon: "book-open", colorScheme: "green" },
      {
        id: "total-revenue",
        label: "Total Revenue",
        value: formatCurrency(revenue.net.value, sources.currency, { decimals: 0 }),
        kpi: revenue.net,
        caption,
        icon: "wallet",
        colorScheme: "purple",
      },
    ];

    return {
      currency: sources.currency,
      stats,
      revenue: revenueSeries(sources, range),
      growth: studentGrowthSeries(sources, range),
      enrollmentsByCourse: enrollmentsByCourse(sources, range).slice(0, 5),
      completion: completionBreakdown(sources, range),
      recentOrders: recentOrders(sources, range, 5),
      recentEnrollments: recentEnrollments(sources, range, 5),
      topCourses: topCourses(sources, range, "revenue", 5),
    };
  }, [sources, range]);
}

export type DashboardData = NonNullable<ReturnType<typeof useDashboardData>>;
