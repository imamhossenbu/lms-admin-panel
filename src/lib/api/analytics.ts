import { apiClient } from "@/lib/api";
import type {
  CoursesReport,
  DashboardReport,
  EngagementReport,
  OverviewReport,
  RangeMeta,
  ResolvedRange,
  RevenueReport,
  StudentsReport,
} from "@/lib/analytics/analyticsTypes";

export interface AnalyticsReports {
  dashboard: DashboardReport;
  overview: OverviewReport;
  revenue: RevenueReport;
  students: StudentsReport;
  courses: CoursesReport;
  engagement: EngagementReport;
}
export type AnalyticsEndpoint = keyof AnalyticsReports;

export interface AnalyticsParams {
  /** Reporting period (picker keys, inclusive, workspace-local); both omitted = All time. */
  from?: string;
  to?: string;
  granularity?: string;
  studentRank?: string;
  instructorRank?: string;
}

/** Analytics reports (GET /admin/analytics/:endpoint). Non-overview tabs need the "Advanced analytics" plan feature. */
export const analyticsApi = {
  get: async <E extends AnalyticsEndpoint>(endpoint: E, params: AnalyticsParams) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));
    return (await apiClient.get<AnalyticsReports[E]>(`/admin/analytics/${endpoint}`, { params: clean })).data;
  },
};

/** The API's range meta → the panel's ResolvedRange (labels, comparison caption, export file names). */
export const toResolvedRange = (m: RangeMeta): ResolvedRange => ({
  from: new Date(m.from),
  to: new Date(m.to),
  ...(m.fromKey ? { fromKey: m.fromKey } : {}),
  ...(m.toKey ? { toKey: m.toKey } : {}),
  isAllTime: m.isAllTime,
  days: m.days,
});
