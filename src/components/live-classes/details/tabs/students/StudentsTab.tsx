"use client";

import React from "react";
import { Mail } from "lucide-react";
import { TablePagination } from "@/components/ui/TablePagination";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LiveTabProps } from "../../liveTabTypes";
import { canJoin, hasHappened } from "../../liveDetailFormat";
import { useLiveClassActions } from "../../hooks/useLiveClassActions";
import { useEnrollmentList } from "../../common/useEnrollmentList";
import { ENROLLMENT_PAGE_SIZES } from "../../common/enrollmentFilters";
import { EnrollmentFilterBar } from "../../common/EnrollmentFilterBar";
import { NotStartedNote } from "../../common/NotStartedNote";
import { StudentsStatCards } from "./StudentsStatCards";
import { StudentsTable } from "./StudentsTable";

/** Students: stat cards, URL-synced filters (?sq ?sstatus ?sprogress ?spage ?ssize), table + pagination. */
export function StudentsTab({ bundle, status }: LiveTabProps) {
  const { liveClass, enrollments } = bundle;
  const happened = hasHappened(status);
  const actions = useLiveClassActions(liveClass);
  const list = useEnrollmentList(liveClass, enrollments, "s", "students");

  return (
    <div className="space-y-5">
      <StudentsStatCards enrollments={enrollments} happened={happened} />
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <EnrollmentFilterBar
          search={list.f.search}
          onSearchChange={list.f.setSearch}
          status={list.f.filters.status}
          onStatusChange={list.f.setStatus}
          progress={list.f.filters.progress}
          onProgressChange={list.f.setProgress}
          exportLabel={list.selectedCount ? `Export (${list.selectedCount})` : "Export"}
          onExport={list.exportCsv}
        >
          <SecondaryButton
            leftIcon={<Mail />}
            onClick={() => void actions.remind(true)}
            isLoading={actions.busy === "remind"}
            disabled={!canJoin(status)}
            title={canJoin(status) ? "Remind students who haven't joined" : "Reminders are only available before or during the class"}
          >
            Send Reminder
          </SecondaryButton>
        </EnrollmentFilterBar>
        {!happened && <NotStartedNote />}
        <StudentsTable
          rows={list.rows}
          offset={list.offset}
          durationMin={list.duration}
          happened={happened}
          selectedIds={list.selectedIds}
          onSelectRow={list.onSelectRow}
          onSelectAll={list.onSelectAll}
        />
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
  );
}

export default StudentsTab;
