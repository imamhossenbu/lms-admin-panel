"use client";

import React, { useState } from "react";
import { Download, Eye } from "lucide-react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { formatDuration } from "@/lib/quizStats";
import { StudentCell } from "../../common/StudentCell";
import { AttemptResultBadge } from "../../common/AttemptResultBadge";
import { DateTimeCell } from "../../common/DateTimeCell";
import { AttemptDetailsModal, exportAttemptCsv } from "../../AttemptDetailsModal";
import { formatNumber, ordinal } from "../../quizFormat";
import { SUBMISSION_PAGE_SIZES } from "./submissionFilters";
import { SubmissionsFilterBar } from "./SubmissionsFilterBar";
import type { useQuizSubmissionsFilters } from "./useQuizSubmissionsFilters";

export interface SubmissionsTableCardProps {
  quiz: QuizItem;
  /** Already filtered + sorted. */
  filtered: QuizAttempt[];
  f: ReturnType<typeof useQuizSubmissionsFilters>;
}

/** Filter bar + paginated attempts table + details modal. */
export function SubmissionsTableCard({ quiz, filtered, f }: SubmissionsTableCardProps) {
  const [viewing, setViewing] = useState<QuizAttempt | null>(null);
  const totalPages = Math.max(1, Math.ceil(filtered.length / f.pageSize));
  const page = Math.min(f.page, totalPages);
  const offset = (page - 1) * f.pageSize;
  const rows = filtered.slice(offset, offset + f.pageSize);

  const columns: ColumnDef<QuizAttempt>[] = [
    { key: "n", header: "#", width: "48px", render: (_, i) => <span className="body-sm-regular text-primary-400">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (a) => <StudentCell student={a.student} /> },
    { key: "attempt", header: "Attempt", align: "center", render: (a) => <span className="whitespace-nowrap">{ordinal(a.attemptNumber)}</span> },
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
        <div className="flex items-center justify-center gap-2">
          <SecondaryButton size="sm" onClick={() => setViewing(a)}>
            View
          </SecondaryButton>
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
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <SubmissionsFilterBar f={f} />
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(a) => a.id}
        emptyMessage={f.isFiltered ? "No submissions match these filters. Try resetting them." : "No submissions yet — attempts appear here once students take this quiz."}
      />
      <TablePagination
        currentPage={page}
        totalCount={filtered.length}
        pageSize={f.pageSize}
        itemLabel="submissions"
        onPageChange={f.setPage}
        onPageSizeChange={f.setPageSize}
        pageSizeOptions={SUBMISSION_PAGE_SIZES}
        variant="plain"
      />
      <AttemptDetailsModal quiz={quiz} attempt={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}

export default SubmissionsTableCard;
