"use client";

import React, { Suspense } from "react";
import { RoleEditorView } from "@/components/team/editor/RoleEditorView";
import { RoleEditorSkeleton } from "@/components/team/editor/RoleEditorSkeleton";

/** Create a custom role (`?from=<roleId>` starts from an existing role's permissions). */
export default function NewRolePage() {
  return (
    <Suspense fallback={<RoleEditorSkeleton />}>
      <RoleEditorView mode="create" />
    </Suspense>
  );
}
