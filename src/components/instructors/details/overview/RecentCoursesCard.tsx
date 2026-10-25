"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { InstructorDetailCard } from "../InstructorDetailCard";
import { InstructorCourseRow } from "../instructorDetailsData";
import { CourseThumb } from "../CourseThumb";
import { StatusPill } from "../StatusPill";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { CompactTable } from "./CompactTable";

interface RecentCoursesCardProps {
  courses: InstructorCourseRow[];
  onViewAll: () => void;
  onViewCourse: (course: InstructorCourseRow) => void;
  getCourseActions: (course: InstructorCourseRow) => DropdownActionItem[];
}

export function RecentCoursesCard({ courses, onViewAll, onViewCourse, getCourseActions }: RecentCoursesCardProps) {
  const columns: ColumnDef<InstructorCourseRow>[] = [
    {
      key: "index",
      header: "#",
      width: "40px",
      render: (_row, idx) => <span className="body-sm-regular text-primary-400">{idx + 1}</span>,
    },
    {
      key: "title",
      header: "Course Title",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <CourseThumb course={row} size="sm" />
          <span className="body-sm-medium text-primary-500 whitespace-nowrap">{row.title}</span>
        </div>
      ),
    },
    {
      key: "students",
      header: "Enrolled Students",
      render: (row) => <span className="body-sm-regular text-primary-400">{row.studentsCount}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill status={row.status} size="sm" />,
    },
    {
      key: "assignedOn",
      header: "Created On",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.assignedOn}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewCourse(row)}
            className="h-7 px-3 rounded-lg border border-dash bg-white body-xsm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer"
          >
            View
          </button>
          <RowMoreMenu items={getCourseActions(row)} size="sm" />
        </div>
      ),
    },
  ];

  return (
    <InstructorDetailCard
      icon={<BookOpen />}
      title="Recent Courses"
      action={<ViewAllButton onClick={onViewAll} />}
    >
      <CompactTable
        columns={columns}
        data={courses.slice(0, 5)}
        onRowClick={onViewCourse}
        emptyMessage="No courses assigned yet."
      />
    </InstructorDetailCard>
  );
}

export function ViewAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 px-4 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer whitespace-nowrap"
    >
      View All
    </button>
  );
}

export default RecentCoursesCard;
