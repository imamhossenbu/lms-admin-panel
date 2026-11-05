"use client";

import { useCallback, useEffect, useState } from "react";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notificationStorage";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * Loads one page from the API for `query` (re-read when it changes or on NOTIFICATIONS_UPDATED_EVENT). The current
 * rows stay on screen while the next page loads; `isLoading` is only true before the first page arrives.
 */
export function useServerPage<Q, T>(query: Q, load: (q: Q) => Promise<{ data: T[]; total: number }>, errorText: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(query);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const q = JSON.parse(key) as Q;
    const sync = () =>
      load(q).then(
        (page) => {
          if (!alive) return;
          setRows(page.data);
          setTotal(page.total);
          setLoadError(null);
          setIsLoading(false);
        },
        (err) => {
          if (!alive) return;
          setLoadError(apiErrorMessage(err, errorText));
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdate);
    };
    // `load` / `errorText` are stable module functions / literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return { rows, total, isLoading, loadError, retry };
}
