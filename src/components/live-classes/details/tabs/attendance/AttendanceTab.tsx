"use client";

import React from "react";
import { TablePagination } from "@/components/ui/TablePagination";
import type { LiveTabProps } from "../../liveTabTypes";
import { hasHappened } from "../../liveDetailFormat";
import { useEnrollmentList } from "../../common/useEnrollmentList";
import { ENROLLMENT_PAGE_SIZES } from "../../common/enrollmentFilters";
import { EnrollmentFilterBar } from "../../common/EnrollmentFilterBar";
import { AttendanceStatCards } from "./AttendanceStatCards";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceOverviewCard } from "./AttendanceOverviewCard";
import { AttendanceTimelineCard } from "./AttendanceTimelineCard";
import { TopEngagedCard } from "./TopEngagedCard";
import { AttendanceNotStarted } from "./AttendanceNotStarted";

/** Attendance: stat cards, URL-synced filters (?aq ?astatus ?apage ?asize) + table | donut, timeline, top engaged. */
export function AttendanceTab({ bundle, status }: LiveTabProps) {
  const { liveClass, enrollments } = bundle;
  const happened = hasHappened(status);
  const list = useEnrollmentList(liveClass, enrollments, "a", "attendance");

  if (!happened) {
    return (
      <div className="space-y-5">
        <AttendanceStatCards enrollments={enrollments} happened={false} />
        <AttendanceNotStarted liveClass={liveClass} status={status} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="min-w-0 space-y-5 xl:col-span-8">
        <AttendanceStatCards enrollments={enrollments} happened />
        <section className="dashboard-card shadow-2xs space-y-4 p-5">
          <EnrollmentFilterBar
            search={list.f.search}
            onSearchChange={list.f.setSearch}
            status={list.f.filters.status}
            onStatusChange={list.f.setStatus}
            exportLabel={list.selectedCount ? `Export Attendance (${list.selectedCount})` : "Export Attendance"}
            onExport={list.exportCsv}
          />
          <AttendanceTable rows={list.rows} offset={list.offset} selectedIds={list.selectedIds} onSelectRow={list.onSelectRow} onSelectAll={list.onSelectAll} />
          <TablePagination
            variant="plain"
            currentPage={list.page}
            totalCount={list.filtered.length}
            pageSize={list.f.pageSize}
            itemLabel="students"
            onPageChange={list.f.setPage}
            onPageSizeChange={list.f.setPageSize}
            pageSizeOptions={ENROLLMENT_PAGE_SIZES}
          />
        </section>
      </div>
      <div className="space-y-5 xl:col-span-4">
        <AttendanceOverviewCard enrollments={enrollments} />
        <AttendanceTimelineCard liveClass={liveClass} enrollments={enrollments} />
        <TopEngagedCard enrollments={enrollments} />
      </div>
    </div>
  );
}

export default AttendanceTab;
