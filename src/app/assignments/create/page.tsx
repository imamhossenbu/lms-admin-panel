"use client";

import React, { Suspense } from "react";
import { AssignmentFormView } from "@/components/assignments/form/AssignmentFormView";
import { AssignmentFormSkeleton } from "@/components/assignments/form/AssignmentFormSkeleton";

export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={<AssignmentFormSkeleton />}>
      <AssignmentFormView mode="create" />
    </Suspense>
  );
}
