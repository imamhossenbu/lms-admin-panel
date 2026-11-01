"use client";

import React from "react";
import type { LiveEnrollment } from "@/types/liveClass";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { formatClock, formatMinutes } from "@/lib/liveClassStats";
import { StudentCell } from "../../common/StudentCell";
import { AttendanceBadge } from "../../common/AttendanceBadge";
import { EnrollmentRowActions } from "../../common/EnrollmentRowActions";

export interface AttendanceTableProps {
  rows: LiveEnrollment[];
  offset: number;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const dash = <span className="text-primary-300">-</span>;

/** #, student, email, join / leave, watch duration, status, ⋯. */
export function AttendanceTable({ rows, offset, selectedIds, onSelectRow, onSelectAll }: AttendanceTableProps) {
  const columns: ColumnDef<LiveEnrollment>[] = [
    { key: "index", header: "#", width: "w-12", align: "center", render: (_, i) => <span className="body-sm-medium">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (r) => <StudentCell student={r.student} /> },
    { key: "email", header: "Email", render: (r) => <span className="whitespace-nowrap text-primary-400">{r.student.email}</span> },
    { key: "join", header: "Join Time", render: (r) => (r.joinTime ? <span className="whitespace-nowrap">{formatClock(r.joinTime)}</span> : dash) },
    { key: "leave", header: "Leave Time", render: (r) => (r.leaveTime ? <span className="whitespace-nowrap">{formatClock(r.leaveTime)}</span> : r.joinTime ? <span className="text-green">In class</span> : dash) },
    { key: "watch", header: "Watch Duration", render: (r) => (r.status === "ATTENDED" ? <span className="whitespace-nowrap">{formatMinutes(r.watchMinutes)}</span> : dash) },
    { key: "status", header: "Status", render: (r) => <AttendanceBadge status={r.status} /> },
    { key: "actions", header: "Actions", align: "center", render: (r) => <EnrollmentRowActions row={r} canMark /> },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      rowKey={(r) => r.id}
      selectable
      selectedRowKeys={selectedIds}
      onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
      onSelectAll={onSelectAll}
      minWidth="min-w-220"
      emptyMessage="No students match your filters."
    />
  );
}

export default AttendanceTable;
