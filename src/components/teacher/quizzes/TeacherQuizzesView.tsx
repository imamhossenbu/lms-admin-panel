"use client";

import React from "react";
import { FileQuestion, Percent, Target, Trophy } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import type { TeacherAttempt } from "@/types/teacher";
import type { ColumnDef } from "@/components/ui/Datatable";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { TableSkeleton } from "@/components/website/shared/TableSkeleton";
import { PageFade } from "../shared/PageFade";
import { TeacherToolbar } from "../shared/TeacherToolbar";
import { TeacherTable } from "../shared/TeacherTable";
import { EmptyRow } from "../shared/EmptyRow";
import { useListParams } from "../shared/useListParams";
import { fmtDate } from "../shared/format";

/** Quiz attempts on the teacher's courses: stats, search / course / result filters, bordered table. */
export function TeacherQuizzesView() {
  const L = useListParams();
  const result = L.get("result", "All");
  const list = usePagedList(() => teacherApi.attempts({ q: L.q, courseId: L.courseId, result, page: L.page, limit: L.perPage }), JSON.stringify([L.q, L.courseId, result, L.page, L.perPage]));
  const s = list.data?.stats;
  const columns: ColumnDef<TeacherAttempt>[] = [
    { key: "student", header: "Student", width: "230px", render: (r) => <div className="flex min-w-0 items-center gap-3"><Avatar name={r.user.name} src={r.user.avatar} size="sm" /><div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.user.name}</p><p className="truncate body-xsm-regular text-primary-300">{r.user.email}</p></div></div> },
    { key: "quiz", header: "Quiz", render: (r) => <div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.quiz.title}</p><p className="truncate body-xsm-regular text-primary-300">{r.quiz.course.title} · attempt {r.attemptNumber}</p></div> },
    { key: "score", header: "Score", width: "120px", align: "center", render: (r) => <span className="body-sm-medium text-primary-500">{r.score}/{r.totalMarks} · {r.percentage}%</span> },
    { key: "result", header: "Result", width: "120px", align: "center", render: (r) => <ToneBadge tone={r.passed ? "green" : "red"} size="sm" dot>{r.passed ? "Passed" : "Not passed"}</ToneBadge> },
    { key: "date", header: "Date", width: "120px", render: (r) => <span className="body-sm-regular text-primary-400">{fmtDate(r.submittedAt)}</span> },
  ];
  return (
    <PageFade>
      <PageHeader title="Quiz Results" description="How your learners are doing on your course quizzes." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TrendStatCard icon={<Target />} iconClassName="bg-blue-14 text-blue" label="Attempts" value={s ? `${s.attempts}` : "—"} />
        <TrendStatCard icon={<Percent />} iconClassName="bg-brand-orange-light text-brand-orange" label="Average score" value={s ? `${s.averagePercentage}%` : "—"} />
        <TrendStatCard icon={<Trophy />} iconClassName="bg-green-bg text-green" label="Pass rate" value={s ? `${s.passRate}%` : "—"} />
      </div>
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <TeacherToolbar
          query={L.q}
          onQuery={L.onQuery}
          courseId={L.courseId}
          onCourse={L.onCourse}
          placeholder="Search student or quiz..."
          extra={{ value: result, options: [{ value: "All", label: "All results" }, { value: "passed", label: "Passed" }, { value: "failed", label: "Not passed" }], onChange: (v) => L.set({ result: v === "All" ? null : v, page: null }) }}
          onReset={() => L.set({ q: null, course: null, result: null, page: null })}
        />
        {list.error && !list.data ? <LoadErrorCard title="Couldn't load quiz results" message={list.error} onRetry={list.reload} /> : !list.data ? <TableSkeleton cols={5} /> : (
          <TeacherTable columns={columns} rows={list.data.data} rowKey={(r) => r.id} total={list.data.meta.total} page={L.page} perPage={L.perPage} itemLabel="attempts" onPage={L.onPage} onPerPage={L.onPerPage} loading={list.loading} empty={<EmptyRow icon={<FileQuestion className="h-6 w-6" />} title="No quiz attempts" text="Attempts on your course quizzes appear here." />} />
        )}
      </section>
    </PageFade>
  );
}

export default TeacherQuizzesView;
