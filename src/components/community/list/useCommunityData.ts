"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommunitySeed } from "@/data/mockCommunityData";
import { COMMUNITY_UPDATED_EVENT, fetchCommunity } from "@/lib/communityStorage";

const EMPTY: CommunitySeed = { threads: [], replies: [], reports: [] };

/** Loads threads + replies + reports (mock storage) and re-reads them on every COMMUNITY_UPDATED_EVENT. */
export function useCommunityData() {
  const [data, setData] = useState<CommunitySeed>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const sync = () =>
      fetchCommunity().then(
        (d) => {
          if (!alive) return;
          setData(d);
          setLoadError(null);
          setIsLoading(false);
        },
        () => {
          if (!alive) return;
          setLoadError("We couldn't read the community discussions. Please try again.");
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(COMMUNITY_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(COMMUNITY_UPDATED_EVENT, onUpdate);
    };
  }, [attempt]);

  return { ...data, isLoading, loadError, retry };
}

export default useCommunityData;
