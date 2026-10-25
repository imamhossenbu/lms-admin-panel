"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { InstructorItem } from "@/types/instructor";
import { MOCK_INSTRUCTORS } from "@/data/mockInstructorData";
import { getStoredInstructors, INSTRUCTORS_UPDATED_EVENT } from "@/lib/instructorStorage";
import { InstructorHeader } from "@/components/instructors/InstructorHeader";
import { InstructorToolbar } from "@/components/instructors/InstructorToolbar";
import { InstructorTable } from "@/components/instructors/InstructorTable";
import { TablePagination } from "@/components/ui/TablePagination";
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

  // Sync with client-side storage so creates/edits/deletes on sub-pages show up here
  useEffect(() => {
    const sync = () => setInstructors(getStoredInstructors());
    sync();
    window.addEventListener(INSTRUCTORS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(INSTRUCTORS_UPDATED_EVENT, sync);
  }, []);

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


  // Navigation triggers (dedicated pages, no drawers)
  const handleViewDetails = (instructor: InstructorItem) => {
    router.push(`/instructors/${instructor.id}`);
  };

  const handleOpenEditFromTable = (instructor: InstructorItem) => {
    router.push(`/instructors/${instructor.id}/edit`);
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
      <InstructorHeader onAddClick={() => router.push("/instructors/create")} />

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
        <TablePagination
          currentPage={currentPage}
          itemLabel="instructors"
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
