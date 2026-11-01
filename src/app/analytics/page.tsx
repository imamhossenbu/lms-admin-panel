"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  comparisonLabel,
  rangeLabel,
  resolveAnalyticsRange,
  useAnalyticsRange,
  useAnalyticsSources,
  type Granularity,
  type PickerRange,
  type StudentRankBy,
} from "@/lib/analytics";
import { useUrlParams } from "@/lib/useUrlParams";
import { formatDateRange } from "@/components/ui/date-range/dateRangeUtils";
import { PillTabs } from "@/components/ui/PillTabs";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { ANALYTICS_TAB_ITEMS, parseAnalyticsTab } from "@/components/analytics/report/analyticsTabs";
import { buildAnalyticsReport, resolveReportOptions, type AnalyticsTab, type InstructorRankBy } from "@/components/analytics/report/analyticsReport";
import { buildReportCsv, downloadCsv, reportFileName } from "@/components/analytics/report/analyticsExport";
import { OverviewTab } from "@/components/analytics/overview/OverviewTab";
import { RevenueTab } from "@/components/analytics/revenue/RevenueTab";
import { StudentsTab } from "@/components/analytics/students/StudentsTab";
import { CoursesTab } from "@/components/analytics/courses/CoursesTab";
import { EngagementTab } from "@/components/analytics/engagement/EngagementTab";

/** Brief skeleton shown when the reporting period changes. */
const RANGE_SWITCH_MS = 350;

function AnalyticsContent() {
  const { get, set } = useUrlParams();
  const { keys, setKeys, rangeKey } = useAnalyticsRange();
  const sources = useAnalyticsSources();
  const tab = parseAnalyticsTab(get("tab"));

  const range = useMemo(() => (sources ? resolveAnalyticsRange(sources, keys) : null), [sources, keys]);
  const granularityParam = get("granularity");
  const instructorParam = get("instructorRank");
  const studentParam = get("studentRank");
  const options = useMemo(
    () => (range ? resolveReportOptions(range, { granularity: granularityParam, instructorRank: instructorParam, studentRank: studentParam }) : null),
    [range, granularityParam, instructorParam, studentParam]
  );
  const report = useMemo(
    () => (sources && range && options ? buildAnalyticsReport(tab, sources, range, options) : null),
    [tab, sources, range, options]
  );

  // Skeleton flash whenever the range changes (navbar or in-page picker).
  const [shownKey, setShownKey] = useState(rangeKey);
  const [switching, setSwitching] = useState(false);
  if (shownKey !== rangeKey) {
    setShownKey(rangeKey);
    setSwitching(true);
  }
  useEffect(() => {
    if (!switching) return;
    const timer = setTimeout(() => setSwitching(false), RANGE_SWITCH_MS);
    return () => clearTimeout(timer);
  }, [switching, rangeKey]);

  if (!sources || !range || !report) return <AnalyticsSkeleton tab={tab} />;

  const label = rangeLabel(range, sources.now);
  const caption = comparisonLabel(range);
  const currency = sources.currency;

  const handleRangeChange = (next: PickerRange) => {
    setKeys(next);
    toast.success("Analytics updated", { description: `Showing ${formatDateRange(next) || "all time"}.` });
  };

  const handleTabChange = (next: AnalyticsTab) => set({ tab: next === "overview" ? null : next });

  const handleExport = () => {
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

      {switching ? (
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
              <RevenueTab
                data={report.data}
                currency={currency}
                caption={caption}
                onGranularityChange={(g: Granularity) => set({ granularity: g })}
              />
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
