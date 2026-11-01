"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { formatShortDate, type RecentEnrollmentRow } from "@/lib/analytics";

interface RecentEnrollmentsTableProps {
  /** Newest enrollments (paid order courses) in the range (recentEnrollments). */
  enrollments: RecentEnrollmentRow[];
}

const columns: ColumnDef<RecentEnrollmentRow>[] = [
  {
    key: "student",
    header: "Student",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Avatar src={row.avatarUrl} name={row.studentName} size={24} />
        <span className="body-sm-medium text-primary-500 truncate max-w-27.5">{row.studentName}</span>
      </div>
    ),
  },
  {
    key: "course",
    header: "Course",
    render: (row) => <span className="body-sm-regular text-primary-400 truncate max-w-32.5 block">{row.course}</span>,
  },
  {
    key: "progress",
    header: "Progress",
    render: (row) => (
      <div className="flex items-center gap-2.5 max-w-30">
        <span className="body-2xsm-regular text-primary-500 w-7">{row.progress}%</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${row.progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    ),
  },
  {
    key: "enrolledAt",
    header: "Enrolled At",
    render: (row) => <span className="body-sm-regular text-primary-300 whitespace-nowrap">{formatShortDate(row.enrolledAt)}</span>,
  },
];

export function RecentEnrollmentsTable({ enrollments }: RecentEnrollmentsTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-dash shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="heading-h6 text-primary-500">Recent Enrollments</h3>
        <Link
          href="/students"
          className="body-sm-medium text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Edge-to-Edge DataTable */}
      <div className="w-full border-t border-dash overflow-x-auto">
        <DataTable
          columns={columns}
          data={enrollments}
          onRowClick={(row) => router.push(`/students/${row.studentId}`)}
          emptyMessage="No enrollments in this period"
          containerClassName="border-0 rounded-none w-full"
          tableClassName="w-full"
          headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 uppercase tracking-wider"
          thClassName="px-4 py-2.5 border-none"
          cellClassName="px-4 py-2.5 border-none"
        />
      </div>
    </div>
  );
}
