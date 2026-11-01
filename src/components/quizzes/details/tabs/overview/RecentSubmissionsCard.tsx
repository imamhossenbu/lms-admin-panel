"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Download, Eye, FileText } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { formatDuration } from "@/lib/quizStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { StudentCell } from "../../common/StudentCell";
import { AttemptResultBadge } from "../../common/AttemptResultBadge";
import { DateTimeCell } from "../../common/DateTimeCell";
import { ViewIconButton } from "../../common/ViewIconButton";
import { AttemptDetailsModal, exportAttemptCsv } from "../../AttemptDetailsModal";
import { formatNumber } from "../../quizFormat";

const PAGE_SIZES = [5, 10, 20];

export interface RecentSubmissionsCardProps {
  quiz: QuizItem;
  attempts: QuizAttempt[];
  onViewAll: () => void;
}

/** Newest attempts (5 per page, `?rpage` / `?rsize`) with a details modal and per-row export. */
export function RecentSubmissionsCard({ quiz, attempts, onViewAll }: RecentSubmissionsCardProps) {
  const { get, set } = useUrlParams();
  const [viewing, setViewing] = useState<QuizAttempt | null>(null);
  const rawSize = Number(get("rsize", "5"));
  const pageSize = PAGE_SIZES.includes(rawSize) ? rawSize : 5;
  const rawPage = Number(get("rpage", "1"));
  const sorted = useMemo(() => [...attempts].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)), [attempts]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1, totalPages);
  const offset = (page - 1) * pageSize;
  const rows = sorted.slice(offset, offset + pageSize);

  const columns: ColumnDef<QuizAttempt>[] = [
    { key: "n", header: "#", width: "48px", render: (_, i) => <span className="body-sm-regular text-primary-400">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (a) => <StudentCell student={a.student} /> },
    {
      key: "score",
      header: "Score",
      render: (a) => (
        <span className="body-sm-medium text-primary-500 whitespace-nowrap">
          {formatNumber(a.score)}/{a.totalMarks}
        </span>
      ),
    },
    { key: "result", header: "Result", render: (a) => <AttemptResultBadge attempt={a} /> },
    { key: "time", header: "Time Taken", render: (a) => <span className="whitespace-nowrap">{formatDuration(a.timeTakenSeconds)}</span> },
    { key: "at", header: "Submitted At", render: (a) => <DateTimeCell iso={a.submittedAt} /> },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (a) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewIconButton label={`View ${a.student.name}'s attempt`} onClick={() => setViewing(a)} />
          <RowMoreMenu
            size="sm"
            items={[
              { key: "view", label: "View details", icon: <Eye className="h-4 w-4" />, onClick: () => setViewing(a) },
              { key: "export", label: "Export attempt CSV", icon: <Download className="h-4 w-4" />, onClick: () => exportAttemptCsv(quiz, a) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Recent Submissions"
      action={
        <CardActionButton onClick={onViewAll}>
          View All Submissions <ArrowRight className="h-4 w-4" />
        </CardActionButton>
      }
      bodyClassName="space-y-4"
    >
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(a) => a.id}
        emptyMessage="No submissions yet — attempts appear here once students take this quiz."
      />
      <TablePagination
        currentPage={page}
        totalCount={sorted.length}
        pageSize={pageSize}
        itemLabel="submissions"
        onPageChange={(p) => set({ rpage: p === 1 ? null : p })}
        onPageSizeChange={(s) => set({ rsize: s === 5 ? null : s, rpage: null })}
        pageSizeOptions={PAGE_SIZES}
        variant="plain"
      />
      <AttemptDetailsModal quiz={quiz} attempt={viewing} onClose={() => setViewing(null)} />
    </IconSectionCard>
  );
}

export default RecentSubmissionsCard;
