"use client";

import React, { useMemo } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import type { QuizAttempt } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { formatDuration, topStudents } from "@/lib/quizStats";
import { StudentCell } from "../../common/StudentCell";
import { AttemptResultBadge } from "../../common/AttemptResultBadge";
import { formatNumber } from "../../quizFormat";
import { useUrlPage } from "../../hooks/useUrlChoice";

const PAGE_SIZE = 5;
/** How many leaders the card ranks (paged 5 at a time). */
const TOP_N = 20;

export interface TopStudentsCardProps {
  attempts: QuizAttempt[];
  onViewAll: () => void;
}

/** Best completed attempts (score desc, then fastest) with rank, % and result; `?tspage`. */
export function TopStudentsCard({ attempts, onViewAll }: TopStudentsCardProps) {
  const all = useMemo(() => topStudents(attempts, TOP_N), [attempts]);
  const [rawPage, setPage] = useUrlPage("tspage");
  const page = Math.min(rawPage, Math.max(1, Math.ceil(all.length / PAGE_SIZE)));
  const offset = (page - 1) * PAGE_SIZE;
  const rows = all.slice(offset, offset + PAGE_SIZE);

  const columns: ColumnDef<QuizAttempt>[] = [
    { key: "n", header: "#", width: "48px", render: (_, i) => <span className="text-primary-400">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (a) => <StudentCell student={a.student} compact /> },
    {
      key: "score",
      header: "Score",
      render: (a) => (
        <span className="body-sm-medium whitespace-nowrap">
          {formatNumber(a.score)}/{a.totalMarks}
        </span>
      ),
    },
    { key: "pct", header: "Percentage", render: (a) => `${Math.round((a.score / (a.totalMarks || 1)) * 100)}%` },
    { key: "time", header: "Time Taken", render: (a) => <span className="whitespace-nowrap">{formatDuration(a.timeTakenSeconds)}</span> },
    { key: "result", header: "Result", render: (a) => <AttemptResultBadge attempt={a} size="sm" /> },
  ];

  return (
    <IconSectionCard
      icon={<Trophy className="h-5 w-5" />}
      tone="yellow"
      title="Top Performing Students"
      className="h-full"
      action={
        <CardActionButton onClick={onViewAll}>
          View All Students <ArrowRight className="h-4 w-4" />
        </CardActionButton>
      }
      bodyClassName="space-y-4"
    >
      <DataTable columns={columns} data={rows} rowKey={(a) => a.id} emptyMessage="No completed attempts yet." />
      {all.length > PAGE_SIZE && (
        <TablePagination currentPage={page} totalCount={all.length} pageSize={PAGE_SIZE} itemLabel="students" onPageChange={setPage} variant="plain" />
      )}
    </IconSectionCard>
  );
}

export default TopStudentsCard;
