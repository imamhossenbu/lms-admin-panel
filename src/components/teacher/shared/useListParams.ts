"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";

export const PAGE_SIZES = [10, 20, 50];

/** Search, course, page and page size from the URL (+ setters that reset the page). */
export function useListParams() {
  const { get, getPage, set } = useUrlParams();
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];
  const onQuery = useCallback((v: string) => set({ q: v || null, page: null }), [set]);
  return {
    get,
    set,
    q: get("q"),
    courseId: get("course", "All"),
    page: getPage(),
    perPage,
    onQuery,
    onCourse: (v: string) => set({ course: v === "All" ? null : v, page: null }),
    onPage: (p: number) => set({ page: p }),
    onPerPage: (s: number) => set({ perPage: s === PAGE_SIZES[0] ? null : s, page: null }),
  };
}
