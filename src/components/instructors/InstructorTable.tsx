"use client";

import React from "react";
import { Eye, Edit2 } from "lucide-react";
import { InstructorItem } from "@/types/instructor";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";

interface InstructorTableProps {
  instructors: InstructorItem[];
  onViewDetails: (instructor: InstructorItem) => void;
  onEdit: (instructor: InstructorItem) => void;
}

export function InstructorTable({
  instructors,
  onViewDetails,
  onEdit,
}: InstructorTableProps) {
  const columns: ColumnDef<InstructorItem>[] = [
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
      key: "instructor",
      header: "Instructor",
      render: (row) => (
        <div className="flex items-center gap-3 cursor-pointer group">
          <Avatar
            src={row.avatarUrl}
            name={row.name}
            size={36}
            className="rounded-full ring-1 ring-dash shrink-0"
          />
          <div className="min-w-0">
            <span className="body-sm-medium text-primary-500 font-bold group-hover:text-brand-orange transition-colors block truncate">
              {row.name}
            </span>
            <span className="body-2xsm-regular text-primary-300 block truncate">
              {row.expertise}
            </span>
          </div>
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
      key: "courses",
      header: "Courses",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.coursesCount}
        </span>
      ),
    },
    {
      key: "students",
      header: "Students",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.studentsCount}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Total Revenue",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.totalRevenue}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
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
      render: (row) => (
        <span className="body-sm-regular text-primary-400">
          {row.joinDate}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "90px",
      render: (row) => (
        // Stop clicks here from bubbling to the row's onRowClick (which opens details)
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewDetails(row)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-slate-100 text-primary-400 hover:text-primary-500 transition-colors cursor-pointer shadow-2xs"
            title={`View details for ${row.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(row)}
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
        data={instructors}
        rowKey={(row) => row.id}
        selectable={false}
        onRowClick={(row) => onViewDetails(row)}
        verticalBorders={true}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-[#F1F3F5] border-b border-dash body-sm-medium text-primary-500 font-semibold normal-case"
        thClassName="px-3.5 py-3 text-primary-500 font-semibold normal-case text-[13.5px]"
        cellClassName="px-3.5 py-3.5 cursor-pointer"
        emptyMessage="No instructors found matching your criteria."
      />
    </div>
  );
}

export default InstructorTable;
