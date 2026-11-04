"use client";

import { useCallback, useEffect, useState } from "react";
import { LIVE_CLASSES_UPDATED_EVENT, fetchLiveClasses, type LiveClassListItem } from "@/lib/liveClassStorage";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * Loads every live class (with attendee totals) from the API, re-reads on LIVE_CLASSES_UPDATED_EVENT and
 * ticks `now` every 30s so derived statuses (Upcoming → Live Now → Completed) stay current.
 */
export function useLiveClassesData() {
  const [classes, setClasses] = useState<LiveClassListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const sync = () =>
      fetchLiveClasses().then(
        (list) => {
          if (!alive) return;
          setClasses(list);
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
  }, [attempt]);

  return { classes, now, isLoading, loadError, retry };
}

export default useLiveClassesData;
