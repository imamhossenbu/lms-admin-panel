"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { RoleEditorView } from "@/components/team/editor/RoleEditorView";
import { RoleEditorSkeleton } from "@/components/team/editor/RoleEditorSkeleton";

function EditRoleRoute() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  return <RoleEditorView key={id} mode="edit" roleId={decodeURIComponent(id)} />;
}

/** Edit a custom role, or view a system role read-only. */
export default function EditRolePage() {
  return (
    <Suspense fallback={<RoleEditorSkeleton />}>
      <EditRoleRoute />
    </Suspense>
  );
}
