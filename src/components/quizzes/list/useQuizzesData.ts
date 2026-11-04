"use client";

import { useCallback, useEffect, useState } from "react";
import { QUIZZES_UPDATED_EVENT, fetchQuizzes, type QuizListItem } from "@/lib/quizStorage";
import { apiErrorMessage } from "@/lib/apiError";

/** Loads every quiz (with attempt totals) from the API and re-reads them on every QUIZZES_UPDATED_EVENT. */
export function useQuizzesData() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
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
      fetchQuizzes().then(
        (list) => {
          if (!alive) return;
          setQuizzes(list);
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
  }, [attempt]);

  return { quizzes, isLoading, loadError, retry };
}

export default useQuizzesData;
