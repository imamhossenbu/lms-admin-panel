"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardEnrollment } from "@/types/dashboard";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";

interface RecentEnrollmentsTableProps {
  enrollments: DashboardEnrollment[];
}

const columns: ColumnDef<DashboardEnrollment>[] = [
  {
    key: "student",
    header: "Student",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={row.student.avatarUrl}
            alt={row.student.name}
            fill
            sizes="28px"
            className="object-cover"
            unoptimized
          />
        </div>
        <span className="body-sm-medium text-primary-500 font-medium truncate max-w-[130px]">
          {row.student.name}
        </span>
      </div>
    ),
  },
  {
    key: "course",
    header: "Course",
    render: (row) => (
      <span className="body-sm-regular text-primary-400">
        {row.course}
      </span>
    ),
  },
  {
    key: "progress",
    header: "Progress",
    render: (row) => (
      <div className="flex items-center gap-3 max-w-[130px]">
        <span className="body-xsm-medium text-primary-500 w-8 font-semibold">
          {row.progress}%
        </span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-orange rounded-full transition-all duration-500"
            style={{ width: `${row.progress}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    key: "enrolledAt",
    header: "Enrolled At",
    render: (row) => (
      <span className="body-sm-regular text-primary-300 whitespace-nowrap">
        {row.enrolledAt}
      </span>
    ),
  },
];

export function RecentEnrollmentsTable({
  enrollments,
}: RecentEnrollmentsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-dash shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="heading-h5 font-bold text-primary-500">
          Recent Enrollments
        </h3>
        <Link
          href="/students"
          className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Edge-to-Edge DataTable */}
      <div className="w-full border-t border-dash overflow-x-auto">
        <DataTable
          columns={columns}
          data={enrollments}
          verticalBorders={false}
          containerClassName="border-0 rounded-none w-full"
          tableClassName="w-full"
          headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
          thClassName="px-5 py-3 border-none"
          cellClassName="px-5 py-3.5 border-none"
        />
      </div>
    </div>
  );
}
