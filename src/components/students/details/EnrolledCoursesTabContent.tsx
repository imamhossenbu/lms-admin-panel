"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  BookOpen,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  TrendingUp,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { CourseBadgeIcon } from "../create/CourseBadgeIcon";
import { EnrolledCourseDetail } from "./mockStudentDetails";
import { toast } from "sonner";

interface EnrolledCoursesTabContentProps {
  courses: EnrolledCourseDetail[];
  onEnrollNew?: () => void;
}

export function EnrolledCoursesTabContent({
  courses: initialCourses,
  onEnrollNew,
}: EnrolledCoursesTabContentProps) {
  const [courses, setCourses] = useState<EnrolledCourseDetail[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuCourseId, setOpenMenuCourseId] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q)
      );
    });
  }, [courses, searchQuery]);

  const handleRemoveCourse = (course: EnrolledCourseDetail) => {
    setCourses((prev) => prev.filter((c) => c.id !== course.id));
    setOpenMenuCourseId(null);
    toast.success("Course Removed", {
      description: `"${course.title}" was unenrolled.`,
    });
  };

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
        <div className="flex items-center gap-3">
          <CourseBadgeIcon type={row.iconType} size="md" />
          <div>
            <h4 className="body-sm-medium font-semibold text-primary-500">
              {row.title}
            </h4>
            <span className="body-2xsm-regular text-primary-300">
              {row.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "instructor",
      header: "Instructor",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-dash">
            <Image
              src={row.instructor.avatarUrl}
              alt={row.instructor.name}
              fill
              className="object-cover"
              sizes="24px"
            />
          </div>
          <span className="body-sm-regular text-primary-500 whitespace-nowrap">
            {row.instructor.name}
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
            : row.progress > 0
            ? "bg-[#F97316]"
            : "bg-slate-300";

        return (
          <div className="flex items-center gap-2.5 min-w-[120px]">
            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full`}
                style={{ width: `${Math.max(row.progress, 0)}%` }}
              />
            </div>
            <span className="body-xsm-medium font-semibold text-primary-500 w-8 text-right">
              {row.progress}%
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const isNotStarted = row.status === "Not Started";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
              isNotStarted
                ? "bg-slate-100 text-primary-400"
                : "bg-[#EFF6FF] text-[#1D4ED8]"
            }`}
          >
            {row.status}
          </span>
        );
      },
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
      key: "completedDate",
      header: "Completed On",
      render: (row) => (
        <span className="body-sm-regular text-primary-300">
          {row.completedDate}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "120px",
      render: (row) => {
        const isMenuOpen = openMenuCourseId === row.id;

        return (
          <div className="flex items-center justify-center gap-1.5 relative">
            <button
              type="button"
              onClick={() =>
                toast.info("Course Details", {
                  description: `Opening "${row.title}" curriculum overview.`,
                })
              }
              className="px-3 py-1 rounded-md border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer"
            >
              View
            </button>

            {/* Dropdown Options */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenuCourseId(isMenuOpen ? null : row.id)
                }
                className="p-1 rounded-md border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="Course Options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setOpenMenuCourseId(null)}
                  />
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg border border-dash shadow-lg py-1 z-30 divide-y divide-dash text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuCourseId(null);
                        toast.info("View Course", {
                          description: `Viewing details for ${row.title}`,
                        });
                      }}
                      className="w-full px-3 py-1.5 text-left body-xsm-medium text-primary-500 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary-400" />
                      <span>View Course</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuCourseId(null);
                        toast.info("Progress Analytics", {
                          description: `Progress analytics for ${row.title}: ${row.progress}%`,
                        });
                      }}
                      className="w-full px-3 py-1.5 text-left body-xsm-medium text-primary-500 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
                      <span>View Progress</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuCourseId(null);
                        toast.info("Change Enrollment", {
                          description: "Modifying enrollment batch...",
                        });
                      }}
                      className="w-full px-3 py-1.5 text-left body-xsm-medium text-primary-500 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-primary-400" />
                      <span>Change Enrollment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(row)}
                      className="w-full px-3 py-1.5 text-left body-xsm-medium text-red hover:bg-red-14/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from Course</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Enrolled Courses
            </h2>
            <p className="body-sm-regular text-primary-300">
              Courses this student is enrolled in and their progress.
            </p>
          </div>
        </div>

        {/* Right Search & CTA Button */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onEnrollNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue hover:bg-[#1D60E3] active:bg-[#1853C9] text-white body-sm-medium transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Enroll in Course</span>
          </button>
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredCourses}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredCourses.length} of {courses.length} courses
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
