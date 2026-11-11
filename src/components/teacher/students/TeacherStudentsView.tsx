"use client";

import React from "react";
import { Users } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import type { TeacherStudentRow } from "@/types/teacher";
import type { ColumnDef } from "@/components/ui/Datatable";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { TableSkeleton } from "@/components/website/shared/TableSkeleton";
import { PageFade } from "../shared/PageFade";
import { TeacherToolbar } from "../shared/TeacherToolbar";
import { TeacherTable } from "../shared/TeacherTable";
import { EmptyRow } from "../shared/EmptyRow";
import { useListParams } from "../shared/useListParams";
import { ago, fmtDate } from "../shared/format";

/** Learners enrolled in the teacher's courses: search, course filter, progress and last activity. */
export function TeacherStudentsView() {
  const L = useListParams();
  const list = usePagedList(() => teacherApi.students({ q: L.q, courseId: L.courseId, page: L.page, limit: L.perPage }), JSON.stringify([L.q, L.courseId, L.page, L.perPage]));
  const columns: ColumnDef<TeacherStudentRow>[] = [
    { key: "student", header: "Student", render: (r) => <div className="flex min-w-0 items-center gap-3"><Avatar name={r.user.name} src={r.user.avatar} size="sm" /><div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.user.name}</p><p className="truncate body-xsm-regular text-primary-300">{r.user.email}</p></div></div> },
    { key: "course", header: "Course", width: "220px", render: (r) => <p className="truncate body-sm-regular text-primary-500">{r.course.title}</p> },
    { key: "progress", header: "Progress", width: "180px", render: (r) => <div className="flex items-center gap-2"><span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-brand-orange" style={{ width: `${r.progressPercentage}%` }} /></span><span className="w-10 text-right body-xsm-medium text-primary-400">{r.progressPercentage}%</span></div> },
    { key: "enrolled", header: "Enrolled", width: "120px", render: (r) => <span className="body-sm-regular text-primary-400">{fmtDate(r.enrolledAt)}</span> },
    { key: "active", header: "Last active", width: "110px", render: (r) => <span className="body-sm-regular text-primary-400">{ago(r.lastAccessedAt)}</span> },
    { key: "status", header: "Status", width: "120px", align: "center", render: (r) => <ToneBadge tone={r.completedAt ? "green" : r.progressPercentage > 0 ? "orange" : "gray"} size="sm" dot>{r.completedAt ? "Completed" : r.progressPercentage > 0 ? "Learning" : "Not started"}</ToneBadge> },
  ];
  return (
    <PageFade>
      <PageHeader title="Students" description="Learners enrolled in your courses." />
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <TeacherToolbar query={L.q} onQuery={L.onQuery} courseId={L.courseId} onCourse={L.onCourse} placeholder="Search name or email..." onReset={() => L.set({ q: null, course: null, page: null })} />
        {list.error && !list.data ? <LoadErrorCard title="Couldn't load students" message={list.error} onRetry={list.reload} /> : !list.data ? <TableSkeleton cols={6} /> : (
          <TeacherTable columns={columns} rows={list.data.data} rowKey={(r) => r.id} total={list.data.meta.total} page={L.page} perPage={L.perPage} itemLabel="students" onPage={L.onPage} onPerPage={L.onPerPage} loading={list.loading} empty={<EmptyRow icon={<Users className="h-6 w-6" />} title="No students found" text="Learners appear here once they enrol in one of your courses." />} />
        )}
      </section>
    </PageFade>
  );
}

export default TeacherStudentsView;
