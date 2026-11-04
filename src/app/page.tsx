"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { rangeLabel, useAnalyticsRange, useAnalyticsReport, type PickerRange } from "@/lib/analytics";
import { useUrlParams } from "@/lib/useUrlParams";
import { formatDateRange } from "@/components/ui/date-range/dateRangeUtils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCardsGrid } from "@/components/dashboard/StatCardsGrid";
import { RevenueOverviewChart, REVENUE_METRICS, type RevenueMetric } from "@/components/dashboard/RevenueOverviewChart";
import { StudentGrowthChart } from "@/components/dashboard/StudentGrowthChart";
import { CourseEnrollmentChart } from "@/components/dashboard/CourseEnrollmentChart";
import { CourseCompletionChart } from "@/components/dashboard/CourseCompletionChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { RecentEnrollmentsTable } from "@/components/dashboard/RecentEnrollmentsTable";
import { TopCoursesCard } from "@/components/dashboard/TopCoursesCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { DashboardError } from "@/components/dashboard/DashboardError";

function DashboardOverviewContent() {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const { keys, setKeys } = useAnalyticsRange();
  const { report, range, error } = useAnalyticsReport("dashboard", { from: keys.from, to: keys.to });

  const metricParam = get("metric") as RevenueMetric;
  const metric: RevenueMetric = REVENUE_METRICS.includes(metricParam) ? metricParam : "Revenue";

  const data = useDashboardData(report, range);
  const label = range ? rangeLabel(range) : "";

  const handleRangeChange = (next: PickerRange) => {
    setKeys(next);
    toast.success("Dashboard updated", {
      description: `Showing ${formatDateRange(next) || "all time"}.`,
    });
  };

  if (error) return <DashboardError message={error.message} />;
  if (!data || !range) return <DashboardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 text-left pb-6"
    >
      {/* 1. Header with shared period picker and Create Course */}
      <DashboardHeader
        range={keys}
        rangeLabel={label}
        onRangeChange={handleRangeChange}
        onCreateCourse={() => router.push("/courses/create")}
      />

      {/* 2. Row 1: 4 KPI cards (value, previous-period change, sparkline) */}
      <StatCardsGrid stats={data.stats} />

      {/* 3. Row 2: Revenue Overview & Student Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RevenueOverviewChart
          data={data.revenue}
          currency={data.currency}
          metric={metric}
          onMetricChange={(m) => set({ metric: m === "Revenue" ? null : m })}
        />
        <StudentGrowthChart data={data.growth} />
      </div>

      {/* 4. Row 3: Course Enrollment & Course Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <CourseEnrollmentChart data={data.enrollmentsByCourse} />
        <CourseCompletionChart data={data.completion} />
      </div>

      {/* 5. Row 4: Recent Orders & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RecentOrdersTable orders={data.recentOrders} currency={data.currency} />
        <RecentEnrollmentsTable enrollments={data.recentEnrollments} />
      </div>

      {/* 6. Row 5: Top Courses */}
      <TopCoursesCard courses={data.topCourses} currency={data.currency} />
    </motion.div>
  );
}

export default function DashboardOverviewPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverviewContent />
    </Suspense>
  );
}
