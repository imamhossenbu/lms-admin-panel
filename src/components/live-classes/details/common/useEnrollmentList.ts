"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { LiveClassItem, LiveEnrollment } from "@/types/liveClass";
import { durationMinutes } from "@/lib/liveClassStats";
import { downloadEnrollmentsCsv } from "../liveDetailFormat";
import { filterEnrollments } from "./enrollmentFilters";
import { useEnrollmentFilters } from "./useEnrollmentFilters";

/** Filters (URL) + pagination + row selection + CSV export for the Students / Attendance tables. */
export function useEnrollmentList(liveClass: LiveClassItem, enrollments: LiveEnrollment[], prefix: "s" | "a", csvSuffix: "students" | "attendance") {
  const f = useEnrollmentFilters(prefix);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const duration = durationMinutes(liveClass);

  const filtered = useMemo(() => filterEnrollments(enrollments, f.filters, duration), [enrollments, f.filters, duration]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / f.pageSize));
  const page = Math.min(f.page, totalPages);
  const offset = (page - 1) * f.pageSize;
  const rows = filtered.slice(offset, offset + f.pageSize);
  const pageSelected = selectedIds.filter((id) => rows.some((r) => r.id === id));

  /** Exports the selected rows, or every filtered row when nothing is selected. */
  const exportCsv = () => {
    const list = selectedIds.length ? enrollments.filter((e) => selectedIds.includes(e.id)) : filtered;
    if (!list.length) {
      toast.error("Nothing to export", { description: "No students match the current filters." });
      return;
    }
    try {
      const name = downloadEnrollmentsCsv(liveClass, list, csvSuffix);
      toast.success("Export ready", { description: `${list.length} student${list.length === 1 ? "" : "s"} saved to ${name}.` });
    } catch {
      toast.error("Download failed", { description: "Your browser blocked the file. Please try again." });
    }
  };

  return {
    f,
    filtered,
    rows,
    page,
    offset,
    duration,
    selectedIds: pageSelected,
    selectedCount: selectedIds.length,
    onSelectRow: (id: string, checked: boolean) => setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id))),
    onSelectAll: (checked: boolean) =>
      setSelectedIds((prev) => (checked ? [...new Set([...prev, ...rows.map((r) => r.id)])] : prev.filter((id) => !rows.some((r) => r.id === id)))),
    exportCsv,
  };
}
