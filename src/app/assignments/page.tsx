"use client";

import React, { Suspense } from "react";
import { AssignmentsListView } from "@/components/assignments/list/AssignmentsListView";
import { AssignmentsListSkeleton } from "@/components/assignments/list/AssignmentsListSkeleton";

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<AssignmentsListSkeleton />}>
      <AssignmentsListView />
    </Suspense>
  );
}

