"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchQuiz, useQuizCourses } from "@/lib/quizStorage";
import { quizToWizard } from "@/lib/quizWizardMapping";
import type { QuizItem } from "@/types/quiz";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizWizardView } from "./QuizWizardView";
import { QuizWizardSkeleton } from "./shell/QuizWizardSkeleton";
import { QuizWizardNotFound } from "./shell/QuizWizardNotFound";
import { quizWizardDraftKey, readQuizWizardDraft, type QuizWizardDraft } from "./shell/quizWizardDraft";

type State =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; existing: QuizItem; baseValues: QuizWizardValues; draft: QuizWizardDraft | null };

/** /quizzes/[id]/edit — loads the quiz, maps it to wizard values and restores any draft. */
export function EditQuizWizard({ quizId }: { quizId: string }) {
  const courses = useQuizCourses();
  const [state, setState] = useState<State>({ status: "loading" });
  const draftKey = quizWizardDraftKey("edit", quizId);

  useEffect(() => {
    let alive = true;
    fetchQuiz(quizId)
      .then((existing) => {
        if (!alive) return;
        if (!existing) return setState({ status: "missing" });
        setState({ status: "ready", existing, baseValues: quizToWizard(existing), draft: readQuizWizardDraft(draftKey) });
      })
      .catch(() => {
        if (!alive) return;
        toast.error("Couldn't load quiz", { description: "Please refresh the page and try again." });
        setState({ status: "missing" });
      });
    return () => {
      alive = false;
    };
  }, [quizId, draftKey]);

  if (state.status === "loading") return <QuizWizardSkeleton />;
  if (state.status === "missing") return <QuizWizardNotFound />;
  return (
    <QuizWizardView
      mode="edit"
      courses={courses ?? []}
      draftKey={draftKey}
      baseValues={state.baseValues}
      draft={state.draft}
      existing={state.existing}
    />
  );
}

export default EditQuizWizard;
