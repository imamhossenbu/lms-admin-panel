"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  MinusCircle,
  MoreHorizontal,
  Eye,
  FileCheck2,
  RotateCcw,
  Send,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CourseBadgeIcon } from "../create/CourseBadgeIcon";
import { StudentQuizAttempt } from "./mockStudentDetails";
import toast from "react-hot-toast";

interface QuizzesTabContentProps {
  quizzes: StudentQuizAttempt[];
}

export function QuizzesTabContent({
  quizzes: initialQuizzes,
}: QuizzesTabContentProps) {
  const [quizzes] = useState<StudentQuizAttempt[]>(initialQuizzes);
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.course.toLowerCase().includes(q);

      const matchesCourse =
        courseFilter === "All Courses" || item.course === courseFilter;

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [quizzes, searchQuery, courseFilter, statusFilter]);

  const columns: ColumnDef<StudentQuizAttempt>[] = [
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
      key: "quizTitle",
      header: "Quiz Title",
      render: (row) => (
        <div className="flex items-center gap-3">
          <CourseBadgeIcon type={row.iconType} size="md" />
          <span className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.course}
        </span>
      ),
    },
    {
      key: "attemptedOn",
      header: "Attempted On",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.attemptedOn}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (row) => {
        if (row.scoreCurrent === null || row.percentage === null) {
          return <span className="body-sm-regular text-primary-300">—</span>;
        }

        const pct = row.percentage;
        const progressColorClass =
          pct >= 70
            ? "bg-green"
            : pct >= 50
            ? "bg-blue"
            : "bg-brand-orange";

        return (
          <div className="space-y-1.5 min-w-[110px]">
            <div className="body-sm-medium font-bold text-primary-500">
              {row.scoreCurrent} / {row.scoreTotal}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${progressColorClass}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <span className="body-2xsm-regular text-primary-300 font-medium">
                {pct}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "Passed") {
          return (
            <ToneBadge
              tone="green"
              variant="pill"
              size="md"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              className="whitespace-nowrap shrink-0"
            >
              Passed
            </ToneBadge>
          );
        }

        if (row.status === "Failed") {
          return (
            <ToneBadge
              tone="red"
              variant="pill"
              size="md"
              icon={<XCircle className="w-3.5 h-3.5" />}
              className="whitespace-nowrap shrink-0"
            >
              Failed
            </ToneBadge>
          );
        }

        return (
          <ToneBadge
            tone="navy"
            variant="pill"
            size="md"
            icon={<MinusCircle className="w-3.5 h-3.5" />}
            className="whitespace-nowrap shrink-0"
          >
            Not Attempted
          </ToneBadge>
        );
      },
    },
    {
      key: "timeTaken",
      header: "Time Taken",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.timeTaken}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "120px",
      render: (row) => {
        const isAttempted = row.status !== "Not Attempted";

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isAttempted) {
                  toast(`Viewing quiz results for ${row.title}`, {
                    icon: "📋",
                  });
                } else {
                  toast.success(`Quiz "${row.title}" assigned to student.`);
                }
              }}
              className="text-blue hover:underline body-sm-medium font-semibold cursor-pointer px-1.5 py-1"
            >
              {isAttempted ? "View" : "Assign"}
            </button>

            <AppDropdownMenu
              trigger={
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
              items={
                isAttempted
                  ? [
                      {
                        key: "view-result",
                        label: "View Results",
                        icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
                        onClick: () =>
                          toast(`Viewing results for ${row.title}`, {
                            icon: "📊",
                          }),
                      },
                      {
                        key: "review-answers",
                        label: "Review Answers",
                        icon: (
                          <FileCheck2 className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        onClick: () =>
                          toast(`Opening answers review for ${row.title}`),
                      },
                      {
                        key: "retake-quiz",
                        label: "Allow Retake",
                        icon: (
                          <RotateCcw className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        onClick: () =>
                          toast.success(
                            `Retake permission granted for ${row.title}`
                          ),
                      },
                      {
                        key: "download-summary",
                        label: "Download Summary",
                        icon: (
                          <Download className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        separatorBefore: true,
                        onClick: () =>
                          toast.success(`Downloading report for ${row.title}`),
                      },
                    ]
                  : [
                      {
                        key: "assign-now",
                        label: "Assign Quiz",
                        icon: <Send className="w-3.5 h-3.5 text-primary-400" />,
                        onClick: () =>
                          toast.success(`Assigned ${row.title} to student`),
                      },
                      {
                        key: "send-reminder",
                        label: "Send Reminder",
                        icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
                        onClick: () =>
                          toast.success(`Reminder sent for ${row.title}`),
                      },
                    ]
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Quizzes
            </h2>
            <p className="body-sm-regular text-primary-300">
              All quiz attempts by this student across enrolled courses.
            </p>
          </div>
        </div>

        {/* Right Toolbar: All Courses + All Status + Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
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

          <AppSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={["All Status", "Passed", "Failed", "Not Attempted"]}
          />

          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredQuizzes}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredQuizzes.length} of {quizzes.length} quizzes
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center body-sm-medium font-bold shadow-2xs"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
