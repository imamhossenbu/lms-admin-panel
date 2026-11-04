"use client";

import React, { useEffect, useState } from "react";
import { useQuizCourses } from "@/lib/quizStorage";
import { emptyQuizWizard } from "@/lib/quizWizardMapping";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizWizardView } from "./QuizWizardView";
import { QuizWizardSkeleton } from "./shell/QuizWizardSkeleton";
import { quizWizardDraftKey, readQuizWizardDraft, type QuizWizardDraft } from "./shell/quizWizardDraft";

interface Loaded {
  baseValues: QuizWizardValues;
  draft: QuizWizardDraft | null;
}

const DRAFT_KEY = quizWizardDraftKey("create");

/** /quizzes/create — restores the sessionStorage draft (client-only) before mounting the form. */
export function CreateQuizWizard() {
  const courses = useQuizCourses();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after mount
    setLoaded({ baseValues: emptyQuizWizard(), draft: readQuizWizardDraft(DRAFT_KEY) });
  }, []);

  if (!loaded || !courses) return <QuizWizardSkeleton />;
  return <QuizWizardView mode="create" courses={courses} draftKey={DRAFT_KEY} {...loaded} />;
}

export default CreateQuizWizard;
