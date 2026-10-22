"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_STUDENTS } from "@/data/mockStudentData";
import { StudentItem, StudentStatus } from "@/types/student";
import { StudentHeader } from "@/components/students/StudentHeader";
import { StudentToolbar } from "@/components/students/StudentToolbar";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentPagination } from "@/components/students/StudentPagination";
import { StudentDetailsDrawer } from "@/components/students/StudentDetailsDrawer";
import { AddStudentDrawer } from "@/components/students/AddStudentDrawer";
import { StudentSkeleton } from "@/components/students/StudentSkeleton";
import { toast } from "sonner";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(["std-1"]);
  const [isLoading, setIsLoading] = useState(false);

  // Side Drawers state (Right side details is a drawer, NOT a static panel!)
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [formDrawerMode, setFormDrawerMode] = useState<"add" | "edit">("add");

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

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;

  // Selection Handlers
  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, id]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Drawer triggers
  const handleViewDetails = (student: StudentItem) => {
    setSelectedStudent(student);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormDrawerMode("add");
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (student: StudentItem) => {
    setSelectedStudent(student);
    setFormDrawerMode("edit");
    setIsFormDrawerOpen(true);
  };

  // Add / Edit Save Handler
  const handleSaveStudent = (payload: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    status: StudentStatus;
    initialCourse?: string;
  }) => {
    if (payload.id) {
      // Edit existing
      setStudents((prev) =>
        prev.map((s) =>
          s.id === payload.id
            ? {
                ...s,
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                status: payload.status,
              }
            : s
        )
      );

      if (selectedStudent && selectedStudent.id === payload.id) {
        setSelectedStudent((prev) =>
          prev
            ? {
                ...prev,
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                status: payload.status,
              }
            : null
        );
      }
    } else {
      // Create new student
      const newStd: StudentItem = {
        id: `std-${Date.now()}`,
        orderNumber: students.length + 1,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        status: payload.status,
        enrolledCoursesCount: payload.initialCourse ? 1 : 0,
        completedCoursesCount: 0,
        completionRate: 0,
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        totalWatchTime: "0h 0m",
        averageScore: 0,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
        enrolledCourses: payload.initialCourse
          ? [
              {
                id: `c-${Date.now()}`,
                title: payload.initialCourse,
                progress: 0,
                enrolledDate: "Today",
                completedLessons: 0,
                totalLessons: 20,
                instructor: "EduPro Faculty",
                category: "General",
              },
            ]
          : [],
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            action: "Account created and onboarded",
            timestamp: "Just now",
            iconType: "enroll",
          },
        ],
      };

      setStudents((prev) => [newStd, ...prev]);
    }
  };

  // Remove Student Handler
  const handleDeleteStudent = (student: StudentItem) => {
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
    setIsDetailsDrawerOpen(false);
    setSelectedStudent(null);
    toast.success("Student Removed", {
      description: `"${student.name}" has been removed from the platform.`,
    });
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

    toast.success("Export Complete", {
      description: `Exported ${filteredStudents.length} student records to CSV.`,
    });
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
      <StudentHeader onAddClick={handleOpenAdd} />

      {/* 2. Full-Width Students Card: Toolbar + DataTable + Pagination */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Toolbar with Search, Status, Course, Date filters & Export */}
        <StudentToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
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

        {/* Full-width DataTable with column borders */}
        <StudentTable
          students={paginatedStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectStudent={handleSelectStudent}
          onSelectAll={handleSelectAll}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEdit}
        />

        {/* Pagination Footer */}
        <StudentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredStudents.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* 3. Slide-Over Side Drawer for Student Details (Opened on row click or details action) */}
      <StudentDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        student={selectedStudent}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onEdit={(student) => {
          setIsDetailsDrawerOpen(false);
          handleOpenEdit(student);
        }}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* 4. Slide-Over Side Drawer for Add / Edit Student */}
      <AddStudentDrawer
        isOpen={isFormDrawerOpen}
        mode={formDrawerMode}
        student={selectedStudent}
        onClose={() => setIsFormDrawerOpen(false)}
        onSave={handleSaveStudent}
      />
    </motion.div>
  );
}
