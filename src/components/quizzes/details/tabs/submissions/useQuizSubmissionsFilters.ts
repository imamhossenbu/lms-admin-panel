"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { ATTEMPT_OPTIONS, RESULT_OPTIONS, SORT_OPTIONS, SUBMISSION_PAGE_SIZES, type SubmissionFilters } from "./submissionFilters";

const oneOf = (value: string, options: readonly { value: string }[], fallback: string) => (options.some((o) => o.value === value) ? value : fallback);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Submissions tab state in the URL: ?sq, ?result, ?attempt, ?from, ?to, ?ssort, ?spage, ?ssize. */
export function useQuizSubmissionsFilters() {
  const { get, set } = useUrlParams();
  const filters: SubmissionFilters = {
    q: get("sq"),
    result: oneOf(get("result", "All"), RESULT_OPTIONS, "All"),
    attempt: oneOf(get("attempt", "All"), ATTEMPT_OPTIONS, "All"),
    from: DATE.test(get("from")) ? get("from") : "",
    to: DATE.test(get("to")) ? get("to") : "",
    sort: oneOf(get("ssort", "newest"), SORT_OPTIONS, "newest"),
  };
  const rawPage = Number(get("spage", "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawSize = Number(get("ssize", "10"));
  const pageSize = SUBMISSION_PAGE_SIZES.includes(rawSize) ? rawSize : 10;

  // Debounced search box → URL.
  const [search, setSearch] = useState(filters.q);
  useEffect(() => {
    if (search === filters.q) return;
    const t = setTimeout(() => set({ sq: search, spage: null }), 250);
    return () => clearTimeout(t);
  }, [search, filters.q, set]);

  const isFiltered = Boolean(filters.q || filters.result !== "All" || filters.attempt !== "All" || filters.from || filters.to || filters.sort !== "newest");

  return {
    search,
    setSearch,
    filters,
    page,
    pageSize,
    isFiltered,
    setResult: (v: string) => set({ result: v, spage: null }),
    setAttempt: (v: string) => set({ attempt: v, spage: null }),
    setRange: (r: { from?: string; to?: string }) => set({ from: r.from ?? null, to: r.to ?? null, spage: null }),
    setSort: (v: string) => set({ ssort: v === "newest" ? null : v, spage: null }),
    setPage: (p: number) => set({ spage: p === 1 ? null : p }),
    setPageSize: (s: number) => set({ ssize: s === 10 ? null : s, spage: null }),
    reset: () => {
      setSearch("");
      set({ sq: null, result: null, attempt: null, from: null, to: null, ssort: null, spage: null });
    },
  };
}
