"use client";

import React, { useState } from "react";
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

export default function DashboardOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DASHBOARD_DATA);

  // Smooth period change with skeleton loading transition
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Analytics Updated", {
        description: `Now displaying metrics for ${period}.`,
      });
    }, 450);
  };

  const handleCourseCreated = (course: any) => {
    // Add 1 to published courses in stat cards
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
      className="space-y-6 text-left pb-10"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueOverviewChart data={dashboardData.revenueData} />
        <StudentGrowthChart data={dashboardData.studentGrowthData} />
      </div>

      {/* 4. Row 3: Course Enrollment & Course Completion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseEnrollmentChart data={dashboardData.courseEnrollments} />
        <CourseCompletionChart data={dashboardData.courseCompletion} />
      </div>

      {/* 5. Row 4: Recent Orders & Recent Enrollments Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
