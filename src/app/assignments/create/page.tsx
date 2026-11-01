"use client";

import React, { Suspense } from "react";
import { CreateAssignmentWizard } from "@/components/assignments/wizard/CreateAssignmentWizard";
import { WizardSkeleton } from "@/components/assignments/wizard/shell/WizardSkeleton";

/** Create Assignment — 7-step wizard (`?step=` keeps the current step across reloads). */
export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <CreateAssignmentWizard />
    </Suspense>
  );
}
