"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StudentEngagementChart } from "@/components/analytics/StudentEngagementChart";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { OverviewStats } from "@/components/dashboard/OverviewStats";

export default function AnalyticsDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      <PageHeader
        title="Predictive & Platform Analytics"
        description="Course completion velocities, student retention rates, and revenue trends."
        badge={<ToneBadge tone="primary">Real-time Stream</ToneBadge>}
      />

      <OverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <StudentEngagementChart />
      </div>
    </motion.div>
  );
}
