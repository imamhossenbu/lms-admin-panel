"use client";

import React from "react";
import { BookOpen, GraduationCap, UserRound, Wallet } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/analytics";
import { KpiGrid } from "../shared/KpiGrid";
import type { KpiTileData } from "../shared/KpiTile";
import { ChartCard } from "../shared/ChartCard";
import { BreakdownBarChart } from "../shared/BreakdownBarChart";
import { TopCoursesTable } from "./TopCoursesTable";
import { InstructorLeaderboard } from "./InstructorLeaderboard";
import type { CoursesReport, InstructorRankBy } from "../report/analyticsReport";

interface CoursesTabProps {
  data: CoursesReport;
  currency: string;
  caption: string;
  onInstructorRankChange: (by: InstructorRankBy) => void;
}

export function CoursesTab({ data, currency, caption, onInstructorRankChange }: CoursesTabProps) {
  const tiles: KpiTileData[] = [
    { id: "published", label: "Published courses", value: formatNumber(data.courses.published.value), kpi: data.courses.published, icon: BookOpen, tone: "green", caption },
    { id: "enrollments", label: "New enrollments", value: formatNumber(data.enrollments.value), kpi: data.enrollments, icon: GraduationCap, tone: "blue", caption },
    { id: "revenue", label: "Course revenue", value: formatCurrency(data.revenue.value, currency, { decimals: 0 }), kpi: data.revenue, icon: Wallet, tone: "orange", caption },
    { id: "instructors", label: "Active instructors", value: formatNumber(data.instructors.active.value), kpi: data.instructors.active, icon: UserRound, tone: "purple", caption },
  ];

  return (
    <div className="space-y-3">
      <KpiGrid tiles={tiles} />
      <TopCoursesTable rows={data.topCourses} currency={currency} index={1} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <ChartCard title="Enrollments by course" subtitle="New enrollments per course" index={2}>
          <BreakdownBarChart
            rows={data.byCourse}
            format={formatNumber}
            emptyTitle="No enrollments in this period"
            emptyMessage="Paid orders create enrollments; pick a wider date range."
            labelChars={22}
          />
        </ChartCard>
        <InstructorLeaderboard
          rows={data.leaderboard}
          rankBy={data.instructorRank}
          onRankChange={onInstructorRankChange}
          currency={currency}
          index={3}
        />
      </div>
    </div>
  );
}

export default CoursesTab;
