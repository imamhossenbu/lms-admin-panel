"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/useUrlParams";

export const QA_PAGE_SIZE = 10;
export const QA_STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "ANSWERED", label: "Answered" },
  { value: "PENDING", label: "Pending" },
];

/** Q&A tab state in the URL: ?qstatus, ?qstudent, ?qq (debounced), ?qpage and the open ?question. */
export function useQaFilters() {
  const { get, set } = useUrlParams();
  const rawStatus = get("qstatus", "All");
  const status = QA_STATUS_OPTIONS.some((o) => o.value === rawStatus) ? rawStatus : "All";
  const student = get("qstudent", "All");
  const q = get("qq");
  const rawPage = Number(get("qpage", "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const questionId = get("question");

  const [search, setSearch] = useState(q);
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => set({ qq: search, qpage: null }), 250);
    return () => clearTimeout(t);
  }, [search, q, set]);

  return {
    status,
    student,
    q,
    page,
    questionId,
    search,
    setSearch,
    setStatus: (v: string) => set({ qstatus: v, qpage: null }),
    setStudent: (v: string) => set({ qstudent: v, qpage: null }),
    setPage: (p: number) => set({ qpage: p === 1 ? null : p }),
    openQuestion: (id: string | null) => set({ question: id }),
  };
}
