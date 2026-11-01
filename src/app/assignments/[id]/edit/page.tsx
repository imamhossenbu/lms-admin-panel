"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AssignmentFormView } from "@/components/assignments/form/AssignmentFormView";
import { AssignmentFormSkeleton } from "@/components/assignments/form/AssignmentFormSkeleton";

export default function EditAssignmentPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Suspense fallback={<AssignmentFormSkeleton />}>
      <AssignmentFormView mode="edit" assignmentId={id} />
    </Suspense>
  );
}
