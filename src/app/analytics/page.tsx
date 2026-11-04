"use client";

import React, { Suspense, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  comparisonLabel,
  rangeLabel,
  useAnalyticsRange,
  useAnalyticsReport,
  type Granularity,
  type PickerRange,
  type StudentRankBy,
} from "@/lib/analytics";
import { useFeatureAccess } from "@/lib/planAccess";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { useUrlParams } from "@/lib/useUrlParams";
import { formatDateRange } from "@/components/ui/date-range/dateRangeUtils";
import { PillTabs } from "@/components/ui/PillTabs";
import { UpgradeLockCard } from "@/components/plan-gate/UpgradeLockCard";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { ANALYTICS_TAB_ITEMS, parseAnalyticsTab } from "@/components/analytics/report/analyticsTabs";
import type { AnalyticsReport, AnalyticsTab, InstructorRankBy } from "@/components/analytics/report/analyticsReport";
import { buildReportCsv, downloadCsv, reportFileName } from "@/components/analytics/report/analyticsExport";
import { OverviewTab } from "@/components/analytics/overview/OverviewTab";
import { RevenueTab } from "@/components/analytics/revenue/RevenueTab";
import { StudentsTab } from "@/components/analytics/students/StudentsTab";
import { CoursesTab } from "@/components/analytics/courses/CoursesTab";
import { EngagementTab } from "@/components/analytics/engagement/EngagementTab";

function AnalyticsContent() {
  const { get, set } = useUrlParams();
  const { keys, setKeys } = useAnalyticsRange();
  const tab = parseAnalyticsTab(get("tab"));

  // Overview is on every plan; the other tabs need "Advanced analytics" (the API answers 403 otherwise).
  const access = useFeatureAccess("advancedAnalytics");
  const gated = tab !== "overview";
  const enabled = !gated || (access.ready && access.allowed);

  const params = useMemo(
    () => ({
      from: keys.from,
      to: keys.to,
      ...(tab === "revenue" ? { granularity: get("granularity") || undefined } : {}),
      ...(tab === "students" ? { studentRank: get("studentRank") || undefined } : {}),
      ...(tab === "courses" ? { instructorRank: get("instructorRank") || undefined } : {}),
    }),
    [keys.from, keys.to, tab, get]
  );
  const { report: data, range, error } = useAnalyticsReport(tab, params, enabled);
  const report = useMemo(() => (data ? ({ tab, data } as AnalyticsReport) : null), [tab, data]);

  const label = range ? rangeLabel(range) : "";
  const caption = range ? comparisonLabel(range) : "";
  const currency = data?.currency ?? "BDT";

  const handleRangeChange = (next: PickerRange) => {
    setKeys(next);
    toast.success("Analytics updated", { description: `Showing ${formatDateRange(next) || "all time"}.` });
  };

  const handleTabChange = (next: AnalyticsTab) => set({ tab: next === "overview" ? null : next });

  const handleExport = () => {
    if (!report || !range) return;
    const tabLabel = ANALYTICS_TAB_ITEMS.find((t) => t.id === tab)?.label ?? "Report";
    const toastId = toast.loading("Preparing export…", { description: `${tabLabel} report · ${label}` });
    try {
      const fileName = reportFileName(tab, range);
      downloadCsv(fileName, buildReportCsv(report, { currency, rangeLabel: label, range }));
      toast.success("Report exported", { id: toastId, description: `${fileName} has been downloaded.` });
    } catch {
      toast.error("Export failed", { id: toastId, description: "We couldn't create the CSV file. Please try again." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 text-left pb-6"
    >
      <AnalyticsHeader range={keys} rangeLabel={label} comparison={caption} onRangeChange={handleRangeChange} onExport={handleExport} />

      <PillTabs tabs={ANALYTICS_TAB_ITEMS} activeId={tab} onChange={handleTabChange} ariaLabel="Analytics reports" idPrefix="analytics" />

      {gated && access.ready && !access.allowed ? (
        <UpgradeLockCard feature="advancedAnalytics" />
      ) : error ? (
        <DashboardError title="Couldn't load this report" message={error.message} />
      ) : !report || !range ? (
        <AnalyticsSkeleton tab={tab} withHeader={false} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            id={`analytics-panel-${tab}`}
            aria-labelledby={`analytics-tab-${tab}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {report.tab === "overview" && <OverviewTab data={report.data} currency={currency} caption={caption} />}
            {report.tab === "revenue" && (
              <RevenueTab data={report.data} currency={currency} caption={caption} onGranularityChange={(g: Granularity) => set({ granularity: g })} />
            )}
            {report.tab === "students" && (
              <StudentsTab
                data={report.data}
                currency={currency}
                caption={caption}
                onStudentRankChange={(by: StudentRankBy) => set({ studentRank: by === "completion" ? null : by })}
              />
            )}
            {report.tab === "courses" && (
              <CoursesTab
                data={report.data}
                currency={currency}
                caption={caption}
                onInstructorRankChange={(by: InstructorRankBy) => set({ instructorRank: by === "revenue" ? null : by })}
              />
            )}
            {report.tab === "engagement" && <EngagementTab data={report.data} />}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}
