"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { InstructorCell } from "../shared/InstructorCell";
import { LiveStatusBadge } from "../shared/LiveStatusBadge";
import { PlatformBadge } from "../shared/PlatformBadge";
import { AttendeesCell, ClassTitleCell, DateTimeCell } from "./LiveClassCells";
import { LiveClassRowActions, type LiveClassRowHandlers } from "./LiveClassRowActions";
import type { DateSort, LiveClassRow } from "./liveListUtils";

export interface LiveClassesTableProps {
  rows: LiveClassRow[];
  handlers: LiveClassRowHandlers;
  dateSort: DateSort;
  onDateSortClick: () => void;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: React.ReactNode;
  footer?: React.ReactNode;
}

/** Compact live classes table (fits ~1280px): Class (+course), Instructor, Date & Time, Attendees, Status, Platform, ⋮. */
export function LiveClassesTable({
  rows,
  handlers,
  dateSort,
  onDateSortClick,
  selectedIds,
  onSelectRow,
  onSelectAll,
  emptyMessage,
  footer,
}: LiveClassesTableProps) {
  const columns: ColumnDef<LiveClassRow>[] = [
    { key: "class", header: "Class", render: (r) => <ClassTitleCell item={r.item} courseTitle={r.courseTitle} /> },
    { key: "instructor", header: "Instructor", width: "160px", render: (r) => <InstructorCell instructorId={r.item.instructorId} size={28} /> },
    {
      key: "date",
      header: "Date & Time",
      width: "164px",
      sortDirection: dateSort,
      onHeaderClick: onDateSortClick,
      render: (r) => <DateTimeCell item={r.item} />,
    },
    {
      key: "attendees",
      header: "Attendees",
      width: "104px",
      render: (r) => <AttendeesCell attendees={r.attendees} capacity={r.item.capacity} status={r.status} />,
    },
    { key: "status", header: "Status", width: "112px", render: (r) => <LiveStatusBadge status={r.status} size="sm" /> },
    { key: "platform", header: "Platform", width: "150px", render: (r) => <PlatformBadge platform={r.item.platform} /> },
    { key: "actions", header: "Actions", align: "center", width: "72px", render: (r) => <LiveClassRowActions liveClass={r.item} handlers={handlers} /> },
  ];

  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => handlers.onView(r.item)}
        selectable
        selectedRowKeys={selectedIds}
        onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
        onSelectAll={onSelectAll}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-240"
        thClassName="px-3 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-3 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default LiveClassesTable;
