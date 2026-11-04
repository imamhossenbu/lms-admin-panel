"use client";

import React from "react";
import Link from "next/link";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { timeAgo } from "@/lib/communityStats";
import type { ThreadListItem } from "@/lib/communityStorage";
import { CATEGORY_VIEW } from "../shared/CategoryBadge";
import { MemberAvatar } from "../shared/MemberAvatar";
import { RoleBadge } from "../shared/RoleBadge";
import { ThreadStatusBadges } from "../shared/ThreadStatusBadges";
import { ThreadRowActions, type ThreadRowHandlers } from "./ThreadRowActions";
import { courseTitleOf } from "./communityListUtils";

export interface CommunityTableProps {
  views: ThreadListItem[];
  handlers: ThreadRowHandlers;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: React.ReactNode;
  /** Pagination footer, rendered inside the bordered card. */
  footer?: React.ReactNode;
}

type Row = ThreadListItem & { id: string };

const num = (v: number) => <span className="body-sm-regular text-primary-500 tabular-nums">{v.toLocaleString()}</span>;

/** Table view: fixed layout + explicit widths so long titles truncate and it fits ~1200px without horizontal scroll. */
export function CommunityTable({ views, handlers, selectedIds, onSelectRow, onSelectAll, emptyMessage, footer }: CommunityTableProps) {
  const rows: Row[] = views.map((v) => ({ ...v, id: v.thread.id }));
  const columns: ColumnDef<Row>[] = [
    {
      key: "discussion",
      header: "Discussion",
      render: (r) => {
        const course = courseTitleOf(r.thread.courseId, r.courseTitle);
        const sub = `${course} · ${CATEGORY_VIEW[r.thread.category].label}`;
        return (
          <div className="min-w-0">
            <Link
              href={`/community/${r.thread.id}`}
              onClick={(e) => e.stopPropagation()}
              title={r.thread.title}
              className="block truncate body-sm-medium font-semibold! text-primary-500 transition-colors hover:text-brand-orange"
            >
              {r.thread.title}
            </Link>
            <p className="truncate body-xsm-regular text-primary-300" title={sub}>
              {sub}
            </p>
          </div>
        );
      },
    },
    {
      key: "author",
      header: "Author",
      width: "176px",
      render: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <MemberAvatar member={r.thread.author} size={28} />
          <div className="min-w-0">
            <p className="truncate body-sm-regular text-primary-500" title={r.thread.author.name}>
              {r.thread.author.name}
            </p>
            {r.thread.author.role !== "STUDENT" ? <RoleBadge role={r.thread.author.role} /> : <p className="body-xsm-regular text-primary-300">Student</p>}
          </div>
        </div>
      ),
    },
    { key: "replies", header: "Replies", width: "76px", align: "center", render: (r) => num(r.replyCount) },
    { key: "views", header: "Views", width: "72px", align: "center", render: (r) => num(r.thread.views) },
    {
      key: "activity",
      header: "Last Activity",
      width: "136px",
      render: (r) => {
        const by = r.lastReplier ?? r.thread.author;
        return (
          <div className="min-w-0">
            <p className="truncate body-sm-regular text-primary-500">{timeAgo(r.lastActivityAt)}</p>
            <p className="truncate body-xsm-regular text-primary-300" title={by.name}>
              by {by.name}
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "172px",
      render: (r) => <ThreadStatusBadges view={r} fallback={<span className="body-xsm-regular text-primary-300">Open</span>} />,
    },
    { key: "actions", header: "Actions", width: "64px", align: "center", render: (r) => <ThreadRowActions thread={r.thread} handlers={handlers} /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => handlers.onView(r.thread)}
        selectable
        selectedRowKeys={selectedIds}
        onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
        onSelectAll={onSelectAll}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-225"
        thClassName="px-3 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-3 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default CommunityTable;
