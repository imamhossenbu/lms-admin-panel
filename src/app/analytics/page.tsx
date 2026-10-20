import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StudentEngagementChart } from "@/components/analytics/StudentEngagementChart";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { OverviewStats } from "@/components/dashboard/OverviewStats";

export default function AnalyticsDashboardPage() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}
