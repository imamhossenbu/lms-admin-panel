"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { AdminCourseItem } from "@/lib/types";
import { COURSE_LEVEL_LABEL, COURSE_STATUS_VIEW, coursePriceLabel } from "@/lib/courseView";
import { DEFAULT_FALLBACK_BANNER } from "../constants";

interface CoursesTableProps {
  courses: AdminCourseItem[];
  onView: (course: AdminCourseItem) => void;
  getMenuItems: (course: AdminCourseItem) => DropdownActionItem[];
  /** Rendered inside the table card, under the rows (pagination). */
  footer?: React.ReactNode;
}

export function CoursesTable({ courses, onView, getMenuItems, footer }: CoursesTableProps) {
  const columns: ColumnDef<AdminCourseItem>[] = [
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-64">
          <span className="relative w-16 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <Image src={row.thumbnail || DEFAULT_FALLBACK_BANNER} alt="" fill unoptimized className="object-cover" />
          </span>
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate">{row.title}</p>
            <p className="body-xsm-regular text-primary-300 truncate">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "instructor",
      header: "Instructor",
      render: (row) =>
        row.instructorName ? (
          <div className="flex items-center gap-2 min-w-36">
            <Avatar src={row.instructorAvatar} name={row.instructorName} size={28} />
            <span className="body-sm-regular text-primary-500 truncate">{row.instructorName}</span>
          </div>
        ) : (
          <span className="body-sm-regular text-primary-300">Unassigned</span>
        ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <ToneBadge tone="blue">{row.category?.name ?? "Uncategorized"}</ToneBadge>,
    },
    {
      key: "level",
      header: "Level",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.level ? COURSE_LEVEL_LABEL[row.level] : "—"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) =>
        coursePriceLabel(row) === "Free" ? (
          <ToneBadge tone="green">Free</ToneBadge>
        ) : (
          <span className="body-sm-medium text-primary-500">{coursePriceLabel(row)}</span>
        ),
    },
    {
      key: "students",
      header: "Students",
      align: "center",
      render: (row) => <span className="body-sm-regular text-primary-500">{(Number(row.totalStudents) || 0).toLocaleString()}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) =>
        Number(row.ratingAverage) > 0 ? (
          <span className="inline-flex items-center gap-1 body-sm-medium text-primary-500">
            <Star className="w-3.5 h-3.5 text-yellow fill-current" />
            {Number(row.ratingAverage).toFixed(1)}
          </span>
        ) : (
          <span className="body-sm-regular text-primary-300">No ratings</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <ToneBadge tone={COURSE_STATUS_VIEW[row.status]?.tone ?? "gray"}>{COURSE_STATUS_VIEW[row.status]?.label ?? row.status}</ToneBadge>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "76px",
      render: (row) => <RowMoreMenu label={`Actions for ${row.title}`} items={getMenuItems(row)} />,
    },
  ];

  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={courses}
          rowKey={(row) => row.id}
          onRowClick={onView}
          verticalBorders
          containerClassName="border-0 rounded-none"
          headerClassName="bg-slate-50 border-b border-dash"
          thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
          cellClassName="px-3.5 py-3"
          emptyMessage="No courses match your filters."
        />
      </div>
      {footer}
    </div>
  );
}

export default CoursesTable;
