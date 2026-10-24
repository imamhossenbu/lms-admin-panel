"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { InstructorItem, InstructorStatus } from "@/types/instructor";
import { MOCK_INSTRUCTORS } from "@/data/mockInstructorData";
import { InstructorHeader } from "@/components/instructors/InstructorHeader";
import { InstructorToolbar } from "@/components/instructors/InstructorToolbar";
import { InstructorTable } from "@/components/instructors/InstructorTable";
import { InstructorPagination } from "@/components/instructors/InstructorPagination";
import { InstructorDetailsDrawer } from "@/components/instructors/InstructorDetailsDrawer";
import { AddInstructorDrawer } from "@/components/instructors/AddInstructorDrawer";
import { InstructorSkeleton } from "@/components/instructors/InstructorSkeleton";
import { toast } from "sonner";

function InstructorsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlStatus = searchParams.get("status") || "All";
  const urlExpertise = searchParams.get("expertise") || "All";
  const urlSearch = searchParams.get("q") || "";

  const [instructors, setInstructors] = useState<InstructorItem[]>(MOCK_INSTRUCTORS);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState(urlStatus);
  const [expertiseFilter, setExpertiseFilter] = useState(urlExpertise);
  const [dateFilter, setDateFilter] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(isNaN(urlPage) ? 1 : urlPage);
  const [pageSize, setPageSize] = useState(10);

  // URL sync helper
  const updateUrlParams = (
    nextPage: number,
    nextStatus: string,
    nextExpertise: string,
    nextQuery: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set("page", nextPage.toString());
    else params.delete("page");

    if (nextStatus && nextStatus !== "All") params.set("status", nextStatus);
    else params.delete("status");

    if (nextExpertise && nextExpertise !== "All") params.set("expertise", nextExpertise);
    else params.delete("expertise");

    if (nextQuery) params.set("q", nextQuery);
    else params.delete("q");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Drawer states
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorItem | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsInitialEditMode, setDetailsInitialEditMode] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Simulate initial loading for polished skeleton transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Filtered instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inst.name.toLowerCase().includes(q) ||
        inst.email.toLowerCase().includes(q) ||
        inst.title.toLowerCase().includes(q) ||
        inst.expertise.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || inst.status === statusFilter;

      const matchesExpertise =
        expertiseFilter === "All" || inst.expertise === expertiseFilter;

      return matchesSearch && matchesStatus && matchesExpertise;
    });
  }, [instructors, searchQuery, statusFilter, expertiseFilter]);

  // Paginated instructors
  const paginatedInstructors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInstructors.slice(startIndex, startIndex + pageSize);
  }, [filteredInstructors, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredInstructors.length / pageSize) || 1;

  // View Details Handler
  const handleViewDetails = (instructor: InstructorItem) => {
    setSelectedInstructor(instructor);
    setDetailsInitialEditMode(false);
    setIsDetailsDrawerOpen(true);
  };

  // Direct Edit from Table Handler
  const handleOpenEditFromTable = (instructor: InstructorItem) => {
    setSelectedInstructor(instructor);
    setDetailsInitialEditMode(true);
    setIsDetailsDrawerOpen(true);
  };

  // Open Add Instructor Drawer
  const handleOpenAdd = () => {
    setIsAddDrawerOpen(true);
  };

  // Update Instructor Handler
  const handleUpdateInstructor = (
    instructorId: string,
    updatedData: {
      name: string;
      email: string;
      phone: string;
      title: string;
      expertise: string;
      bio: string;
      status: InstructorStatus;
    }
  ) => {
    setInstructors((prev) =>
      prev.map((inst) =>
        inst.id === instructorId
          ? {
              ...inst,
              name: updatedData.name,
              email: updatedData.email,
              phone: updatedData.phone,
              title: updatedData.title,
              expertise: updatedData.expertise,
              bio: updatedData.bio,
              status: updatedData.status,
            }
          : inst
      )
    );

    setSelectedInstructor((prev) =>
      prev && prev.id === instructorId
        ? {
            ...prev,
            name: updatedData.name,
            email: updatedData.email,
            phone: updatedData.phone,
            title: updatedData.title,
            expertise: updatedData.expertise,
            bio: updatedData.bio,
            status: updatedData.status,
          }
        : prev
    );
  };

  // Add Instructor Handler
  const handleAddInstructor = (payload: {
    name: string;
    email: string;
    phone: string;
    expertise: string;
    title?: string;
    bio: string;
    status: InstructorStatus;
  }) => {
    const tempPassword = `EduPro#${Math.floor(1000 + Math.random() * 9000)}`;
    const newInst: InstructorItem = {
      id: `inst-${Date.now()}`,
      orderNumber: instructors.length + 1,
      name: payload.name,
      title: payload.title || `${payload.expertise} Instructor`,
      expertise: payload.expertise,
      email: payload.email,
      phone: payload.phone,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      coursesCount: 0,
      studentsCount: 0,
      totalRevenue: "$0",
      numericRevenue: 0,
      rating: 5.0,
      reviewsCount: 0,
      status: payload.status,
      joinDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      bio: payload.bio,
      skills: [payload.expertise, "Instruction", "Curriculum Design"],
      courses: [],
      recentActivities: [
        {
          id: `act-${Date.now()}-1`,
          action: `Welcome email with temporary password (${tempPassword}) sent to ${payload.email}`,
          timestamp: "Just now",
          iconType: "message",
        },
        {
          id: `act-${Date.now()}-2`,
          action: "Instructor account created & verified",
          timestamp: "Just now",
          iconType: "course",
        },
      ],
    };

    setInstructors((prev) => [newInst, ...prev]);
  };

  // Remove Instructor Handler
  const handleDeleteInstructor = (instructor: InstructorItem) => {
    setInstructors((prev) => prev.filter((i) => i.id !== instructor.id));
    setIsDetailsDrawerOpen(false);
    setSelectedInstructor(null);
    toast.success("Instructor Removed", {
      description: `"${instructor.name}" has been removed from the platform.`,
    });
  };

  // Export CSV Handler
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order,Name,Expertise,Email,Courses,Students,Total Revenue,Status,Join Date"]
        .concat(
          filteredInstructors.map(
            (i) =>
              `${i.orderNumber},"${i.name}","${i.expertise}","${i.email}",${i.coursesCount},${i.studentsCount},"${i.totalRevenue}",${i.status},"${i.joinDate}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `instructors_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success("Export Downloaded", {
      description: "Instructors list exported to CSV.",
    });
  };

  if (isLoading) {
    return <InstructorSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-[16px] text-left pb-8"
    >
      {/* 1. Page Header with Breadcrumbs & Add Instructor CTA */}
      <InstructorHeader onAddClick={handleOpenAdd} />

      {/* 2. Full-Width Instructors Card: Toolbar + DataTable + Pagination */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Toolbar with Search, Status, Expertise, Date filters & Export */}
        <InstructorToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
            updateUrlParams(1, statusFilter, expertiseFilter, q);
          }}
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
            updateUrlParams(1, s, expertiseFilter, searchQuery);
          }}
          expertiseFilter={expertiseFilter}
          onExpertiseChange={(e) => {
            setExpertiseFilter(e);
            setCurrentPage(1);
            updateUrlParams(1, statusFilter, e, searchQuery);
          }}
          dateFilter={dateFilter}
          onDateChange={(d) => {
            setDateFilter(d);
            setCurrentPage(1);
          }}
          onExport={handleExport}
        />

        {/* Full-width DataTable with column borders */}
        <InstructorTable
          instructors={paginatedInstructors}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditFromTable}
        />

        {/* Dynamic Pagination with reusable DropdownSelect */}
        <InstructorPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredInstructors.length}
          pageSize={pageSize}
          onPageChange={(page) => {
            setCurrentPage(page);
            updateUrlParams(page, statusFilter, expertiseFilter, searchQuery);
          }}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
            updateUrlParams(1, statusFilter, expertiseFilter, searchQuery);
          }}
        />
      </div>

      {/* 3. Slide-Over Side Drawer for Instructor Details & Inline Editing */}
      <InstructorDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        instructor={selectedInstructor}
        initialEditMode={detailsInitialEditMode}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setDetailsInitialEditMode(false);
        }}
        onUpdateInstructor={handleUpdateInstructor}
        onDeleteInstructor={handleDeleteInstructor}
      />

      {/* 4. Slide-Over Side Drawer for Add Instructor */}
      <AddInstructorDrawer
        isOpen={isAddDrawerOpen}
        mode="add"
        instructor={null}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleAddInstructor}
      />
    </motion.div>
  );
}

export default function InstructorsPage() {
  return (
    <Suspense fallback={<InstructorSkeleton />}>
      <InstructorsContent />
    </Suspense>
  );
}
