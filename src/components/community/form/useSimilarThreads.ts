"use client";

import { useEffect, useState } from "react";
import type { CommunityThread } from "@/types/community";
import { fetchSimilarThreads } from "@/lib/communityStorage";

export const SIMILAR_MIN_CHARS = 8;
const DEBOUNCE_MS = 300;

/** Debounced (300 ms) duplicate check (GET /admin/community/similar) over threads in the same course. Empty until the title has ≥ 8 characters. */
export function useSimilarThreads(title: string, courseId: string, excludeId?: string): CommunityThread[] {
  const [matches, setMatches] = useState<CommunityThread[]>([]);

  useEffect(() => {
    const trimmed = title.trim();
    let alive = true;
    const timer = window.setTimeout(() => {
      if (trimmed.length < SIMILAR_MIN_CHARS || !courseId) {
        setMatches([]);
        return;
      }
      fetchSimilarThreads(trimmed, courseId, excludeId).then(
        (rows) => alive && setMatches(rows),
        () => alive && setMatches([])
      );
    }, DEBOUNCE_MS);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [title, courseId, excludeId]);

  return matches;
}

export default useSimilarThreads;
