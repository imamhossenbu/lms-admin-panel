"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { TemplateDesignerView } from "@/components/certificates/designer/TemplateDesignerView";
import { TemplateDesignerSkeleton } from "@/components/certificates/designer/TemplateDesignerSkeleton";

function EditTemplateRoute() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  return <TemplateDesignerView mode="edit" templateId={decodeURIComponent(id)} />;
}

export default function EditCertificateTemplatePage() {
  return (
    <Suspense fallback={<TemplateDesignerSkeleton />}>
      <EditTemplateRoute />
    </Suspense>
  );
}
