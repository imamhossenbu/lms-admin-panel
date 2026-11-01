"use client";

import React, { useMemo } from "react";
import { ChartColumnBig } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { formatDuration, questionPerformance } from "@/lib/quizStats";
import { MeterBar, type MeterTone } from "../../common/MeterBar";
import { useUrlPage } from "../../hooks/useUrlChoice";

type Row = ReturnType<typeof questionPerformance>[number];
const PAGE_SIZE = 5;

function PctBar({ value, tone, answered }: { value: number; tone: MeterTone; answered: number }) {
  if (!answered) return <span className="body-xsm-regular text-primary-300">—</span>;
  return (
    <div className="flex min-w-32 items-center gap-2.5">
      <span className={`w-10 shrink-0 body-sm-medium tabular-nums ${tone === "green" ? "text-green" : "text-red"}`}>{value}%</span>
      <MeterBar value={value} tone={tone} className="h-2" />
    </div>
  );
}

/** Per-question correct % / incorrect % / average time (5 per page, `?qpage`). */
export function QuestionPerformanceCard({ quiz, attempts }: { quiz: QuizItem; attempts: QuizAttempt[] }) {
  const all = useMemo(() => questionPerformance(quiz, attempts), [quiz, attempts]);
  const [rawPage, setPage] = useUrlPage("qpage");
  const page = Math.min(rawPage, Math.max(1, Math.ceil(all.length / PAGE_SIZE)));
  const rows = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ColumnDef<Row>[] = [
    { key: "n", header: "#", width: "48px", render: (r) => <span className="text-primary-400">{r.index}</span> },
    {
      key: "q",
      header: "Question",
      render: (r) => (
        <p className="line-clamp-2 min-w-48 body-sm-regular text-primary-500" title={r.text}>
          {r.text}
        </p>
      ),
    },
    { key: "correct", header: "Correct %", render: (r) => <PctBar value={r.correctPct} tone="green" answered={r.answered} /> },
    { key: "incorrect", header: "Incorrect %", render: (r) => <PctBar value={r.incorrectPct} tone="red" answered={r.answered} /> },
    { key: "time", header: "Avg. Time", render: (r) => <span className="whitespace-nowrap">{r.answered ? formatDuration(r.avgTimeSeconds) : "—"}</span> },
  ];

  return (
    <IconSectionCard icon={<ChartColumnBig className="h-5 w-5" />} title="Question Performance" className="h-full" bodyClassName="space-y-4">
      <DataTable columns={columns} data={rows} rowKey={(r) => r.questionId} emptyMessage="This quiz has no questions yet." />
      {all.length > PAGE_SIZE && (
        <TablePagination currentPage={page} totalCount={all.length} pageSize={PAGE_SIZE} itemLabel="questions" onPageChange={setPage} variant="plain" />
      )}
    </IconSectionCard>
  );
}

export default QuestionPerformanceCard;
