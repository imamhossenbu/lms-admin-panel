"use client";

import React from "react";
import { Users } from "lucide-react";
import { ColumnDef } from "@/components/ui/Datatable";
import { InstructorDetailCard } from "../InstructorDetailCard";
import { InstructorStudentRow } from "../instructorDetailsData";
import { StatusPill } from "../StatusPill";
import { CompactTable } from "./CompactTable";
import { ViewAllButton } from "./RecentCoursesCard";

interface RecentStudentsCardProps {
  students: InstructorStudentRow[];
  onViewAll: () => void;
}

export function RecentStudentsCard({ students, onViewAll }: RecentStudentsCardProps) {
  const columns: ColumnDef<InstructorStudentRow>[] = [
    {
      key: "index",
      header: "#",
      width: "40px",
      render: (_row, idx) => <span className="body-sm-regular text-primary-400">{idx + 1}</span>,
    },
    {
      key: "name",
      header: "Student Name",
      render: (row) => <span className="body-sm-medium text-primary-500 whitespace-nowrap">{row.name}</span>,
    },
    {
      key: "course",
      header: "Course",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.course.title}</span>,
    },
    {
      key: "enrolledOn",
      header: "Enrolled On",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.enrolledOn}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill status={row.status} size="sm" />,
    },
  ];

  return (
    <InstructorDetailCard icon={<Users />} title="Recent Students" action={<ViewAllButton onClick={onViewAll} />}>
      <CompactTable columns={columns} data={students.slice(0, 5)} emptyMessage="No students enrolled yet." />
    </InstructorDetailCard>
  );
}

export default RecentStudentsCard;
