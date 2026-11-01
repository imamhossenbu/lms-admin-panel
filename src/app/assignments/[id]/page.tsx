"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AssignmentDetailsView } from "@/components/assignments/details/AssignmentDetailsView";
import { AssignmentDetailsSkeleton } from "@/components/assignments/details/AssignmentDetailsSkeleton";

/** Assignment Details: Overview, Submissions, Instructions, Rubric and Analytics tabs (`?tab=`). */
function AssignmentDetailsContent() {
  const params = useParams<{ id: string }>();
  return <AssignmentDetailsView key={params.id} assignmentId={params.id} />;
}

export default function AssignmentDetailsPage() {
  return (
    <Suspense fallback={<AssignmentDetailsSkeleton />}>
      <AssignmentDetailsContent />
    </Suspense>
  );
}
