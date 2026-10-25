"use client";

import React, { useMemo, useState } from "react";
import { Download, Mail, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
import { useUrlParams } from "@/lib/useUrlParams";
import { DetailCard } from "@/components/ui/DetailCard";
import { InstructorCourseRow, InstructorStudentRow } from "./instructorDetailsData";
import { CourseThumb } from "./CourseThumb";
import { StatusPill } from "./StatusPill";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { TabFilterBar } from "./TabFilterBar";

const PAGE_SIZE = 8;

interface InstructorStudentsTabProps {
  instructorName: string;
  students: InstructorStudentRow[];
  courses: InstructorCourseRow[];
  onViewCourse: (course: InstructorCourseRow) => void;
}

const progressColor = (progress: number) => (progress >= 65 ? "bg-green" : "bg-blue");

export function InstructorStudentsTab({ instructorName, students, courses, onViewCourse }: InstructorStudentsTabProps) {
  const { get, getPage, set } = useUrlParams();
  const query = get("q");
  const course = get("course", "All");
  const status = get("status", "All");
  const page = getPage();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return students.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
        (course === "All" || s.course.id === course) &&
        (status === "All" || s.status === status)
    );
  }, [students, query, course, status]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rowIds = rows.map((r) => r.id);
  const selectedOnPage = selectedIds.filter((id) => rowIds.includes(id));

  const handleExport = () => {
    const source = selectedIds.length
      ? students.filter((s) => selectedIds.includes(s.id))
      : filtered;
    const csv = [
      "Name,Email,Course,Enrolled On,Progress,Status",
      ...source.map(
        (s) => `"${s.name}","${s.email}","${s.course.title}","${s.enrolledOn}",${s.progress}%,${s.status}`
      ),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${instructorName.toLowerCase().replace(/\s+/g, "_")}_students.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Export downloaded", {
      description: `${source.length.toLocaleString()} student record(s) exported to CSV.`,
    });
  };

  const columns: ColumnDef<InstructorStudentRow>[] = [
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
      key: "student",
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-50">
          <Avatar src={row.avatarUrl} name={row.name} size={40} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500">{row.name}</p>
            <p className="body-xsm-regular text-primary-300 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Enrolled Course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-50">
          <CourseThumb course={row.course} size="lg" />
          <span className="body-sm-medium text-primary-500">{row.course.title}</span>
        </div>
      ),
    },
    {
      key: "enrolledOn",
      header: "Enrolled On",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.enrolledOn}</span>,
    },
    {
      key: "progress",
      header: "Progress",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-44">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${progressColor(row.progress)}`} style={{ width: `${row.progress}%` }} />
          </div>
          <span className="body-sm-regular text-primary-400 w-10">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "80px",
      render: (row) => (
        <RowMoreMenu
          items={[
            {
              key: "email",
              label: "Email Student",
              icon: <Mail className="w-3.5 h-3.5 text-primary-400" />,
              onClick: () => {
                window.location.href = `mailto:${row.email}`;
              },
            },
            {
              key: "course",
              label: "View Enrolled Course",
              icon: <BookOpen className="w-3.5 h-3.5 text-primary-400" />,
              onClick: () => onViewCourse(row.course),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DetailCard
      title={`Students (${students.length.toLocaleString()})`}
      description="Students enrolled in this instructor's courses."
      action={
        <>
          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0 && selectedIds.length === 0}
            className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            {selectedIds.length ? `Export (${selectedIds.length})` : "Export"}
          </button>
          <TabFilterBar
            search={{
              value: query,
              placeholder: "Search students...",
              onChange: (q) => set({ q, page: null }),
              className: "w-56 sm:w-72",
            }}
            filters={[]}
          />
        </>
      }
      bodyClassName="space-y-5"
    >
      <TabFilterBar
        filters={[
          {
            key: "course",
            value: course,
            options: [
              { value: "All", label: "All Courses" },
              ...courses.map((c) => ({ value: c.id, label: c.title })),
            ],
            onChange: (value) => set({ course: value, page: null }),
            className: "md:w-96",
          },
          {
            key: "status",
            value: status,
            options: [
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
            onChange: (value) => set({ status: value, page: null }),
            className: "md:w-96",
          },
        ]}
        onReset={() => {
          setSelectedIds([]);
          set({ q: null, course: null, status: null, page: null });
        }}
      />

      <div className="rounded-lg border border-dash overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={rows}
            rowKey={(row) => row.id}
            selectable
            selectedRowKeys={selectedOnPage}
            onSelectRow={(key, checked) =>
              setSelectedIds((prev) =>
                checked ? [...prev, String(key)] : prev.filter((id) => id !== key)
              )
            }
            onSelectAll={(checked) =>
              setSelectedIds((prev) =>
                checked
                  ? Array.from(new Set([...prev, ...rowIds]))
                  : prev.filter((id) => !rowIds.includes(id))
              )
            }
            verticalBorders
            containerClassName="border-0 rounded-none"
            headerClassName="bg-slate-50 border-b border-dash"
            thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
            cellClassName="px-3.5 py-3"
            emptyMessage={
              students.length === 0 ? "No students enrolled yet." : "No students match your filters."
            }
          />
        </div>
        <TablePagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={filtered.length}
          itemLabel="students"
          onPageChange={(next) => set({ page: next })}
        />
      </div>
    </DetailCard>
  );
}

export default InstructorStudentsTab;
