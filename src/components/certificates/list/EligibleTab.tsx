"use client";

import React, { useMemo, useState } from "react";
import { PartyPopper, SearchX } from "lucide-react";
import type { CertificateData } from "@/lib/certificateStorage";
import { activeTemplateFor } from "@/lib/certificateStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { TablePagination } from "@/components/ui/TablePagination";
import { CertificatesEmptyState } from "./CertificatesEmptyState";
import { EligibleCourseCard } from "./EligibleCourseCard";
import { EligibleTable, type EligibleRow } from "./EligibleTable";
import { IssueAllModal } from "./IssueAllModal";
import { courseTitleOf } from "./certificateListUtils";
import { useCourseCatalog } from "@/lib/courseCatalog";
import type { CertificateListActions } from "./useCertificateListActions";

const PAGE_SIZES = [10, 20, 50];

export interface IssuePrefill {
  courseId: string;
  recipientId: string;
  grade: number | null;
  completedAt: string;
}

export interface EligibleTabProps {
  data: CertificateData;
  actions: CertificateListActions;
  onIssue: (prefill: IssuePrefill) => void;
}

/** Eligible tab: per-course summary cards with "Issue to all (N)", then the eligible learners table. */
export function EligibleTab({ data, actions, onIssue }: EligibleTabProps) {
  const { get, getPage, set } = useUrlParams();
  const [issueAllCourse, setIssueAllCourse] = useState<string | null>(null);

  const courseFilter = get("ecourse", "All");
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];

  const allRows: EligibleRow[] = useMemo(
    () => [...data.eligible].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).map((e) => ({ ...e, id: `${e.courseId}:${e.recipient.id}` })),
    [data.eligible]
  );
  const catalog = useCourseCatalog();
  const courses = useMemo(() => {
    const ids = Array.from(new Set(allRows.map((r) => r.courseId)));
    return ids
      .map((id) => ({ id, title: catalog?.find((c) => c.value === id)?.label ?? courseTitleOf(id), count: allRows.filter((r) => r.courseId === id).length, template: activeTemplateFor(data.templates, id) ?? null }))
      .sort((a, b) => b.count - a.count);
  }, [allRows, data.templates, catalog]);
  const blockedCourseIds = useMemo(() => new Set(courses.filter((c) => !c.template).map((c) => c.id)), [courses]);

  const filtered = courseFilter === "All" ? allRows : allRows.filter((r) => r.courseId === courseFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(getPage(), totalPages);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const target = courses.find((c) => c.id === issueAllCourse) ?? null;

  if (allRows.length === 0)
    return (
      <div className="dashboard-card shadow-2xs">
        <CertificatesEmptyState icon={<PartyPopper className="h-6 w-6" />} title="Everyone eligible has a certificate" message="Learners who complete a manual-issue course appear here until you issue their certificate." />
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((c, i) => (
          <EligibleCourseCard
            key={c.id}
            index={i}
            courseTitle={c.title}
            count={c.count}
            templateName={c.template?.name ?? null}
            active={courseFilter === c.id}
            busy={actions.busyId === c.id}
            onSelect={() => set({ ecourse: courseFilter === c.id ? null : c.id, page: null })}
            onIssueAll={() => setIssueAllCourse(c.id)}
          />
        ))}
      </div>

      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="body-medium font-semibold! text-primary-500">Eligible Learners</h2>
            <p className="body-xsm-regular text-primary-300">Completed the course and met the rules, but no certificate has been issued yet.</p>
          </div>
          {courseFilter !== "All" && (
            <button type="button" onClick={() => set({ ecourse: null, page: null })} className="cursor-pointer body-sm-medium text-blue hover:underline">
              Show all courses
            </button>
          )}
        </div>
        <EligibleTable
          rows={rows}
          blockedCourseIds={blockedCourseIds}
          onIssue={(r) => onIssue({ courseId: r.courseId, recipientId: r.recipient.id, grade: r.quizScore, completedAt: r.completedAt.slice(0, 10) })}
          emptyMessage={
            <CertificatesEmptyState icon={<SearchX className="h-6 w-6" />} title="No eligible learners in this course" message="Pick another course or show all courses." isFiltered onReset={() => set({ ecourse: null, page: null })} />
          }
          footer={
            filtered.length > 0 ? (
              <TablePagination
                currentPage={currentPage}
                pageSize={perPage}
                totalCount={filtered.length}
                itemLabel="learners"
                onPageChange={(next) => set({ page: next })}
                onPageSizeChange={(size) => set({ perPage: size === PAGE_SIZES[0] ? null : size, page: null })}
                pageSizeOptions={PAGE_SIZES}
              />
            ) : undefined
          }
        />
      </section>

      <IssueAllModal
        isOpen={!!target}
        courseTitle={target?.title ?? ""}
        count={target?.count ?? 0}
        templateName={target?.template?.name ?? null}
        onClose={() => setIssueAllCourse(null)}
        onConfirm={(sendEmail) => (target ? actions.issueAll(target.id, target.title, target.count, sendEmail) : Promise.resolve())}
      />
    </div>
  );
}

export default EligibleTab;
