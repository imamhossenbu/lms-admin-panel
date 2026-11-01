"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { QuizActivity, QuizAttempt, QuizItem } from "@/types/quiz";
import {
  QUIZZES_UPDATED_EVENT,
  fetchQuiz,
  fetchQuizActivity,
  fetchQuizAttempts,
  getQuizActivitySnapshot,
  getQuizAttemptsSnapshot,
  getQuizzesSnapshot,
} from "@/lib/quizStorage";

export type QuizDetailsState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; quiz: QuizItem; attempts: QuizAttempt[]; activity: QuizActivity[] };

/** Loads a quiz + attempts + activity, and re-reads them live whenever quiz storage changes. */
export function useQuizDetails(id: string) {
  const [state, setState] = useState<QuizDetailsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [quiz, attempts, activity] = await Promise.all([fetchQuiz(id), fetchQuizAttempts(id), fetchQuizActivity(id)]);
        if (cancelled) return;
        setState(quiz ? { status: "ready", quiz, attempts, activity } : { status: "notFound" });
      } catch {
        if (cancelled) return;
        toast.error("Couldn't load quiz", { description: "Please refresh the page and try again." });
        setState({ status: "notFound" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Live refresh (this tab's writes + other tabs via the storage event). A quiz removed while open keeps its
  // last data on screen so the delete flow can toast + navigate away without flashing "not found".
  useEffect(() => {
    const refresh = () => {
      const quiz = getQuizzesSnapshot().find((q) => q.id === id);
      if (!quiz) return;
      setState({ status: "ready", quiz, attempts: getQuizAttemptsSnapshot(id), activity: getQuizActivitySnapshot(id) });
    };
    window.addEventListener(QUIZZES_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(QUIZZES_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);

  const setQuiz = useCallback((quiz: QuizItem) => setState((s) => (s.status === "ready" ? { ...s, quiz } : s)), []);

  return { state, setQuiz };
}
