"use client";

import { useEffect, useState } from "react";
import type { CommunityThread } from "@/types/community";
import { getCommunitySnapshot } from "@/lib/communityStorage";
import { findSimilarThreads } from "./threadFormUtils";

export const SIMILAR_MIN_CHARS = 8;
const DEBOUNCE_MS = 300;

/** Debounced (300 ms) duplicate check over existing threads in the same course. Empty until the title has ≥ 8 characters. */
export function useSimilarThreads(title: string, courseId: string, excludeId?: string): CommunityThread[] {
  const [matches, setMatches] = useState<CommunityThread[]>([]);

  useEffect(() => {
    const trimmed = title.trim();
    const timer = window.setTimeout(() => {
      if (trimmed.length < SIMILAR_MIN_CHARS || !courseId) {
        setMatches([]);
        return;
      }
      try {
        setMatches(findSimilarThreads(getCommunitySnapshot().threads, trimmed, courseId, excludeId));
      } catch {
        setMatches([]);
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [title, courseId, excludeId]);

  return matches;
}

export default useSimilarThreads;
