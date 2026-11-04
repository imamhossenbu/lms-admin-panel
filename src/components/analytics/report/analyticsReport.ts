/**
 * Analytics › report tabs. Each tab's data comes from GET /admin/analytics/:tab (lib/api/analytics); the same
 * object feeds the tab UI and the CSV export.
 */
import type { CoursesReport, EngagementReport, OverviewReport, RevenueReport, StudentsReport } from "@/lib/analytics";

export type { CoursesReport, EngagementReport, InstructorRankBy, OverviewReport, RevenueCourseRow, RevenueReport, StudentsReport } from "@/lib/analytics";

export type AnalyticsTab = "overview" | "revenue" | "students" | "courses" | "engagement";
export const ANALYTICS_TABS: AnalyticsTab[] = ["overview", "revenue", "students", "courses", "engagement"];

export type AnalyticsReport =
  | { tab: "overview"; data: OverviewReport }
  | { tab: "revenue"; data: RevenueReport }
  | { tab: "students"; data: StudentsReport }
  | { tab: "courses"; data: CoursesReport }
  | { tab: "engagement"; data: EngagementReport };
