"use client";

import React, { useEffect, useState } from "react";
import { MOCK_LESSON_COURSE_ID } from "@/data/mockLessonEditorData";
import { getLessonEditorContext } from "@/lib/lessonEditorStorage";
import { emptyWizardValues } from "@/lib/assignmentWizardMapping";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { AssignmentWizardView } from "./AssignmentWizardView";
import { WizardSkeleton } from "./shell/WizardSkeleton";
import { readWizardDraft, wizardDraftKey, type WizardDraft } from "./shell/wizardDraft";

interface Loaded {
  context: LessonEditorContext;
  baseValues: AssignmentWizardValues;
  draft: WizardDraft | null;
}

const DRAFT_KEY = wizardDraftKey("create");

/** /assignments/create — restores the sessionStorage draft (client-only) before mounting the form. */
export function CreateAssignmentWizard() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    const context = getLessonEditorContext(MOCK_LESSON_COURSE_ID);
    const baseValues = emptyWizardValues(context.course.id, context.modules[0]?.id ?? "");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after mount
    setLoaded({ context, baseValues, draft: readWizardDraft(DRAFT_KEY) });
  }, []);

  if (!loaded) return <WizardSkeleton />;
  return <AssignmentWizardView mode="create" draftKey={DRAFT_KEY} {...loaded} />;
}

export default CreateAssignmentWizard;
