"use client";

import React from "react";
import { CheckCircle2, UserCheck, UserPlus, Users } from "lucide-react";
import { CHART } from "@/components/ui/charts/chartTheme";
import { CourseCompletionChart } from "@/components/dashboard/CourseCompletionChart";
import { formatNumber, formatPercent, type StudentRankBy } from "@/lib/analytics";
import { KpiGrid } from "../shared/KpiGrid";
import type { KpiTileData } from "../shared/KpiTile";
import { ChartCard } from "../shared/ChartCard";
import { ChartLegend } from "../shared/ChartLegend";
import { SeriesComboChart } from "../shared/SeriesComboChart";
import { DonutBreakdown } from "../shared/DonutBreakdown";
import { BreakdownBarChart } from "../shared/BreakdownBarChart";
import { SERIES_COLORS } from "../shared/palette";
import { TopStudentsTable } from "./TopStudentsTable";
import type { StudentsReport } from "../report/analyticsReport";

interface StudentsTabProps {
  data: StudentsReport;
  currency: string;
  caption: string;
  onStudentRankChange: (by: StudentRankBy) => void;
}

export function StudentsTab({ data, currency, caption, onStudentRankChange }: StudentsTabProps) {
  const { summary } = data;
  const tiles: KpiTileData[] = [
    { id: "total", label: "Total students", value: formatNumber(summary.total.value), kpi: summary.total, icon: Users, tone: "orange", caption },
    { id: "new", label: "New students", value: formatNumber(summary.newStudents.value), kpi: summary.newStudents, icon: UserPlus, tone: "blue", caption },
    { id: "active", label: "Active learners", value: formatNumber(summary.activeLearners.value), kpi: summary.activeLearners, icon: UserCheck, tone: "green", caption },
    { id: "completion", label: "Avg completion", value: formatPercent(data.avgCompletion.value), kpi: data.avgCompletion, icon: CheckCircle2, tone: "purple", caption },
  ];
  const statusTotal = summary.active + summary.inactive;
  const share = (n: number) => (statusTotal ? Math.round((n / statusTotal) * 1000) / 10 : 0);

  return (
    <div className="space-y-3">
      <KpiGrid tiles={tiles} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <ChartCard
          className="xl:col-span-2"
          index={1}
          title="New students vs active learners"
          subtitle="Sign-ups (bars) and distinct learners with any activity (line)"
          action={
            <ChartLegend
              items={[
                { label: "New students", color: CHART.orange },
                { label: "Active learners", color: CHART.blue, line: true },
              ]}
            />
          }
        >
          <SeriesComboChart
            data={data.growth}
            series={[
              { key: "newStudents", label: "New students", color: CHART.orange, kind: "bar" },
              { key: "activeStudents", label: "Active learners", color: CHART.blue, kind: "line" },
            ]}
            leftFormat={formatNumber}
            emptyTitle="No student activity in this period"
            emptyMessage="New sign-ups and learning activity will appear here."
          />
        </ChartCard>
        <ChartCard title="Active vs inactive" subtitle="Account status of students joined by period end" index={2}>
          <DonutBreakdown
            slices={[
              { key: "active", label: "Active", value: summary.active, share: share(summary.active), color: CHART.green },
              { key: "inactive", label: "Inactive", value: summary.inactive, share: share(summary.inactive), color: CHART.tick },
            ]}
            centerValue={formatNumber(statusTotal)}
            centerLabel="Students"
            format={formatNumber}
            emptyTitle="No students yet"
            emptyMessage="Students joined by the end of this period appear here."
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <ChartCard
          index={3}
          title="Learner retention"
          subtitle="Returning vs newly active learners, and % of the previous bucket's learners who came back"
          toolbar={
            <ChartLegend
              items={[
                { label: "Returning", color: CHART.green },
                { label: "Newly active", color: CHART.yellow },
                { label: "Retention %", color: CHART.purple, line: true },
              ]}
            />
          }
        >
          <SeriesComboChart
            data={data.retention}
            series={[
              { key: "returning", label: "Returning", color: CHART.green, kind: "bar", stackId: "learners" },
              { key: "newActive", label: "Newly active", color: CHART.yellow, kind: "bar", stackId: "learners" },
              { key: "retentionRate", label: "Retention", color: CHART.purple, kind: "line", axis: "right" },
            ]}
            leftFormat={formatNumber}
            rightFormat={(v) => formatPercent(v, 0)}
            rightDomain={[0, 100]}
            emptyTitle="No learner activity in this period"
            emptyMessage="Retention appears once learners are active."
          />
        </ChartCard>
        <CourseCompletionChart data={data.completion} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <ChartCard title="Enrollments by category" subtitle="New enrollments per course category" index={4}>
          <BreakdownBarChart
            rows={data.byCategory}
            format={formatNumber}
            colors={SERIES_COLORS}
            emptyTitle="No enrollments in this period"
            emptyMessage="Paid orders create enrollments; pick a wider date range."
            labelChars={14}
          />
        </ChartCard>
        <TopStudentsTable
          className="xl:col-span-2"
          index={5}
          rows={data.topStudents}
          rankBy={data.studentRank}
          onRankChange={onStudentRankChange}
          currency={currency}
        />
      </div>
    </div>
  );
}

export default StudentsTab;
