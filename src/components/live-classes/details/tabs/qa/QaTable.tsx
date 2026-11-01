"use client";

import React from "react";
import { CheckCircle2, Clock, MessageSquareText } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { TablePagination } from "@/components/ui/TablePagination";
import { formatClock } from "@/lib/liveClassStats";
import { htmlToText } from "@/lib/sanitizeHtml";
import type { LiveQuestion } from "@/types/liveClass";
import { LiveInitialsAvatar } from "./LiveInitialsAvatar";
import { QaStatusBadge } from "./QaStatusBadge";
import { QA_PAGE_SIZE } from "./useQaFilters";

export interface QaTableProps {
  rows: LiveQuestion[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  activeId: string;
  onOpen: (q: LiveQuestion) => void;
  onMarkPending: (q: LiveQuestion) => void;
  onMarkAnswered: (q: LiveQuestion) => void;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  emptyMessage: React.ReactNode;
}

/** Student questions table (checkbox, #, student, question, asked at, status, ⋮). */
export function QaTable(p: QaTableProps) {
  const offset = (p.page - 1) * QA_PAGE_SIZE;
  const columns: ColumnDef<LiveQuestion>[] = [
    { key: "n", header: "#", width: "48px", render: (_, i) => <span className="body-sm-regular text-primary-300">{offset + i + 1}</span> },
    {
      key: "student",
      header: "Student",
      render: (q) => (
        <span className="flex items-center gap-2.5">
          <LiveInitialsAvatar name={q.student.name} />
          <span className="whitespace-nowrap body-sm-medium text-primary-500">{q.student.name}</span>
        </span>
      ),
    },
    {
      key: "question",
      header: "Question",
      render: (q) => (
        <span title={q.question} className={`block max-w-md truncate body-sm-regular ${q.id === p.activeId ? "text-brand-orange" : "text-primary-400"}`}>
          {q.question}
        </span>
      ),
    },
    { key: "askedAt", header: "Asked At", width: "112px", render: (q) => <span className="whitespace-nowrap body-sm-regular text-primary-400">{formatClock(q.askedAt)}</span> },
    { key: "status", header: "Status", width: "120px", render: (q) => <QaStatusBadge status={q.status} /> },
    {
      key: "actions",
      header: "Actions",
      width: "84px",
      align: "center",
      render: (q) => (
        <RowMoreMenu
          size="sm"
          label="Question actions"
          items={[
            { key: "view", label: q.status === "ANSWERED" ? "View Answer" : "View / Answer", icon: <MessageSquareText className="h-4 w-4" />, onClick: () => p.onOpen(q) },
            q.status === "ANSWERED"
              ? { key: "pending", label: "Mark as Pending", icon: <Clock className="h-4 w-4" />, onClick: () => p.onMarkPending(q) }
              : {
                  key: "answered",
                  label: "Mark as Answered",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                  onClick: () => p.onMarkAnswered(q),
                  disabled: !htmlToText(q.answerHtml),
                },
          ]}
        />
      ),
    },
  ];

  const ids = p.rows.map((r) => r.id);
  return (
    <div className="overflow-hidden rounded-xl border border-dash">
      <DataTable
        columns={columns}
        data={p.rows}
        rowKey={(r) => r.id}
        onRowClick={p.onOpen}
        selectable
        selectedRowKeys={p.selected.filter((id) => ids.includes(id))}
        onSelectRow={(key, checked) => p.onSelectedChange(checked ? [...p.selected, String(key)] : p.selected.filter((id) => id !== key))}
        onSelectAll={(checked) => p.onSelectedChange(checked ? Array.from(new Set([...p.selected, ...ids])) : p.selected.filter((id) => !ids.includes(id)))}
        emptyMessage={p.emptyMessage}
        className="rounded-none border-0"
        minWidth="min-w-180"
      />
      {p.total > 0 && <TablePagination currentPage={p.page} totalCount={p.total} pageSize={QA_PAGE_SIZE} itemLabel="questions" onPageChange={p.onPageChange} />}
    </div>
  );
}

export default QaTable;
