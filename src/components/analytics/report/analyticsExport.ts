/**
 * Analytics page: CSV export of the active tab (its KPIs, series and tables), built from the same
 * report object the tab renders. Sections are separated by a blank line and start with a title row.
 */

import { dateKey, type Kpi, type ResolvedRange, type TimeBucket } from "@/lib/analytics";
import type { AnalyticsReport, AnalyticsTab } from "./analyticsReport";

type Cell = string | number | null | undefined;
interface Section {
  title: string;
  header: string[];
  rows: Cell[][];
}

const esc = (v: Cell) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const kpiRows = (entries: [string, Kpi][]): Cell[][] =>
  entries.map(([label, k]) => [label, k.value, k.previous, k.changePct === null ? "" : k.changePct]);
const KPI_HEADER = ["Metric", "Value", "Previous period", "Change %"];

function seriesSection<T extends TimeBucket>(title: string, data: T[], cols: [string, keyof T][]): Section {
  return {
    title,
    header: ["Period", ...cols.map(([h]) => h)],
    rows: data.map((p) => [p.fullLabel, ...cols.map(([, k]) => p[k] as unknown as Cell)]),
  };
}

function sectionsFor(report: AnalyticsReport, currency: string): Section[] {
  const money = (h: string) => `${h} (${currency})`;
  switch (report.tab) {
    case "overview": {
      const { kpis, combo, highlights } = report.data;
      return [
        {
          title: "Key metrics",
          header: KPI_HEADER,
          rows: kpiRows([
            [money("Net revenue"), kpis.netRevenue],
            ["Orders", kpis.orders],
            ["Conversion %", kpis.conversion],
            ["New enrollments", kpis.newEnrollments],
            ["Active learners", kpis.activeLearners],
            ["Avg completion %", kpis.avgCompletion],
            ["Certificates issued", kpis.certificates],
            ["Quiz pass rate %", kpis.quizPassRate],
          ]),
        },
        seriesSection("Revenue vs enrollments", combo, [[money("Net revenue"), "net"], ["Enrollments", "enrollments"]]),
        {
          title: "Highlights",
          header: ["Highlight", "Value"],
          rows: [
            ["Best course", highlights.bestCourse ? `${highlights.bestCourse.title} (${highlights.bestCourse.revenue})` : ""],
            ["Best day", highlights.bestDay ? `${highlights.bestDay.fullLabel} (${highlights.bestDay.net})` : ""],
            ["Biggest change", highlights.biggestChange ? `${highlights.biggestChange.label} (${highlights.biggestChange.kpi.changePct}%)` : ""],
          ],
        },
      ];
    }
    case "revenue": {
      const d = report.data;
      return [
        {
          title: "Revenue summary",
          header: KPI_HEADER,
          rows: kpiRows([
            [money("Gross revenue"), d.summary.gross],
            [money("Net revenue"), d.summary.net],
            [money("Refunds"), d.summary.refunds],
            [money("Avg order value"), d.summary.avgOrderValue],
            ["Paid orders", d.summary.paidOrders],
          ]),
        },
        seriesSection(`Revenue by ${d.granularity}`, d.series, [
          [money("Gross"), "gross"],
          [money("Net"), "net"],
          [money("Refunds"), "refunds"],
          ["Orders placed", "orders"],
          ["Paid orders", "paidOrders"],
        ]),
        { title: "Revenue by payment method", header: ["Method", money("Revenue"), "Orders", "Share %"], rows: d.byMethod.map((r) => [r.label, r.value, r.count, r.share]) },
        { title: "Revenue by category", header: ["Category", money("Revenue"), "Course sales", "Share %"], rows: d.byCategory.map((r) => [r.label, r.value, r.count, r.share]) },
        {
          title: "Revenue by course",
          header: ["Course", "Orders", money("Revenue"), "Share %", "Change %"],
          rows: d.byCourse.map((r) => [r.label, r.count, r.value, r.share, r.changePct ?? ""]),
        },
        { title: "Orders by status", header: ["Status", "Orders"], rows: Object.entries(d.orders.byStatus) },
      ];
    }
    case "students": {
      const d = report.data;
      return [
        {
          title: "Student summary",
          header: KPI_HEADER,
          rows: kpiRows([
            ["Total students", d.summary.total],
            ["New students", d.summary.newStudents],
            ["Active learners", d.summary.activeLearners],
            ["Avg completion %", d.avgCompletion],
          ]),
        },
        seriesSection("New vs active students", d.growth, [["New students", "newStudents"], ["Active learners", "activeStudents"]]),
        seriesSection("Learner retention", d.retention, [["Active", "active"], ["Returning", "returning"], ["Newly active", "newActive"], ["Retention %", "retentionRate"]]),
        { title: "Course completion", header: ["Segment", "Seats", "Share %"], rows: d.completion.segments.map((s) => [s.label, s.count, s.pct]) },
        { title: "Enrollments by category", header: ["Category", "Enrollments", "Share %"], rows: d.byCategory.map((r) => [r.label, r.value, r.share]) },
        {
          title: "Top students",
          header: ["Student", "Email", "Enrolled", "Completed", "Avg score %", "Completion %", money("Spent")],
          rows: d.topStudents.map((s) => [s.name, s.email, s.enrolled, s.completed, s.avgScore, s.completionRate, s.spent]),
        },
      ];
    }
    case "courses": {
      const d = report.data;
      return [
        {
          title: "Course summary",
          header: KPI_HEADER,
          rows: kpiRows([
            ["Published courses", d.courses.published],
            ["New enrollments", d.enrollments],
            [money("Course revenue"), d.revenue],
            ["Active instructors", d.instructors.active],
          ]),
        },
        {
          title: "Top courses",
          header: ["Course", "Instructor", "Category", "Enrollments", money("Revenue"), "Completion %", "Rating"],
          rows: d.topCourses.map((c) => [c.title, c.instructor, c.category, c.enrollments, c.revenue, c.completionPct ?? "", c.rating ?? ""]),
        },
        {
          title: `Instructor leaderboard (by ${d.instructorRank})`,
          header: ["Instructor", "Courses", "Enrollments", money("Revenue"), "Rating"],
          rows: d.leaderboard.map((i) => [i.name, i.courses, i.enrollments, i.revenue, i.rating ?? ""]),
        },
      ];
    }
    case "engagement": {
      const d = report.data;
      return [
        {
          title: "Engagement summary",
          header: KPI_HEADER,
          rows: kpiRows([
            ["Quiz attempts", d.learning.quizAttempts],
            ["Avg quiz score %", d.learning.avgQuizScore],
            ["Quiz pass rate %", d.learning.quizPassRate],
            ["Assignment submissions", d.learning.submissions],
            ["On-time submissions %", d.learning.onTimeRate],
            ["Live sessions", d.learning.liveSessions],
            ["Live attendance %", d.learning.attendanceRate],
            ["Certificates issued", d.learning.certificatesIssued],
            ["Community threads", d.community.threads],
            ["Community replies", d.community.replies],
            ["Community reports", d.community.reports],
          ]),
        },
        seriesSection("Quiz attempts", d.quizSeries, [["Attempts", "attempts"], ["Passed", "passed"], ["Failed", "failed"], ["Unfinished", "unfinished"]]),
        seriesSection("Assignment submissions", d.submissionSeries, [["Submissions", "total"], ["On time", "onTime"], ["Late", "late"]]),
        seriesSection("Live classes", d.liveSeries, [["Sessions", "sessions"], ["Seats", "seats"], ["Attended", "attended"], ["Attendance %", "attendanceRate"]]),
        seriesSection("Certificates issued", d.certificateSeries, [["Certificates", "value"]]),
        seriesSection("Community activity", d.communitySeries, [["Threads", "threads"], ["Replies", "replies"], ["Reports", "reports"]]),
        {
          title: "Quiz performance",
          header: ["Quiz", "Attempts", "Finished", "Avg score %", "Pass rate %"],
          rows: d.quizzes.map((q) => [q.title, q.attempts, q.finished, q.avgScore, q.passRate]),
        },
        {
          title: "Assignment performance",
          header: ["Assignment", "Submissions", "Late", "On time %", "Graded", "Avg grade %"],
          rows: d.assignments.map((a) => [a.title, a.submissions, a.late, a.onTimeRate, a.graded, a.avgScore ?? ""]),
        },
      ];
    }
  }
}

/** CSV text for the report (UTF-8, CRLF). */
export function buildReportCsv(report: AnalyticsReport, ctx: { currency: string; rangeLabel: string; range: ResolvedRange }): string {
  const meta: Cell[][] = [
    ["EduPro analytics report", report.tab],
    ["Period", `${ctx.rangeLabel} (${dateKey(ctx.range.from)} to ${dateKey(ctx.range.to)})`],
    ["Generated", new Date().toISOString()],
  ];
  const lines = meta.map((r) => r.map(esc).join(","));
  sectionsFor(report, ctx.currency).forEach((s) => {
    lines.push("", esc(s.title), s.header.map(esc).join(","), ...s.rows.map((r) => r.map(esc).join(",")));
  });
  return lines.join("\r\n");
}

export const reportFileName = (tab: AnalyticsTab, range: ResolvedRange) => `edupro-${tab}-${dateKey(range.from)}-${dateKey(range.to)}.csv`;

/** Triggers a browser download of `csv`. */
export function downloadCsv(fileName: string, csv: string) {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
