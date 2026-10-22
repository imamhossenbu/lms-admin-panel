"use client";

import React, { useState } from "react";
import { Eye, Edit2, MoreHorizontal } from "lucide-react";
import { StudentItem } from "@/types/student";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";

interface StudentTableProps {
  students: StudentItem[];
  selectedStudentIds: string[];
  onSelectStudent: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onViewDetails: (student: StudentItem) => void;
  onEdit: (student: StudentItem) => void;
}

export function StudentTable({
  students,
  selectedStudentIds,
  onSelectStudent,
  onSelectAll,
  onViewDetails,
  onEdit,
}: StudentTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const columns: ColumnDef<StudentItem>[] = [
    {
      key: "number",
      header: "#",
      width: "48px",
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
      width: "68px",
      align: "center",
      render: (row) => (
        <div className="relative flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === row.id ? null : row.id);
            }}
            className="p-1.5 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {activeMenuId === row.id && (
            <div
              className="absolute right-0 top-8 mt-1 w-36 bg-white rounded-xl shadow-xl border border-dash py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onViewDetails(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-primary-400" />
                <span>View Details</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onEdit(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-primary-400" />
                <span>Edit Info</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      className="w-full overflow-x-auto text-left"
      onClick={() => setActiveMenuId(null)}
    >
      <DataTable
        columns={columns}
        data={students}
        rowKey={(row) => row.id}
        selectable={true}
        selectedRowKeys={selectedStudentIds}
        onSelectRow={(key, checked) => onSelectStudent(String(key), checked)}
        onSelectAll={onSelectAll}
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
