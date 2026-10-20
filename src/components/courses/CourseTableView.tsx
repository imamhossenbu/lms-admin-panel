"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { RowActionButton } from "@/components/ui/RowActionButton";
import { AdminCourseItem } from "@/lib/types";
import {
  Sparkles,
  Layers,
  Edit3,
  Trash2,
  Users,
  Star,
} from "lucide-react";
import { SVG_FALLBACK } from "./constants";

function CourseTableRowActions({
  course,
  onManageCurriculum,
  onOpenAiOutline,
  onEditCourse,
  onDeleteCourse,
}: {
  course: AdminCourseItem;
  onManageCurriculum: (course: AdminCourseItem) => void;
  onOpenAiOutline: (course: AdminCourseItem) => void;
  onEditCourse: (course: AdminCourseItem) => void;
  onDeleteCourse: (course: AdminCourseItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <RowActionButton
        ref={buttonRef}
        label="Actions"
        onClick={() => setOpen((v) => !v)}
      />
      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={buttonRef.current}
        items={[
          {
            label: "Manage Curriculum & Lessons",
            icon: <Layers className="w-4 h-4 text-[#1C4D8D]" />,
            onClick: () => {
              setOpen(false);
              onManageCurriculum(course);
            },
          },
          {
            label: "AI Auto-Syllabus Generator",
            icon: <Sparkles className="w-4 h-4 text-purple-600" />,
            onClick: () => {
              setOpen(false);
              onOpenAiOutline(course);
            },
          },
          {
            label: "Edit Course Metadata",
            icon: <Edit3 className="w-4 h-4 text-primary-400" />,
            onClick: () => {
              setOpen(false);
              onEditCourse(course);
            },
          },
          {
            label: "Delete Course",
            icon: <Trash2 className="w-4 h-4 text-rose-500" />,
            className: "text-rose-600 hover:bg-rose-50",
            onClick: () => {
              setOpen(false);
              onDeleteCourse(course);
            },
          },
        ]}
      />
    </div>
  );
}

interface CourseTableViewProps {
  courses: AdminCourseItem[];
  onViewDetails: (course: AdminCourseItem) => void;
  onEditCourse: (course: AdminCourseItem) => void;
  onManageCurriculum: (course: AdminCourseItem) => void;
  onOpenAiOutline: (course: AdminCourseItem) => void;
  onDeleteCourse: (course: AdminCourseItem) => void;
}

export function CourseTableView({
  courses,
  onViewDetails,
  onEditCourse,
  onManageCurriculum,
  onOpenAiOutline,
  onDeleteCourse,
}: CourseTableViewProps) {
  const columns: ColumnDef<AdminCourseItem>[] = [
    {
      header: "Course & Curriculum",
      accessorKey: "title",
      cell: (row) => {
        const banner =
          row.thumbnail ||
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop";

        return (
          <div
            onClick={() => onViewDetails(row)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-16 h-10 rounded-[6px] overflow-hidden bg-slate-900 border border-[#EDEDED] shrink-0">
              <Image
                src={banner}
                alt={row.title}
                fill
                unoptimized
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = SVG_FALLBACK;
                }}
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="64px"
              />
            </div>
            <div className="min-w-0">
              <span className="body-sm-medium text-primary-500 font-bold group-hover:text-[#1C4D8D] transition-colors block truncate max-w-xs">
                {row.title}
              </span>
              <span className="body-xsm-regular subtext-500 block truncate max-w-xs">
                {row.instructorName ? `By ${row.instructorName}` : row.slug}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => (
        <TagBadge
          tag={row.category?.name || "General"}
          bgColor="bg-[#F8F9FA] border border-[#EDEDED]"
          textColor="text-primary-500 font-semibold"
        />
      ),
    },
    {
      header: "Enrollments",
      accessorKey: "totalStudents",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-primary-500 body-sm-regular">
          <Users className="w-3.5 h-3.5 text-primary-300" />
          <span>{row.totalStudents?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      header: "Rating",
      accessorKey: "ratingAverage",
      cell: (row) => (
        <div className="flex items-center gap-1 text-primary-500 body-sm-medium">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{row.ratingAverage > 0 ? row.ratingAverage : "5.0"}</span>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.isFree ? "Free" : `$${row.price}`}
        </span>
      ),
    },
    {
      header: "Level",
      accessorKey: "level",
      cell: (row) => (
        <span className="body-xsm-regular text-primary-400">
          {row.level || "Intermediate"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <ToneBadge
          tone={row.status === "PUBLISHED" ? "success" : "orange"}
          size="sm"
        >
          {row.status}
        </ToneBadge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <CourseTableRowActions
            course={row}
            onManageCurriculum={onManageCurriculum}
            onOpenAiOutline={onOpenAiOutline}
            onEditCourse={onEditCourse}
            onDeleteCourse={onDeleteCourse}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[12px] border border-[#EDEDED] bg-white overflow-hidden shadow-xs">
      <DataTable
        data={courses}
        columns={columns}
      />
    </div>
  );
}
