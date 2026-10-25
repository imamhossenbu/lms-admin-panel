"use client";

import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TablePagination } from "@/components/ui/TablePagination";
import { useUrlParams } from "@/lib/useUrlParams";
import { DetailCard } from "@/components/ui/DetailCard";
import { InstructorCourseRow } from "./instructorDetailsData";
import { CourseThumb } from "./CourseThumb";
import { StatusPill } from "./StatusPill";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { TabFilterBar } from "./TabFilterBar";

const PAGE_SIZE = 8;

interface InstructorCoursesTabProps {
  courses: InstructorCourseRow[];
  onAssignCourse: () => void;
  getCourseActions: (course: InstructorCourseRow) => DropdownActionItem[];
}

export function InstructorCoursesTab({ courses, onAssignCourse, getCourseActions }: InstructorCoursesTabProps) {
  const { get, getPage, set } = useUrlParams();
  const query = get("q");
  const category = get("category", "All");
  const status = get("status", "All");
  const page = getPage();

  const categoryOptions = useMemo(
    () => [
      { value: "All", label: "All Categories" },
      ...Array.from(new Set(courses.map((c) => c.category))).map((c) => ({ value: c, label: c })),
    ],
    [courses]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return courses.filter(
      (c) =>
        (!q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)) &&
        (category === "All" || c.category === category) &&
        (status === "All" || c.status === status)
    );
  }, [courses, query, category, status]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ColumnDef<InstructorCourseRow>[] = [
    {
      key: "index",
      header: "#",
      width: "52px",
      align: "center",
      render: (_row, idx) => (
        <span className="body-sm-regular text-primary-400">{(page - 1) * PAGE_SIZE + idx + 1}</span>
      ),
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-60">
          <CourseThumb course={row} size="lg" />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500">{row.title}</p>
            <p className="body-xsm-regular text-primary-300 truncate">{row.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <ToneBadge tone="blue">{row.category}</ToneBadge>,
    },
    {
      key: "students",
      header: "Students",
      render: (row) => <span className="body-sm-regular text-primary-400">{row.studentsCount}</span>,
    },
    {
      key: "duration",
      header: "Duration",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.duration}</span>,
    },
    {
      key: "price",
      header: "Price",
      render: (row) => <span className="body-sm-regular text-primary-400">{row.price}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: "assignedOn",
      header: "Assigned On",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.assignedOn}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "80px",
      render: (row) => <RowMoreMenu items={getCourseActions(row)} />,
    },
  ];

  return (
    <DetailCard
      title={`Courses (${courses.length})`}
      description="Courses assigned to this instructor. You can add or remove courses from here."
      action={
        <PrimaryButton type="button" onClick={onAssignCourse} leftIcon={<Plus className="w-4 h-4" />}>
          Assign Course
        </PrimaryButton>
      }
      bodyClassName="space-y-5"
    >
      <TabFilterBar
        search={{
          value: query,
          placeholder: "Search courses...",
          onChange: (q) => set({ q, page: null }),
        }}
        filters={[
          {
            key: "category",
            value: category,
            options: categoryOptions,
            onChange: (value) => set({ category: value, page: null }),
          },
          {
            key: "status",
            value: status,
            options: [
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Draft", label: "Draft" },
            ],
            onChange: (value) => set({ status: value, page: null }),
          },
        ]}
      />

      <div className="rounded-lg border border-dash overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={rows}
            rowKey={(row) => row.id}
            verticalBorders
            containerClassName="border-0 rounded-none"
            headerClassName="bg-slate-50 border-b border-dash"
            thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
            cellClassName="px-3.5 py-3"
            emptyMessage={
              courses.length === 0
                ? "No courses assigned yet. Use “Assign Course” to add some."
                : "No courses match your filters."
            }
          />
        </div>
        <TablePagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={filtered.length}
          itemLabel="courses"
          onPageChange={(next) => set({ page: next })}
        />
      </div>
    </DetailCard>
  );
}

export default InstructorCoursesTab;
