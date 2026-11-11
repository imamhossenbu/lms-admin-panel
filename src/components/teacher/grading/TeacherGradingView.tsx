"use client";

import React, { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import type { TeacherSubmission } from "@/types/teacher";
import type { ColumnDef } from "@/components/ui/Datatable";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { TableSkeleton } from "@/components/website/shared/TableSkeleton";
import { PageFade } from "../shared/PageFade";
import { TeacherToolbar } from "../shared/TeacherToolbar";
import { TeacherTable } from "../shared/TeacherTable";
import { EmptyRow } from "../shared/EmptyRow";
import { useListParams } from "../shared/useListParams";
import { ago } from "../shared/format";
import { GradeModal } from "./GradeModal";

type Tab = "PENDING" | "GRADED";

/** Grading queue: To grade / Graded (?status=), search + course filter, click a row to grade. */
export function TeacherGradingView() {
  const L = useListParams();
  const status: Tab = L.get("status") === "GRADED" ? "GRADED" : "PENDING";
  const list = usePagedList(() => teacherApi.submissions({ q: L.q, courseId: L.courseId, status, page: L.page, limit: L.perPage }), JSON.stringify([L.q, L.courseId, status, L.page, L.perPage]));
  const [open, setOpen] = useState<TeacherSubmission | null>(null);

  const columns: ColumnDef<TeacherSubmission>[] = [
    { key: "student", header: "Student", width: "230px", render: (r) => <div className="flex min-w-0 items-center gap-3"><Avatar name={r.user.name} src={r.user.avatar} size="sm" /><div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.user.name}</p><p className="truncate body-xsm-regular text-primary-300">{r.user.email}</p></div></div> },
    { key: "assignment", header: "Assignment", render: (r) => <div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.assignment.title}</p><p className="truncate body-xsm-regular text-primary-300">{r.assignment.course.title}</p></div> },
    { key: "submitted", header: "Submitted", width: "130px", render: (r) => <div className="flex items-center gap-2"><span className="body-sm-regular text-primary-400">{ago(r.submittedAt)}</span>{r.isLate && <ToneBadge tone="red" size="sm">Late</ToneBadge>}</div> },
    { key: "marks", header: "Marks", width: "100px", align: "center", render: (r) => <span className="body-sm-medium text-primary-500">{r.status === "GRADED" ? `${r.marksObtained ?? 0}/${r.assignment.marks}` : `—/${r.assignment.marks}`}</span> },
    { key: "status", header: "Status", width: "120px", align: "center", render: (r) => <ToneBadge tone={r.status === "GRADED" ? "green" : "orange"} size="sm" dot>{r.status === "GRADED" ? "Graded" : "To grade"}</ToneBadge> },
    { key: "action", header: "Action", width: "100px", align: "center", render: (r) => <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(r); }} className="h-8 rounded-lg border border-dash px-3 body-xsm-medium text-primary-500 hover:border-brand-orange hover:text-brand-orange">{r.status === "GRADED" ? "Edit" : "Grade"}</button> },
  ];

  return (
    <PageFade>
      <PageHeader title="Grading" description="Review your learners' assignment submissions and give marks and feedback." />
      <PillTabs<Tab>
        ariaLabel="Grading"
        idPrefix="grading"
        tabs={[
          { id: "PENDING", label: "To grade", count: list.data && status === "PENDING" ? list.data.meta.total : list.data?.pending },
          { id: "GRADED", label: "Graded" },
        ]}
        activeId={status}
        onChange={(s) => L.set({ status: s === "PENDING" ? null : s, page: null })}
      />
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <TeacherToolbar query={L.q} onQuery={L.onQuery} courseId={L.courseId} onCourse={L.onCourse} placeholder="Search student or assignment..." onReset={() => L.set({ q: null, course: null, page: null })} />
        {list.error && !list.data ? <LoadErrorCard title="Couldn't load submissions" message={list.error} onRetry={list.reload} /> : !list.data ? <TableSkeleton cols={6} /> : (
          <TeacherTable columns={columns} rows={list.data.data} rowKey={(r) => r.id} onRowClick={setOpen} total={list.data.meta.total} page={L.page} perPage={L.perPage} itemLabel="submissions" onPage={L.onPage} onPerPage={L.onPerPage} loading={list.loading} empty={<EmptyRow icon={<ClipboardCheck className="h-6 w-6" />} title={status === "PENDING" ? "Nothing to grade" : "No graded work yet"} text={status === "PENDING" ? "You're all caught up — new submissions appear here." : "Submissions you grade appear here."} />} />
        )}
      </section>
      <GradeModal sub={open} onClose={() => setOpen(null)} onGraded={list.reload} />
    </PageFade>
  );
}

export default TeacherGradingView;
