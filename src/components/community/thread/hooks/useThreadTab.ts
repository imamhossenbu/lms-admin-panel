"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";

export type ThreadTab = "discussion" | "reports";
export type ReplySort = "oldest" | "newest";

/**
 * Thread page URL state: `?tab=` (discussion default, dropped from the URL), `?rsort=newest`
 * and `?review=<reportId>` (open Review modal). Must sit inside <Suspense>.
 */
export function useThreadTab(hasReports: boolean) {
  const { get, set } = useUrlParams();
  const rawTab = get("tab", "discussion");
  const activeTab: ThreadTab = rawTab === "reports" && hasReports ? "reports" : "discussion";
  const replySort: ReplySort = get("rsort") === "newest" ? "newest" : "oldest";
  const reviewId = get("review");

  const setActiveTab = useCallback((tab: ThreadTab) => set({ tab: tab === "discussion" ? null : tab, review: null }), [set]);
  const setReplySort = useCallback((s: ReplySort) => set({ rsort: s === "oldest" ? null : s }), [set]);
  const openReview = useCallback((reportId: string | null) => set(reportId ? { tab: "reports", review: reportId } : { review: null }), [set]);

  return { activeTab, setActiveTab, replySort, setReplySort, reviewId, openReview };
}

export type ThreadTabState = ReturnType<typeof useThreadTab>;
