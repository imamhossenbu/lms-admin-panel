"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AssignmentCreatedView } from "@/components/assignments/wizard/success/AssignmentCreatedView";
import { AssignmentCreatedSkeleton } from "@/components/assignments/wizard/success/AssignmentCreatedSkeleton";

function AssignmentCreatedContent() {
  const params = useParams<{ id: string }>();
  return <AssignmentCreatedView key={params.id} assignmentId={params.id} />;
}

/** "Assignment Created Successfully" confirmation page. */
export default function AssignmentCreatedPage() {
  return (
    <Suspense fallback={<AssignmentCreatedSkeleton />}>
      <AssignmentCreatedContent />
    </Suspense>
  );
}
