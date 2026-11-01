"use client";

import { useCallback, useEffect, useState } from "react";
import type { LiveClassItem, LiveEnrollment } from "@/types/liveClass";
import { LIVE_CLASSES_UPDATED_EVENT, fetchLiveClasses, getLiveEnrollmentsSnapshot } from "@/lib/liveClassStorage";

/**
 * Loads all live classes + enrollments (mock storage), re-reads on LIVE_CLASSES_UPDATED_EVENT and
 * ticks `now` every 30s so derived statuses (Upcoming → Live Now → Completed) stay current.
 */
export function useLiveClassesData() {
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [enrollments, setEnrollments] = useState<LiveEnrollment[]>([]);
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
          setEnrollments(getLiveEnrollmentsSnapshot());
          setNow(new Date());
          setLoadError(null);
          setIsLoading(false);
        },
        () => {
          if (!alive) return;
          setLoadError("We couldn't read the live classes. Please try again.");
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

  return { classes, enrollments, now, isLoading, loadError, retry };
}

export default useLiveClassesData;
