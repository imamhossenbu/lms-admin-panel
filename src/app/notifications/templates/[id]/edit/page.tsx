"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { TemplateEditorView } from "@/components/notifications/templates/TemplateEditorView";
import { TemplateEditorSkeleton } from "@/components/notifications/templates/TemplateEditorSkeleton";

function EditTemplateRoute() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  return <TemplateEditorView templateId={decodeURIComponent(id)} />;
}

/** Automated template editor (`?preview` survives reloads). */
export default function EditNotificationTemplatePage() {
  return (
    <Suspense fallback={<TemplateEditorSkeleton />}>
      <EditTemplateRoute />
    </Suspense>
  );
}
