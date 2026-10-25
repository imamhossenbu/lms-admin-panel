"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MOCK_STUDENTS } from "@/data/mockStudentData";
import { StudentItem } from "@/types/student";
import {
  getStoredStudents,
} from "@/lib/studentStorage";
import { StudentHeader } from "@/components/students/StudentHeader";
import { StudentToolbar } from "@/components/students/StudentToolbar";
import { StudentTable } from "@/components/students/StudentTable";
import { TablePagination } from "@/components/ui/TablePagination";
import { StudentSkeleton } from "@/components/students/StudentSkeleton";
import toast from "react-hot-toast";

function StudentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial page and filter state from URL parameters so refreshing keeps the current page and filter
  const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const initialStatus = searchParams.get("status") || "All";
  const initialSearch = searchParams.get("q") || "";

  const [students, setStudents] = useState<StudentItem[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [courseFilter, setCourseFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with client-side storage
  React.useEffect(() => {
    setStudents(getStoredStudents());

    const handleStorageUpdate = () => {
      setStudents(getStoredStudents());
    };

    window.addEventListener("edupro_students_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("edupro_students_updated", handleStorageUpdate);
    };
  }, []);

  // Update URL helper to persist query, page, status on reload
  const updateUrlParams = (page: number, status: string, q: string) => {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    if (status !== "All") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    router.replace(params.toString() ? `?${params.toString()}` : "/students", { scroll: false });
  };

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        std.name.toLowerCase().includes(q) ||
        std.email.toLowerCase().includes(q) ||
        std.phone.includes(q);

      const matchesStatus =
        statusFilter === "All" || std.status === statusFilter;

      const matchesCourse =
        courseFilter === "All" ||
        std.enrolledCourses.some((c) =>
          c.title.toLowerCase().includes(courseFilter.toLowerCase())
        );

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, searchQuery, statusFilter, courseFilter]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);


  // Navigation triggers (direct page routing, no drawer)
  const handleViewDetails = (student: StudentItem) => {
    router.push(`/students/${student.id}`);
  };

  const handleOpenEditFromTable = (student: StudentItem) => {
    router.push(`/students/${student.id}/edit`);
  };

  // Export CSV Handler
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order,Name,Email,Enrolled,Completed,Status,Join Date"]
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.orderNumber},"${s.name}","${s.email}",${s.enrolledCoursesCount},"${s.completedCoursesCount} (${s.completionRate}%)",${s.status},"${s.joinDate}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredStudents.length} student records to CSV.`);
  };

  if (isLoading) {
    return <StudentSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-[16px] text-left pb-8"
    >
      {/* 1. Page Header with Breadcrumbs & Add Student CTA */}
      <StudentHeader />

      {/* 2. Full-Width Students Card: Toolbar + DataTable + Pagination */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Toolbar with Search, Status, Course, Date filters & Export */}
        <StudentToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
            updateUrlParams(1, statusFilter, q);
          }}
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
            updateUrlParams(1, s, searchQuery);
          }}
          courseFilter={courseFilter}
          onCourseChange={(c) => {
            setCourseFilter(c);
            setCurrentPage(1);
          }}
          dateFilter={dateFilter}
          onDateChange={(d) => {
            setDateFilter(d);
            setCurrentPage(1);
          }}
          onExport={handleExport}
        />

        {/* Full-width DataTable without checkboxes, with # column and column borders */}
        <StudentTable
          students={paginatedStudents}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditFromTable}
        />

        {/* Pagination Footer */}
        <TablePagination
          currentPage={currentPage}
          itemLabel="students"
          totalCount={filteredStudents.length}
          pageSize={pageSize}
          onPageChange={(page) => {
            setCurrentPage(page);
            updateUrlParams(page, statusFilter, searchQuery);
          }}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
            updateUrlParams(1, statusFilter, searchQuery);
          }}
        />
      </div>
    </motion.div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<StudentSkeleton />}>
      <StudentsContent />
    </Suspense>
  );
}
