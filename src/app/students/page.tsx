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
  const [isLoading, setIsLoading] = useState(false);

  // Side Drawer states (Details drawer supports smooth inline editing!)
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsInitialEditMode, setDetailsInitialEditMode] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

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

  // Drawer triggers
  const handleViewDetails = (student: StudentItem) => {
    setSelectedStudent(student);
    setDetailsInitialEditMode(false);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenEditFromTable = (student: StudentItem) => {
    setSelectedStudent(student);
    setDetailsInitialEditMode(true);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenAdd = () => {
    setIsAddDrawerOpen(true);
  };

  // Update existing student info (called from drawer's inline edit)
  const handleUpdateStudent = (
    studentId: string,
    updatedData: {
      name: string;
      email: string;
      phone: string;
      status: StudentStatus;
    }
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s))
    );

    setSelectedStudent((prev) =>
      prev && prev.id === studentId ? { ...prev, ...updatedData } : prev
    );
  };

  // Add New Student
  const handleAddStudent = (payload: {
    name: string;
    email: string;
    phone: string;
    status: StudentStatus;
    initialCourse?: string;
  }) => {
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
          id: `act-${Date.now()}-1`,
          action: `Welcome email with temporary password (EduPro#${Math.floor(1000 + Math.random() * 9000)}) sent to ${payload.email}`,
          timestamp: "Just now",
          iconType: "enroll",
        },
        {
          id: `act-${Date.now()}-2`,
          action: "Account registered and onboarded",
          timestamp: "Just now",
          iconType: "enroll",
        },
      ],
    };

    setStudents((prev) => [newStd, ...prev]);
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

        {/* Full-width DataTable without checkboxes, with # column and column borders */}
        <StudentTable
          students={paginatedStudents}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditFromTable}
        />

        {/* Pagination Footer */}
        <StudentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredStudents.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 3. Slide-Over Side Drawer for Student Details (Supports Smooth Inline Editing of Info!) */}
      <StudentDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        student={selectedStudent}
        initialEditMode={detailsInitialEditMode}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setDetailsInitialEditMode(false);
        }}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* 4. Slide-Over Side Drawer for Add Student */}
      <AddStudentDrawer
        isOpen={isAddDrawerOpen}
        mode="add"
        student={null}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleAddStudent}
      />
    </motion.div>
  );
}
