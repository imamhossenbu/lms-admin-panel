"use client";

import React, { Suspense } from "react";
import { TemplateDesignerView } from "@/components/certificates/designer/TemplateDesignerView";
import { TemplateDesignerSkeleton } from "@/components/certificates/designer/TemplateDesignerSkeleton";

export default function NewCertificateTemplatePage() {
  return (
    <Suspense fallback={<TemplateDesignerSkeleton />}>
      <TemplateDesignerView mode="create" />
    </Suspense>
  );
}
