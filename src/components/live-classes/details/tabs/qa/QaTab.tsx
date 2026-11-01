"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareOff } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { answerLiveQuestion } from "@/lib/liveClassStorage";
import type { LiveQuestion } from "@/types/liveClass";
import type { LiveTabProps } from "../../liveTabTypes";
import { LiveTabCard } from "./LiveTabCard";
import { LiveTabColumns } from "./LiveTabColumns";
import { QaFilterBar } from "./QaFilterBar";
import { QaSummaryCard } from "./QaSummaryCard";
import { QaTable } from "./QaTable";
import { QuestionDetailsPanel } from "./QuestionDetailsPanel";
import { TabEmptyState } from "./TabEmptyState";
import { exportQaCsv } from "./qaCsv";
import { LIVE_QA_FOCUS_KEY, errorText } from "./liveTabFormat";
import { QA_PAGE_SIZE, useQaFilters } from "./useQaFilters";

function QaTabBody({ bundle, status }: LiveTabProps) {
  const f = useQaFilters();
  const { liveClass } = bundle;
  const [selected, setSelected] = useState<string[]>([]);
  const future = status === "UPCOMING" || status === "SCHEDULED";

  // Activity tab → "View Question" hands the id over through sessionStorage.
  const { openQuestion } = f;
  useEffect(() => {
    const id = sessionStorage.getItem(LIVE_QA_FOCUS_KEY);
    if (id) {
      sessionStorage.removeItem(LIVE_QA_FOCUS_KEY);
      openQuestion(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questions = useMemo(() => [...bundle.questions].sort((a, b) => a.askedAt.localeCompare(b.askedAt)), [bundle.questions]);
  const students = useMemo(
    () =>
      Array.from(new Map(questions.map((q) => [q.student.id, q.student.name])).entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label })),
    [questions]
  );

  const filtered = useMemo(() => {
    const term = f.q.trim().toLowerCase();
    return questions.filter(
      (q) =>
        (f.status === "All" || q.status === f.status) &&
        (f.student === "All" || q.student.id === f.student) &&
        (!term || q.question.toLowerCase().includes(term) || q.student.name.toLowerCase().includes(term))
    );
  }, [questions, f.q, f.status, f.student]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / QA_PAGE_SIZE));
  const page = Math.min(f.page, totalPages);
  const rows = filtered.slice((page - 1) * QA_PAGE_SIZE, page * QA_PAGE_SIZE);
  const active = questions.find((q) => q.id === f.questionId) ?? null;

  const setStatusOf = async (q: LiveQuestion, next: LiveQuestion["status"]) => {
    const toastId = toast.loading(next === "PENDING" ? "Marking as pending..." : "Marking as answered...", { description: q.question });
    try {
      await answerLiveQuestion(q.id, q.answerHtml, next);
      toast.success(next === "PENDING" ? "Marked as pending" : "Marked as answered", { id: toastId, description: `${q.student.name}'s question was updated.` });
    } catch (e) {
      toast.error("Couldn't update the question", { id: toastId, description: errorText(e) });
    }
  };

  const exportRows = selected.length ? questions.filter((q) => selected.includes(q.id)) : filtered;
  const onExport = () => {
    if (!exportRows.length) return;
    exportQaCsv(liveClass.title, exportRows);
    toast.success("Q&A exported", { description: `${exportRows.length} question${exportRows.length === 1 ? "" : "s"} downloaded as CSV.` });
  };

  const isFiltered = f.status !== "All" || f.student !== "All" || !!f.q;

  const main =
    questions.length === 0 ? (
      <LiveTabCard title="Student Questions (0)" subtitle="All questions asked during the live class session.">
        <TabEmptyState
          icon={<MessageSquareOff className="h-6 w-6" />}
          title={future ? "No questions yet" : status === "CANCELLED" ? "This class was cancelled" : "No questions were asked"}
          description={
            future
              ? "Questions appear here once the class starts."
              : status === "LIVE"
                ? "Questions students ask during the session will show up here in real time."
                : liveClass.settings.allowQa
                  ? "Students didn't ask any questions during this session."
                  : "Q&A was turned off for this class."
          }
        />
      </LiveTabCard>
    ) : (
      <LiveTabCard
        title={`Student Questions (${questions.length})`}
        subtitle="All questions asked during the live class session."
        action={
          <QaFilterBar
            status={f.status}
            onStatusChange={f.setStatus}
            student={f.student}
            students={students}
            onStudentChange={f.setStudent}
            search={f.search}
            onSearchChange={f.setSearch}
            onExport={onExport}
            exportLabel={selected.length ? `Export Selected (${selected.length})` : "Export Q&A"}
            exportDisabled={!exportRows.length}
          />
        }
      >
        <QaTable
          rows={rows}
          total={filtered.length}
          page={page}
          onPageChange={f.setPage}
          activeId={active?.id ?? ""}
          onOpen={(q) => f.openQuestion(q.id)}
          onMarkPending={(q) => setStatusOf(q, "PENDING")}
          onMarkAnswered={(q) => setStatusOf(q, "ANSWERED")}
          selected={selected}
          onSelectedChange={setSelected}
          emptyMessage={isFiltered ? "No questions match these filters." : "No questions found."}
        />
      </LiveTabCard>
    );

  return (
    <LiveTabColumns
      main={main}
      stickySide
      side={
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active ? `q-${active.id}` : "summary"}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {active ? (
              <QuestionDetailsPanel question={active} classDate={liveClass.date} onClose={() => f.openQuestion(null)} />
            ) : (
              <QaSummaryCard questions={questions} allowQa={liveClass.settings.allowQa} />
            )}
          </motion.div>
        </AnimatePresence>
      }
    />
  );
}

/** Skeleton mirroring the Q&A table + right panel. */
export function QaTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="dashboard-card space-y-4 p-5 xl:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-dash">
          <div className="flex divide-x divide-dash bg-gray-bg">
            {[10, 8, 28, 40, 14, 14, 10].map((w, i) => (
              <div key={i} className="px-3.5 py-3" style={{ width: `${w}%` }}>
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={r} className="flex items-center divide-x divide-dash border-t border-dash">
              <div className="px-3.5 py-3" style={{ width: "10%" }}><Skeleton className="h-4 w-4" /></div>
              <div className="px-3.5 py-3" style={{ width: "8%" }}><Skeleton className="h-3 w-4" /></div>
              <div className="flex items-center gap-2 px-3.5 py-3" style={{ width: "28%" }}>
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="px-3.5 py-3" style={{ width: "40%" }}><Skeleton className="h-3 w-5/6" /></div>
              <div className="px-3.5 py-3" style={{ width: "14%" }}><Skeleton className="h-3 w-14" /></div>
              <div className="px-3.5 py-3" style={{ width: "14%" }}><Skeleton className="h-6 w-20 rounded-md" /></div>
              <div className="px-3.5 py-3" style={{ width: "10%" }}><Skeleton className="h-7 w-7" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card space-y-4 p-4.5 xl:col-span-4">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2 rounded-xl border border-dash p-3">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Q&A tab: student questions table (URL-synced filters) + Question Details / Q&A Summary panel. */
export function QaTab(props: LiveTabProps) {
  return (
    <Suspense fallback={<QaTabSkeleton />}>
      <QaTabBody {...props} />
    </Suspense>
  );
}

export default QaTab;
