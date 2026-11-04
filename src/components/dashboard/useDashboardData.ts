"use client";

import { useMemo } from "react";
import { comparisonLabel, formatCurrency, formatNumber, type DashboardReport, type ResolvedRange } from "@/lib/analytics";
import type { DashboardStat } from "./StatCard";

/** Every Dashboard widget's data from GET /admin/analytics/dashboard for one period. */
export function useDashboardData(report: DashboardReport | null, range: ResolvedRange | null) {
  return useMemo(() => {
    if (!report || !range) return null;
    const caption = comparisonLabel(range);
    const { kpis } = report;

    const stats: DashboardStat[] = [
      { id: "total-students", label: "Total Students", value: formatNumber(kpis.totalStudents.value), kpi: kpis.totalStudents, caption, icon: "users", colorScheme: "orange" },
      { id: "active-instructors", label: "Active Instructors", value: formatNumber(kpis.activeInstructors.value), kpi: kpis.activeInstructors, caption, icon: "user", colorScheme: "blue" },
      { id: "published-courses", label: "Published Courses", value: formatNumber(kpis.publishedCourses.value), kpi: kpis.publishedCourses, caption, icon: "book-open", colorScheme: "green" },
      {
        id: "total-revenue",
        label: "Total Revenue",
        value: formatCurrency(kpis.totalRevenue.value, report.currency, { decimals: 0 }),
        kpi: kpis.totalRevenue,
        caption,
        icon: "wallet",
        colorScheme: "purple",
      },
    ];

    return {
      currency: report.currency,
      stats,
      revenue: report.revenue,
      growth: report.growth,
      enrollmentsByCourse: report.enrollmentsByCourse,
      completion: report.completion,
      recentOrders: report.recentOrders,
      recentEnrollments: report.recentEnrollments,
      topCourses: report.topCourses,
    };
  }, [report, range]);
}

export type DashboardData = NonNullable<ReturnType<typeof useDashboardData>>;
