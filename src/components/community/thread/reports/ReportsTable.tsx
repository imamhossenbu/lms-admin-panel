"use client";

import React from "react";
import { Eye, ShieldAlert } from "lucide-react";
import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";
import { timeAgo } from "@/lib/communityStats";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MemberAvatar } from "../../shared/MemberAvatar";
import { REPORT_REASON_META, REPORT_STATUS_META, excerpt, exactDate, shortDate } from "../threadFormat";

export interface ReportsTableProps {
  thread: CommunityThread;
  replies: ThreadReply[];
  reports: ThreadReport[];
  onReview: (report: ThreadReport) => void;
}

/** Reports table (fixed layout, vertical borders): reported content, reason, reporter, note, date, status, Review. */
export function ReportsTable({ thread, replies, reports, onReview }: ReportsTableProps) {
  const replyOf = (id: string) => replies.find((r) => r.id === id);

  const columns: ColumnDef<ThreadReport>[] = [
    {
      key: "target",
      header: "Reported",
      width: "26%",
      render: (r) => {
        const reply = r.targetType === "REPLY" ? replyOf(r.targetId) : undefined;
        const label = r.targetType === "THREAD" ? "Discussion" : reply ? `Reply by ${reply.author.name}` : "Deleted reply";
        const text = r.targetType === "THREAD" ? thread.title : reply ? (reply.isRemoved ? "Removed by a moderator" : excerpt(reply.bodyHtml, 70)) : "This reply no longer exists.";
        return (
          <div className="min-w-0">
            <p className="truncate body-xsm-medium text-primary-300">{label}</p>
            <p title={text} className="mt-0.5 truncate body-sm-medium text-primary-500">
              {text}
            </p>
          </div>
        );
      },
    },
    {
      key: "reason",
      header: "Reason",
      width: "12%",
      render: (r) => <ToneBadge tone={REPORT_REASON_META[r.reason].tone}>{REPORT_REASON_META[r.reason].label}</ToneBadge>,
    },
    {
      key: "reporter",
      header: "Reporter",
      width: "18%",
      render: (r) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <MemberAvatar member={r.reporter} size={30} />
          <span className="truncate body-sm-medium text-primary-500">{r.reporter.name}</span>
        </span>
      ),
    },
    {
      key: "note",
      header: "Note",
      render: (r) => (
        <span title={r.note || undefined} className="block truncate body-sm-regular text-primary-400">
          {r.note || "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      width: "13%",
      render: (r) => (
        <div title={exactDate(r.createdAt)} className="min-w-0">
          <p className="truncate body-sm-regular text-primary-500">{shortDate(r.createdAt)}</p>
          <p className="truncate body-xsm-regular text-primary-300">{timeAgo(r.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "11%",
      render: (r) => (
        <ToneBadge tone={REPORT_STATUS_META[r.status].tone} dot>
          {REPORT_STATUS_META[r.status].label}
        </ToneBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "112px",
      align: "center",
      render: (r) => (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <CardActionButton icon={r.status === "OPEN" ? <ShieldAlert /> : <Eye />} onClick={() => onReview(r)} className={r.status === "OPEN" ? "text-red" : undefined}>
            {r.status === "OPEN" ? "Review" : "View"}
          </CardActionButton>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={reports}
      rowKey={(r) => r.id}
      onRowClick={onReview}
      tableClassName="table-fixed"
      minWidth="min-w-240"
      emptyMessage="No reports match this filter."
    />
  );
}

export default ReportsTable;
