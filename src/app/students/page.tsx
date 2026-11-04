"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StudentHeader } from "@/components/students/StudentHeader";
import { StudentToolbar } from "@/components/students/StudentToolbar";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentSkeleton } from "@/components/students/StudentSkeleton";
import { TablePagination } from "@/components/ui/TablePagination";
import { studentsApi } from "@/lib/api/students";
import { apiErrorMessage } from "@/lib/apiError";
import { useUrlParams } from "@/lib/useUrlParams";
import { toStudentRow } from "@/lib/students/studentView";
import { useCourseOptions } from "@/lib/students/useCourseOptions";
import { downloadStudentsCsv } from "@/lib/students/studentCsv";
import type { StudentItem } from "@/types/student";
import type { StudentListItem, StudentListQuery, StudentStatusLabel } from "@/types/studentApi";

const STATUSES: StudentStatusLabel[] = ["Active", "Inactive", "Suspended"];
const JOINED = ["7", "30", "90"] as const;
const PAGE_SIZES = [10, 20, 50];

/** Students list: server-side search, filters and pagination, all kept in the URL. */
function StudentsContent() {
  const router = useRouter();
  const url = useUrlParams();
  const courseOptions = useCourseOptions();

  const page = url.getPage();
  const status = url.get("status", "All");
  const courseId = url.get("course", "All");
  const joined = url.get("joined", "All");
  const limit = PAGE_SIZES.includes(Number(url.get("limit"))) ? Number(url.get("limit")) : 10;
  const urlQuery = url.get("q");
  // `set` changes identity with every URL change; effects read the latest one through a ref.
  const setParams = useRef(url.set);
  useEffect(() => {
    setParams.current = url.set;
  }, [url.set]);

  const [search, setSearch] = useState(urlQuery);
  const [result, setResult] = useState<{ rows: StudentListItem[]; total: number; key: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Debounced search → URL (page resets to 1).
  useEffect(() => {
    if (search.trim() === urlQuery) return;
    const t = setTimeout(() => setParams.current({ q: search.trim(), page: 1 }), 300);
    return () => clearTimeout(t);
  }, [search, urlQuery]);

  const query = useMemo<StudentListQuery>(
    () => ({
      page,
      limit,
      q: urlQuery || undefined,
      status: STATUSES.includes(status as StudentStatusLabel) ? (status as StudentStatusLabel) : undefined,
      courseId: courseId !== "All" ? courseId : undefined,
      joinedWithinDays: (JOINED as readonly string[]).includes(joined) ? (Number(joined) as 7 | 30 | 90) : undefined,
    }),
    [page, limit, urlQuery, status, courseId, joined]
  );

  const queryKey = JSON.stringify(query);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const isFetching = result?.key !== queryKey && failedKey !== queryKey;

  useEffect(() => {
    let alive = true;
    studentsApi
      .list(query)
      .then((res) => {
        if (!alive) return;
        setResult({ rows: res.data, total: res.meta.total, key: JSON.stringify(query) });
        // Deleted the last row of a page → step back to the last page that exists.
        if (res.meta.page > res.meta.totalPages) setParams.current({ page: res.meta.totalPages });
      })
      .catch((err) => {
        if (!alive) return;
        setFailedKey(JSON.stringify(query));
        setResult((r) => r ?? { rows: [], total: 0, key: "" });
        toast.error("Couldn't load students", { id: "students-load", description: apiErrorMessage(err) });
      });
    return () => {
      alive = false;
    };
  }, [query]);

  const rows: StudentItem[] = useMemo(() => (result?.rows ?? []).map((s, i) => toStudentRow(s, (page - 1) * limit + i)), [result, page, limit]);

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Preparing export...", { description: "Collecting every student that matches the filters" });
    try {
      const all: StudentListItem[] = [];
      for (let p = 1; ; p++) {
        const res = await studentsApi.list({ ...query, page: p, limit: 100 });
        all.push(...res.data);
        if (p >= res.meta.totalPages) break;
      }
      downloadStudentsCsv(all);
      toast.success("Export ready", { id: toastId, description: `${all.length} student record${all.length === 1 ? "" : "s"} downloaded as CSV.` });
    } catch (err) {
      toast.error("Couldn't export students", { id: toastId, description: apiErrorMessage(err) });
    } finally {
      setIsExporting(false);
    }
  };

  if (!result) return <StudentSkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-4 text-left pb-8">
      <StudentHeader />

      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        <StudentToolbar
          searchQuery={search}
          onSearchChange={setSearch}
          statusFilter={status}
          onStatusChange={(s) => url.set({ status: s, page: 1 })}
          courseFilter={courseId}
          onCourseChange={(c) => url.set({ course: c, page: 1 })}
          dateFilter={joined}
          onDateChange={(d) => url.set({ joined: d, page: 1 })}
          courseOptions={(courseOptions ?? []).map((c) => ({ value: c.id, label: c.title }))}
          onExport={handleExport}
          isExporting={isExporting}
        />

        <StudentTable
          students={rows}
          isLoading={isFetching && rows.length === 0}
          emptyMessage={query.q || query.status || query.courseId || query.joinedWithinDays ? "No students match these filters." : "No students yet — add your first student."}
          onViewDetails={(s) => router.push(`/students/${s.id}`)}
          onEdit={(s) => router.push(`/students/${s.id}/edit`)}
        />

        <TablePagination
          currentPage={page}
          itemLabel="students"
          totalCount={result.total}
          pageSize={limit}
          pageSizeOptions={PAGE_SIZES}
          onPageChange={(p) => url.set({ page: p })}
          onPageSizeChange={(size) => url.set({ limit: size === 10 ? null : size, page: 1 })}
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
