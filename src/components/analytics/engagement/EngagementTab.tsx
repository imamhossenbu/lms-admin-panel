"use client";

import React from "react";
import { Award, ClipboardCheck, FileQuestion, MessagesSquare, Video } from "lucide-react";
import { CHART } from "@/components/ui/charts/chartTheme";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatNumber, formatPercent } from "@/lib/analytics";
import { SeriesComboChart } from "../shared/SeriesComboChart";
import { EngagementAreaCard } from "./EngagementAreaCard";
import { QuizPerformanceTable } from "./QuizPerformanceTable";
import { AssignmentPerformanceTable } from "./AssignmentPerformanceTable";
import type { EngagementReport } from "../report/analyticsReport";

const pct0 = (v: number) => formatPercent(v, 0);

export function EngagementTab({ data }: { data: EngagementReport }) {
  const { learning: L, community: C } = data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <EngagementAreaCard
          index={0}
          title="Quizzes"
          subtitle="Attempts by result"
          icon={FileQuestion}
          iconClassName="bg-blue-14 text-blue"
          href="/quizzes"
          linkLabel="View quizzes"
          stats={[
            { label: "Attempts", value: formatNumber(L.quizAttempts.value), kpi: L.quizAttempts },
            { label: "Avg score", value: formatPercent(L.avgQuizScore.value), kpi: L.avgQuizScore },
            { label: "Pass rate", value: formatPercent(L.quizPassRate.value), kpi: L.quizPassRate },
          ]}
          legend={[
            { label: "Passed", color: CHART.green },
            { label: "Failed", color: CHART.red },
            { label: "Unfinished", color: CHART.tick },
          ]}
        >
          <SeriesComboChart
            data={data.quizSeries}
            heightClassName="h-56"
            series={[
              { key: "passed", label: "Passed", color: CHART.green, kind: "bar", stackId: "quiz" },
              { key: "failed", label: "Failed", color: CHART.red, kind: "bar", stackId: "quiz" },
              { key: "unfinished", label: "Unfinished", color: CHART.tick, kind: "bar", stackId: "quiz" },
            ]}
            leftFormat={formatNumber}
            emptyTitle="No quiz attempts in this period"
            emptyMessage="Attempts appear as students take quizzes."
          />
        </EngagementAreaCard>

        <EngagementAreaCard
          index={1}
          title="Assignments"
          subtitle="Submissions on time vs late"
          icon={ClipboardCheck}
          iconClassName="bg-purple-14 text-purple"
          href="/assignments"
          linkLabel="View assignments"
          stats={[
            { label: "Submissions", value: formatNumber(L.submissions.value), kpi: L.submissions },
            { label: "On time", value: formatPercent(L.onTimeRate.value), kpi: L.onTimeRate },
          ]}
          legend={[
            { label: "On time", color: CHART.green },
            { label: "Late", color: CHART.yellow },
          ]}
        >
          <SeriesComboChart
            data={data.submissionSeries}
            heightClassName="h-56"
            series={[
              { key: "onTime", label: "On time", color: CHART.green, kind: "bar", stackId: "subs" },
              { key: "late", label: "Late", color: CHART.yellow, kind: "bar", stackId: "subs" },
            ]}
            leftFormat={formatNumber}
            emptyTitle="No submissions in this period"
            emptyMessage="Assignment submissions will appear here."
          />
        </EngagementAreaCard>

        <EngagementAreaCard
          index={2}
          title="Live classes"
          subtitle="Seats attended per held session"
          icon={Video}
          iconClassName="bg-red-14 text-red"
          href="/live-classes"
          linkLabel="View live classes"
          stats={[
            { label: "Sessions held", value: formatNumber(L.liveSessions.value), kpi: L.liveSessions },
            { label: "Attendance", value: formatPercent(L.attendanceRate.value), kpi: L.attendanceRate },
          ]}
          legend={[
            { label: "Attended", color: CHART.blue },
            { label: "Missed", color: CHART.tick },
            { label: "Attendance %", color: CHART.orange, line: true },
          ]}
        >
          <SeriesComboChart
            data={data.liveSeries}
            heightClassName="h-56"
            series={[
              { key: "attended", label: "Attended", color: CHART.blue, kind: "bar", stackId: "seats" },
              { key: "absent", label: "Missed", color: CHART.tick, kind: "bar", stackId: "seats" },
              { key: "attendanceRate", label: "Attendance", color: CHART.orange, kind: "line", axis: "right" },
            ]}
            leftFormat={formatNumber}
            rightFormat={pct0}
            rightDomain={[0, 100]}
            emptyTitle="No live sessions held in this period"
            emptyMessage="Finished live classes and their attendance appear here."
          />
        </EngagementAreaCard>

        <EngagementAreaCard
          index={3}
          title="Certificates"
          subtitle="Certificates issued"
          icon={Award}
          iconClassName="bg-yellow-bg text-yellow"
          href="/certificates"
          linkLabel="View certificates"
          stats={[
            { label: "Issued", value: formatNumber(L.certificatesIssued.value), kpi: L.certificatesIssued },
            { label: "Quiz pass rate", value: formatPercent(L.quizPassRate.value), kpi: L.quizPassRate },
          ]}
          legend={[{ label: "Certificates issued", color: CHART.yellow }]}
        >
          <SeriesComboChart
            data={data.certificateSeries}
            heightClassName="h-56"
            series={[{ key: "value", label: "Issued", color: CHART.yellow, kind: "bar" }]}
            leftFormat={formatNumber}
            emptyTitle="No certificates issued in this period"
            emptyMessage="Certificates appear as students complete courses."
          />
        </EngagementAreaCard>

        <EngagementAreaCard
          className="xl:col-span-2"
          index={4}
          title="Community"
          subtitle="Discussion activity and moderation"
          icon={MessagesSquare}
          iconClassName="bg-green-bg text-green"
          href="/community"
          linkLabel="View community"
          stats={[
            { label: "Threads", value: formatNumber(C.threads.value), kpi: C.threads },
            { label: "Replies", value: formatNumber(C.replies.value), kpi: C.replies },
            {
              label: "Reports",
              value: formatNumber(C.reports.value),
              extra: (
                <ToneBadge tone={C.openReports > 0 ? "red" : "green"} size="sm" variant="pill" dot>
                  {C.openReports} open
                </ToneBadge>
              ),
            },
          ]}
          legend={[
            { label: "Threads", color: CHART.green },
            { label: "Replies", color: CHART.blue },
            { label: "Reports", color: CHART.red },
          ]}
        >
          <SeriesComboChart
            data={data.communitySeries}
            heightClassName="h-56"
            series={[
              { key: "threads", label: "Threads", color: CHART.green, kind: "bar" },
              { key: "replies", label: "Replies", color: CHART.blue, kind: "bar" },
              { key: "reports", label: "Reports", color: CHART.red, kind: "bar" },
            ]}
            leftFormat={formatNumber}
            emptyTitle="No community activity in this period"
            emptyMessage="Threads, replies and reports appear here."
          />
        </EngagementAreaCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <QuizPerformanceTable rows={data.quizzes} index={5} />
        <AssignmentPerformanceTable rows={data.assignments} index={6} />
      </div>
    </div>
  );
}

export default EngagementTab;
