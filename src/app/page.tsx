"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  rangeLabel,
  resolveAnalyticsRange,
  useAnalyticsRange,
  useAnalyticsSources,
  type PickerRange,
} from "@/lib/analytics";
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

/** Brief skeleton shown when the reporting period changes. */
const RANGE_SWITCH_MS = 350;

function DashboardOverviewContent() {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const { keys, setKeys, rangeKey } = useAnalyticsRange();
  const sources = useAnalyticsSources();

  const metricParam = get("metric") as RevenueMetric;
  const metric: RevenueMetric = REVENUE_METRICS.includes(metricParam) ? metricParam : "Revenue";

  const range = useMemo(() => (sources ? resolveAnalyticsRange(sources, keys) : null), [sources, keys]);
  const data = useDashboardData(sources, range);
  const label = range ? rangeLabel(range, sources?.now) : "";

  // Skeleton flash whenever the range changes (navbar or in-page picker).
  const [shownKey, setShownKey] = useState(rangeKey);
  const [switching, setSwitching] = useState(false);
  if (shownKey !== rangeKey) {
    setShownKey(rangeKey);
    setSwitching(true);
  }
  useEffect(() => {
    if (!switching) return;
    const timer = setTimeout(() => setSwitching(false), RANGE_SWITCH_MS);
    return () => clearTimeout(timer);
  }, [switching, rangeKey]);

  const handleRangeChange = (next: PickerRange) => {
    setKeys(next);
    toast.success("Dashboard updated", {
      description: `Showing ${formatDateRange(next) || "all time"}.`,
    });
  };

  if (!data || !range || switching) {
    return <DashboardSkeleton />;
  }

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
