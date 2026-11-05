"use client";

import { useCallback, useEffect, useState } from "react";
import { QUIZZES_UPDATED_EVENT, fetchQuizPage, fetchQuizStats, type QuizListItem, type QuizListStats, type QuizPageQuery } from "@/lib/quizStorage";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * One page of quizzes (server-side search / filters / sort) plus the stat cards, re-read whenever the query
 * changes or QUIZZES_UPDATED_EVENT fires. `isLoading` is only true for the first load (later pages keep the
 * current rows on screen until the next page arrives).
 */
export function useQuizzesData(query: QuizPageQuery) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<QuizListStats | null>(null);
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
    const q = JSON.parse(key) as QuizPageQuery;
    const sync = () =>
      Promise.all([fetchQuizPage(q), fetchQuizStats()]).then(
        ([page, s]) => {
          if (!alive) return;
          setQuizzes(page.data);
          setTotal(page.total);
          setStats(s);
          setLoadError(null);
          setIsLoading(false);
        },
        (err) => {
          if (!alive) return;
          setLoadError(apiErrorMessage(err, "We couldn't load the quizzes. Please try again."));
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(QUIZZES_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(QUIZZES_UPDATED_EVENT, onUpdate);
    };
  }, [key, attempt]);

  return { quizzes, total, stats, isLoading, loadError, retry };
}

export default useQuizzesData;
