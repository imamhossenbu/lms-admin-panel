"use client";

import React from "react";
import { Eye, Edit2 } from "lucide-react";
import { StudentItem } from "@/types/student";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";

interface StudentTableProps {
  students: StudentItem[];
  onViewDetails: (student: StudentItem) => void;
  onEdit: (student: StudentItem) => void;
}

export function StudentTable({
  students,
  onViewDetails,
  onEdit,
}: StudentTableProps) {
  const columns: ColumnDef<StudentItem>[] = [
    {
      key: "number",
      header: "#",
      width: "52px",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-400">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "student",
      header: "Student",
      render: (row) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onViewDetails(row)}
        >
          <Avatar
            src={row.avatarUrl}
            name={row.name}
            size={32}
            className="rounded-full ring-1 ring-dash shrink-0"
          />
          <span className="body-sm-medium text-primary-500 font-bold group-hover:text-brand-orange transition-colors">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 font-mono text-[13px]">
          {row.email}
        </span>
      ),
    },
    {
      key: "enrolledCourses",
      header: "Enrolled Courses",
      width: "140px",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.enrolledCoursesCount}
        </span>
      ),
    },
    {
      key: "completed",
      header: "Completed",
      width: "150px",
      render: (row) => {
        const isFinished = row.completionRate >= 100;
        const isZero = row.completionRate === 0;

        return (
          <div className="space-y-1.5 w-full max-w-[130px]">
            <span className="body-2xsm-regular text-primary-500 font-medium block">
              {row.completedCoursesCount} ({row.completionRate}%)
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isZero
                    ? "bg-transparent"
                    : isFinished || row.completionRate >= 75
                    ? "bg-[#0dc34a]"
                    : "bg-[#2570fc]"
                }`}
                style={{ width: `${row.completionRate}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      align: "center",
      render: (row) => (
        <ToneBadge
          tone={row.status === "Active" ? "green" : "red"}
          size="sm"
        >
          {row.status}
        </ToneBadge>
      ),
    },
    {
      key: "joinDate",
      header: "Join Date",
      width: "120px",
      align: "center",
      render: (row) => (
        <span className="body-sm-regular text-primary-300 whitespace-nowrap">
          {row.joinDate}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "80px",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {/* View Details Icon Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(row);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-slate-100 text-primary-400 hover:text-primary-600 transition-colors cursor-pointer shadow-2xs"
            title={`View details for ${row.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Edit Student Icon Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-brand-orange-light text-primary-400 hover:text-brand-orange hover:border-brand-orange/40 transition-colors cursor-pointer shadow-2xs"
            title={`Edit info for ${row.name}`}
          >
            <Edit2 className="w-3.5 h-3.5 text-brand-orange" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto text-left">
      <DataTable
        columns={columns}
        data={students}
        rowKey={(row) => row.id}
        selectable={false}
        onRowClick={(row) => onViewDetails(row)}
        verticalBorders={true}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-[#F1F3F5] border-b border-dash body-sm-medium text-primary-500 font-semibold normal-case"
        thClassName="px-3.5 py-3 text-primary-500 font-semibold normal-case text-[13.5px]"
        cellClassName="px-3.5 py-3.5 cursor-pointer"
      />
    </div>
  );
}

export default StudentTable;
