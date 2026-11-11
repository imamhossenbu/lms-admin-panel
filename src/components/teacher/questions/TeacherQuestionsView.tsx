"use client";

import React from "react";
import { MessageCircleQuestion } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { TablePagination } from "@/components/ui/TablePagination";
import { PageFade } from "../shared/PageFade";
import { TeacherToolbar } from "../shared/TeacherToolbar";
import { EmptyRow } from "../shared/EmptyRow";
import { PAGE_SIZES, useListParams } from "../shared/useListParams";
import { QuestionCard } from "./QuestionCard";

type Tab = "open" | "answered" | "all";

/** Learners' questions (community QUESTION threads) on the teacher's courses — answer them here. */
export function TeacherQuestionsView() {
  const L = useListParams();
  const raw = L.get("status");
  const status: Tab = raw === "answered" || raw === "all" ? raw : "open";
  const list = usePagedList(() => teacherApi.questions({ q: L.q, courseId: L.courseId, status: status === "all" ? undefined : status, page: L.page, limit: L.perPage }), JSON.stringify([L.q, L.courseId, status, L.page, L.perPage]));
  return (
    <PageFade>
      <PageHeader title="Q&A" description="Questions learners asked in your courses' discussions." />
      <PillTabs<Tab>
        ariaLabel="Questions"
        idPrefix="qa"
        tabs={[
          { id: "open", label: "Needs answer" },
          { id: "answered", label: "Answered" },
          { id: "all", label: "All" },
        ]}
        activeId={status}
        onChange={(s) => L.set({ status: s === "open" ? null : s, page: null })}
      />
      <section className="dashboard-card shadow-2xs p-5">
        <TeacherToolbar query={L.q} onQuery={L.onQuery} courseId={L.courseId} onCourse={L.onCourse} placeholder="Search questions..." onReset={() => L.set({ q: null, course: null, page: null })} />
      </section>
      {list.error && !list.data ? (
        <LoadErrorCard title="Couldn't load questions" message={list.error} onRetry={list.reload} />
      ) : !list.data ? (
        <div className="animate-pulse space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-dash bg-white p-5">
              <span className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <span className="block h-4 w-2/3 rounded bg-slate-200" />
                <span className="block h-3 w-1/3 rounded bg-slate-100" />
              </div>
              <span className="h-5 w-24 rounded-md bg-slate-100" />
            </div>
          ))}
        </div>
      ) : list.data.data.length === 0 ? (
        <div className="dashboard-card">
          <EmptyRow icon={<MessageCircleQuestion className="h-6 w-6" />} title={status === "open" ? "No questions waiting" : "No questions yet"} text="When learners ask a question in your course discussion, it shows up here." />
        </div>
      ) : (
        <div className={`space-y-3 transition-opacity ${list.loading ? "opacity-60" : ""}`}>
          {list.data.data.map((q) => (
            <QuestionCard key={q.id} q={q} onReplied={list.reload} />
          ))}
          {list.data.meta.total > L.perPage && (
            <div className="dashboard-card">
              <TablePagination currentPage={L.page} pageSize={L.perPage} totalCount={list.data.meta.total} itemLabel="questions" onPageChange={L.onPage} onPageSizeChange={L.onPerPage} pageSizeOptions={PAGE_SIZES} />
            </div>
          )}
        </div>
      )}
    </PageFade>
  );
}

export default TeacherQuestionsView;
