"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { SUBMISSION_SORT_OPTIONS, SUBMISSION_STATUS_OPTIONS } from "./submissionFilters";

export const SUBMISSION_PAGE_SIZES = [8, 10, 20, 50];
export type SubmissionsView = "list" | "grid";

const oneOf = (value: string, options: { value: string }[], fallback: string) => (options.some((o) => o.value === value) ? value : fallback);

/** Submissions tab filters in the URL: ?sq, ?sstatus, ?sgroup, ?ssort, ?spage, ?ssize, ?sview. */
export function useSubmissionsFilters() {
  const { get, set } = useUrlParams();
  const q = get("sq");
  const status = oneOf(get("sstatus", "All"), SUBMISSION_STATUS_OPTIONS, "All");
  const group = get("sgroup", "All");
  const sort = oneOf(get("ssort", "newest"), SUBMISSION_SORT_OPTIONS, "newest");
  const rawPage = Number(get("spage", "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawSize = Number(get("ssize", "8"));
  const pageSize = SUBMISSION_PAGE_SIZES.includes(rawSize) ? rawSize : 8;
  const view: SubmissionsView = get("sview") === "grid" ? "grid" : "list";

  // Debounced search box → URL.
  const [search, setSearch] = useState(q);
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => set({ sq: search, spage: null }), 250);
    return () => clearTimeout(t);
  }, [search, q, set]);

  return {
    search,
    setSearch,
    filters: { q, status, group, sort },
    page,
    pageSize,
    view,
    setStatus: (v: string) => set({ sstatus: v, spage: null }),
    setGroup: (v: string) => set({ sgroup: v, spage: null }),
    setSort: (v: string) => set({ ssort: v === "newest" ? null : v, spage: null }),
    setPage: (p: number) => set({ spage: p === 1 ? null : p }),
    setPageSize: (s: number) => set({ ssize: s === 8 ? null : s, spage: null }),
    setView: (v: SubmissionsView) => set({ sview: v === "list" ? null : v }),
  };
}
