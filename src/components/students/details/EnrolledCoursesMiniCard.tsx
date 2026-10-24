"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { CourseBadgeIcon } from "../create/CourseBadgeIcon";
import { EnrolledCourseDetail } from "./mockStudentDetails";

interface EnrolledCoursesMiniCardProps {
  courses: EnrolledCourseDetail[];
  onViewAll?: () => void;
  onViewCourse?: (course: EnrolledCourseDetail) => void;
}

export function EnrolledCoursesMiniCard({
  courses,
  onViewAll,
  onViewCourse,
}: EnrolledCoursesMiniCardProps) {
  // Show first 3 courses
  const miniCourses = courses.slice(0, 3);

  const columns: ColumnDef<EnrolledCourseDetail>[] = [
    {
      key: "number",
      header: "#",
      width: "48px",
      align: "center",
      render: (row) => (
        <span className="body-xsm-medium text-primary-300">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <CourseBadgeIcon type={row.iconType} size="sm" />
          <span className="body-sm-medium text-primary-500 font-semibold truncate max-w-[220px] xl:max-w-[280px]">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      render: (row) => {
        const barColor =
          row.progress >= 70
            ? "bg-[#10B981]"
            : row.progress >= 50
            ? "bg-blue"
            : "bg-[#F97316]";

        return (
          <div className="flex items-center gap-2 min-w-[95px]">
            <span className="body-xsm-medium font-semibold text-primary-500 w-7">
              {row.progress}%
            </span>
            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full`}
                style={{ width: `${row.progress}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] whitespace-nowrap shrink-0">
          {row.status}
        </span>
      ),
    },
    {
      key: "enrolledDate",
      header: "Enrolled On",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.enrolledDate}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (row) => (
        <button
          type="button"
          onClick={() => onViewCourse?.(row)}
          className="px-3 py-1 rounded-md border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="title-medium font-bold text-primary-500">
            Enrolled Courses ({courses.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Mini Data Table with Column-wise Borders */}
      <DataTable
        columns={columns}
        data={miniCourses}
        verticalBorders={true}
        containerClassName="border-dash rounded-lg"
        tableClassName="border-collapse"
      />
    </div>
  );
}
