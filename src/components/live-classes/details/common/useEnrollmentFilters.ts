"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { ATTENDANCE_STATUS_OPTIONS, ENROLLMENT_PAGE_SIZES, PROGRESS_OPTIONS } from "./enrollmentFilters";

const oneOf = (value: string, options: { value: string }[]) => (options.some((o) => o.value === value) ? value : "All");

/**
 * Students / Attendance filters in the URL, namespaced by `prefix`:
 * ?{p}q, ?{p}status, ?{p}progress, ?{p}page, ?{p}size (e.g. "s" → ?sq, ?sstatus …; "a" → ?aq …).
 */
export function useEnrollmentFilters(prefix: "s" | "a") {
  const { get, set } = useUrlParams();
  const k = (name: string) => `${prefix}${name}`;
  const q = get(k("q"));
  const status = oneOf(get(k("status"), "All"), ATTENDANCE_STATUS_OPTIONS);
  const progress = oneOf(get(k("progress"), "All"), PROGRESS_OPTIONS);
  const rawPage = Number(get(k("page"), "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawSize = Number(get(k("size"), "10"));
  const pageSize = ENROLLMENT_PAGE_SIZES.includes(rawSize) ? rawSize : 10;

  // Debounced search box → URL.
  const [search, setSearch] = useState(q);
  const qKey = k("q");
  const pageKey = k("page");
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => set({ [qKey]: search, [pageKey]: null }), 250);
    return () => clearTimeout(t);
  }, [search, q, set, qKey, pageKey]);

  return {
    search,
    setSearch,
    filters: { q, status, progress },
    page,
    pageSize,
    setStatus: (v: string) => set({ [k("status")]: v, [pageKey]: null }),
    setProgress: (v: string) => set({ [k("progress")]: v, [pageKey]: null }),
    setPage: (p: number) => set({ [pageKey]: p === 1 ? null : p }),
    setPageSize: (s: number) => set({ [k("size")]: s === 10 ? null : s, [pageKey]: null }),
  };
}
