"use client";

import { useCallback, useEffect, useState } from "react";
import { LIVE_CLASSES_UPDATED_EVENT, fetchLiveClassPage, fetchLiveStats, type LiveClassListItem, type LiveClassPageQuery, type LiveListStats } from "@/lib/liveClassStorage";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * One page of live classes (server-side search / filters / sort) plus the KPI cards; re-read when the query
 * changes or on LIVE_CLASSES_UPDATED_EVENT. Ticks `now` every 30s so derived statuses stay current.
 */
export function useLiveClassesData(query: LiveClassPageQuery) {
  const [classes, setClasses] = useState<LiveClassListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<LiveListStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(query);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const q = JSON.parse(key) as LiveClassPageQuery;
    const sync = () =>
      Promise.all([fetchLiveClassPage(q), fetchLiveStats()]).then(
        ([page, s]) => {
          if (!alive) return;
          setClasses(page.data);
          setTotal(page.total);
          setStats(s);
          setNow(new Date());
          setLoadError(null);
          setIsLoading(false);
        },
        (err) => {
          if (!alive) return;
          setLoadError(apiErrorMessage(err, "We couldn't load the live classes. Please try again."));
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(LIVE_CLASSES_UPDATED_EVENT, onUpdate);
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => {
      alive = false;
      window.removeEventListener(LIVE_CLASSES_UPDATED_EVENT, onUpdate);
      window.clearInterval(timer);
    };
  }, [key, attempt]);

  return { classes, total, stats, now, isLoading, loadError, retry };
}

export default useLiveClassesData;
