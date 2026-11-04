"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadCourseContext } from "@/lib/courseCatalog";
import { emptyWizardValues } from "@/lib/assignmentWizardMapping";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { AssignmentWizardView } from "./AssignmentWizardView";
import { WizardSkeleton } from "./shell/WizardSkeleton";
import { readWizardDraft, wizardDraftKey, type WizardDraft } from "./shell/wizardDraft";

interface Loaded {
  baseValues: AssignmentWizardValues;
  draft: WizardDraft | null;
}

const DRAFT_KEY = wizardDraftKey("create");

/**
 * /assignments/create[?course=<id>] — `?course` preselects the course (and its first module); without it
 * the user picks one in step 1. Restores the sessionStorage draft (client-only) before mounting the form.
 */
export function CreateAssignmentWizard() {
  const courseParam = useSearchParams().get("course") ?? "";
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let alive = true;
    // ?course must be a course of this workspace; its first module is preselected.
    void (courseParam ? loadCourseContext(courseParam) : Promise.resolve(null)).then((ctx) => {
      if (!alive) return;
      const baseValues = emptyWizardValues(ctx ? courseParam : "", ctx?.modules[0]?.id ?? "");
      setLoaded({ baseValues, draft: readWizardDraft(DRAFT_KEY) });
    });
    return () => {
      alive = false;
    };
    // Read once on mount: the wizard rewrites the URL (?step) but the course preselection must not re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) return <WizardSkeleton />;
  return <AssignmentWizardView mode="create" draftKey={DRAFT_KEY} {...loaded} />;
}

export default CreateAssignmentWizard;
