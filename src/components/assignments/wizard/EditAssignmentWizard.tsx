"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchAssignment } from "@/lib/assignmentStorage";
import { assignmentToWizard } from "@/lib/assignmentWizardMapping";
import type { AssignmentItem } from "@/types/assignment";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { AssignmentNotFound } from "@/components/assignments/details/AssignmentNotFound";
import { AssignmentWizardView } from "./AssignmentWizardView";
import { WizardSkeleton } from "./shell/WizardSkeleton";
import { readWizardDraft, wizardDraftKey, type WizardDraft } from "./shell/wizardDraft";

type State =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; existing: AssignmentItem; baseValues: AssignmentWizardValues; draft: WizardDraft | null };

/** /assignments/[id]/edit — loads the assignment, maps it to wizard values and restores any draft. */
export function EditAssignmentWizard({ assignmentId }: { assignmentId: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const draftKey = wizardDraftKey("edit", assignmentId);

  useEffect(() => {
    let alive = true;
    fetchAssignment(assignmentId)
      .then((existing) => {
        if (!alive) return;
        if (!existing) return setState({ status: "missing" });
        setState({
          status: "ready",
          existing,
          baseValues: assignmentToWizard(existing),
          draft: readWizardDraft(draftKey),
        });
      })
      .catch(() => {
        if (!alive) return;
        toast.error("Couldn't load assignment", { description: "Please refresh the page and try again." });
        setState({ status: "missing" });
      });
    return () => {
      alive = false;
    };
  }, [assignmentId, draftKey]);

  if (state.status === "loading") return <WizardSkeleton />;
  if (state.status === "missing") return <AssignmentNotFound />;
  return (
    <AssignmentWizardView
      mode="edit"
      draftKey={draftKey}
      baseValues={state.baseValues}
      draft={state.draft}
      existing={state.existing}
    />
  );
}

export default EditAssignmentWizard;
