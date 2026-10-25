"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { CourseBadgeIcon } from "@/components/students/create/CourseBadgeIcon";
import { EnrollmentCourse } from "@/components/students/create/mockEnrollmentCourses";

interface AssignCoursesTableProps {
  courses: EnrollmentCourse[];
  selectedCourseIds: string[];
  onToggleSelect: (courseId: string) => void;
  onToggleAll: (checked: boolean) => void;
}

export function AssignCoursesTable({
  courses,
  selectedCourseIds,
  onToggleSelect,
  onToggleAll,
}: AssignCoursesTableProps) {
  const columns: ColumnDef<EnrollmentCourse>[] = [
    {
      key: "index",
      header: "#",
      width: "48px",
      align: "center",
      render: (_row, idx) => (
        <span className="body-xsm-medium text-primary-300">{idx + 1}</span>
      ),
    },
    {
      key: "title",
      header: "Course Title",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <CourseBadgeIcon type={row.iconType} />
          <span className="body-sm-medium text-primary-500 whitespace-nowrap">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="body-sm-regular text-blue whitespace-nowrap">
          {row.category}
        </span>
      ),
    },
    {
      key: "students",
      header: "Students",
      render: (row) => (
        <span className="body-sm-regular text-primary-400">{row.studentsCount}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.duration}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <span
          className={`body-sm-medium ${
            row.price.toLowerCase() === "free" ? "text-green" : "text-primary-500"
          }`}
        >
          {row.price}
        </span>
      ),
    },
  ];

  const visibleSelected = selectedCourseIds.filter((id) =>
    courses.some((c) => c.id === id)
  );

  return (
    <div className="rounded-lg border border-dash overflow-x-auto">
      <DataTable
        columns={columns}
        data={courses}
        rowKey={(row) => row.id}
        selectable
        selectedRowKeys={visibleSelected}
        onSelectRow={(key) => onToggleSelect(String(key))}
        onSelectAll={onToggleAll}
        onRowClick={(row) => onToggleSelect(row.id)}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
        cellClassName="px-3.5 py-3"
        emptyMessage="No courses match your search."
      />
    </div>
  );
}

export default AssignCoursesTable;
