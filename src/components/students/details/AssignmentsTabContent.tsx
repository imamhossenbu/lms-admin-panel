"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  FileText,
  Layout,
  Code2,
  FileCode,
  Database,
  Layers,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { StudentAssignment } from "./mockStudentDetails";
import toast from "react-hot-toast";

interface AssignmentsTabContentProps {
  assignments: StudentAssignment[];
}

export function AssignmentsTabContent({
  assignments,
}: AssignmentsTabContentProps) {
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const getAssignmentIcon = (idx: number) => {
    switch (idx % 6) {
      case 0:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 1:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Layout className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
        );
      case 4:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
        );
      case 5:
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        );
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q);

      const matchesCourse =
        courseFilter === "All Courses" || item.courseTitle === courseFilter;

      const matchesStatus =
        statusFilter === "All Status" || item.submissionStatus === statusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [assignments, searchQuery, courseFilter, statusFilter]);

  const columns: ColumnDef<StudentAssignment>[] = [
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
      key: "assignment",
      header: "Assignment",
      render: (row, idx) => (
        <div className="flex items-center gap-3">
          {getAssignmentIcon(idx)}
          <span className="body-sm-medium font-semibold text-primary-500 truncate max-w-[200px]">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "courseTitle",
      header: "Course",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.courseTitle}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.dueDate}
        </span>
      ),
    },
    {
      key: "submissionStatus",
      header: "Submission Status",
      render: (row) => {
        if (row.submissionStatus === "Submitted") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <CheckCircle className="w-3 h-3 text-[#10B981]" />
              <span>Submitted</span>
            </span>
          );
        }
        if (row.submissionStatus === "Pending") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
              <Clock className="w-3 h-3 text-[#F59E0B]" />
              <span>Pending</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <XCircle className="w-3 h-3 text-[#EF4444]" />
            <span>Not Submitted</span>
          </span>
        );
      },
    },
    {
      key: "submittedOn",
      header: "Submitted On",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.submittedOn}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (row) => (
        <span
          className={`body-sm-medium whitespace-nowrap ${
            row.score !== "—" ? "font-bold text-primary-500" : "text-primary-300"
          }`}
        >
          {row.score}
        </span>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      render: (row) => (
        <span
          className={`body-sm-medium ${
            row.grade !== "—" ? "font-bold text-primary-500" : "text-primary-300"
          }`}
        >
          {row.grade}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "120px",
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              toast(`Viewing assignment details: "${row.title}"`, {
                icon: "📝",
              })
            }
            className="px-3 py-1 rounded-md border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer"
          >
            View
          </button>

          {/* Radix UI Dropdown Menu */}
          <AppDropdownMenu
            trigger={
              <button
                type="button"
                className="p-1 rounded-md border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="More options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            }
            items={[
              {
                key: "view-submission",
                label: "View Submission",
                icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () =>
                  toast(`Reviewing submission for ${row.title}`, {
                    icon: "📄",
                  }),
              },
              {
                key: "download",
                label: "Download File",
                icon: <Download className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () =>
                  toast.success(`Downloading files for ${row.title}`),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header with Title and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Assignments
            </h2>
            <p className="body-sm-regular text-primary-300">
              All assignments for this student across enrolled courses.
            </p>
          </div>
        </div>

        {/* Filter Controls: All Courses + All Status + Search (Side-by-side) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          {/* Radix UI Courses Dropdown */}
          <AppSelect
            value={courseFilter}
            onValueChange={setCourseFilter}
            options={[
              "All Courses",
              "HTML Fundamentals",
              "CSS & Responsive Design",
              "JavaScript Essentials",
              "React for Beginners",
              "Node.js Backend Basics",
              "UI/UX Design Basics",
            ]}
          />

          {/* Radix UI Status Dropdown */}
          <AppSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              "All Status",
              "Submitted",
              "Pending",
              "Not Submitted",
            ]}
          />

          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredAssignments}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredAssignments.length} of {assignments.length} assignments
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed"
          >
            &lt;
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center body-sm-medium font-semibold shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
