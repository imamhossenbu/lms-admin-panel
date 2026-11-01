"use client";

import React from "react";
import type { LiveEnrollment } from "@/types/liveClass";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { formatClock, watchProgress } from "@/lib/liveClassStats";
import { formatIsoDate } from "../../liveDetailFormat";
import { StudentCell } from "../../common/StudentCell";
import { AttendanceBadge } from "../../common/AttendanceBadge";
import { ProgressCell } from "../../common/ProgressCell";
import { EnrollmentRowActions } from "../../common/EnrollmentRowActions";

export interface StudentsTableProps {
  rows: LiveEnrollment[];
  offset: number;
  durationMin: number;
  happened: boolean;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const dash = <span className="text-primary-300">-</span>;

/** #, student, email, enrollment date, attendance, join / leave, progress, ⋯. */
export function StudentsTable({ rows, offset, durationMin, happened, selectedIds, onSelectRow, onSelectAll }: StudentsTableProps) {
  const columns: ColumnDef<LiveEnrollment>[] = [
    { key: "index", header: "#", width: "w-12", align: "center", render: (_, i) => <span className="body-sm-medium">{offset + i + 1}</span> },
    { key: "student", header: "Student", render: (r) => <StudentCell student={r.student} /> },
    { key: "email", header: "Email", render: (r) => <span className="whitespace-nowrap text-primary-400">{r.student.email}</span> },
    { key: "enrolledAt", header: "Enrollment Date", render: (r) => <span className="whitespace-nowrap">{formatIsoDate(r.enrolledAt)}</span> },
    { key: "status", header: "Attendance Status", render: (r) => (happened ? <AttendanceBadge status={r.status} /> : dash) },
    { key: "join", header: "Join Time", render: (r) => (happened && r.joinTime ? <span className="whitespace-nowrap">{formatClock(r.joinTime)}</span> : dash) },
    { key: "leave", header: "Leave Time", render: (r) => (happened && r.leaveTime ? <span className="whitespace-nowrap">{formatClock(r.leaveTime)}</span> : dash) },
    { key: "progress", header: "Progress", render: (r) => <ProgressCell value={watchProgress(r, durationMin)} muted={!happened} /> },
    { key: "actions", header: "Actions", align: "center", render: (r) => <EnrollmentRowActions row={r} canMark={happened} /> },
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
      minWidth="min-w-260"
      emptyMessage="No students match your filters."
    />
  );
}

export default StudentsTable;
