"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { QUIZZES_UPDATED_EVENT, fetchQuizzes, getQuizAttemptsSnapshot } from "@/lib/quizStorage";

/** Loads all quizzes + attempts (mock storage) and re-reads them on every QUIZZES_UPDATED_EVENT. */
export function useQuizzesData() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
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
          setAttempts(getQuizAttemptsSnapshot());
          setLoadError(null);
          setIsLoading(false);
        },
        () => {
          if (!alive) return;
          setLoadError("We couldn't read the quizzes. Please try again.");
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

  return { quizzes, attempts, isLoading, loadError, retry };
}

export default useQuizzesData;
