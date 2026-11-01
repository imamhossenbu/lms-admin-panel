"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { EditAssignmentWizard } from "@/components/assignments/wizard/EditAssignmentWizard";
import { WizardSkeleton } from "@/components/assignments/wizard/shell/WizardSkeleton";

function EditAssignmentContent() {
  const params = useParams<{ id: string }>();
  return <EditAssignmentWizard key={params.id} assignmentId={params.id} />;
}

/** Edit Assignment — same 7-step wizard, every step reachable (`?step=instructions` deep links). */
export default function EditAssignmentPage() {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <EditAssignmentContent />
    </Suspense>
  );
}
