"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCardsGrid } from "@/components/dashboard/StatCardsGrid";
import { RevenueOverviewChart } from "@/components/dashboard/RevenueOverviewChart";
import { StudentGrowthChart } from "@/components/dashboard/StudentGrowthChart";
import { CourseEnrollmentChart } from "@/components/dashboard/CourseEnrollmentChart";
import { CourseCompletionChart } from "@/components/dashboard/CourseCompletionChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { RecentEnrollmentsTable } from "@/components/dashboard/RecentEnrollmentsTable";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { CreateCourseModal } from "@/components/dashboard/CreateCourseModal";
import { toast } from "sonner";

function DashboardOverviewContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPeriod = searchParams.get("period");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    if (urlPeriod) return urlPeriod;
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("edupro_dashboard_period");
      if (saved) return saved;
    }
    return "Last 30 days";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DASHBOARD_DATA);

  // Sync state if URL changes externally
  useEffect(() => {
    if (urlPeriod && urlPeriod !== selectedPeriod) {
      setSelectedPeriod(urlPeriod);
    }
  }, [urlPeriod, selectedPeriod]);

  // Smooth period change with URL sync and skeleton loading transition
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("edupro_dashboard_period", period);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Analytics Updated", {
        description: `Now displaying metrics for ${period}.`,
      });
    }, 450);
  };

  const handleCourseCreated = (course: any) => {
    setDashboardData((prev) => ({
      ...prev,
      stats: prev.stats.map((s) =>
        s.id === "published-courses"
          ? { ...s, value: `${parseInt(s.value, 10) + 1}` }
          : s
      ),
    }));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-[12px] text-left pb-6"
    >
      {/* 1. Header with Period Selector and Action CTA */}
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onCreateCourse={() => setIsCreateCourseOpen(true)}
      />

      {/* 2. Row 1: 4 KPI Stat Metric Cards */}
      <StatCardsGrid stats={dashboardData.stats} />

      {/* 3. Row 2: Revenue Overview & Student Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <RevenueOverviewChart data={dashboardData.revenueData} />
        <StudentGrowthChart data={dashboardData.studentGrowthData} />
      </div>

      {/* 4. Row 3: Course Enrollment & Course Completion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <CourseEnrollmentChart data={dashboardData.courseEnrollments} />
        <CourseCompletionChart data={dashboardData.courseCompletion} />
      </div>

      {/* 5. Row 4: Recent Orders & Recent Enrollments Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <RecentOrdersTable orders={dashboardData.recentOrders} />
        <RecentEnrollmentsTable
          enrollments={dashboardData.recentEnrollments}
        />
      </div>

      {/* 6. Create Course Interactive Modal */}
      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
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
