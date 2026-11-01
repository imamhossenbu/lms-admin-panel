"use client";

import React, { useEffect, useState } from "react";
import type { CertificateTemplate } from "@/types/certificate";
import { fetchTemplate } from "@/lib/certificateStorage";
import { TemplateDesignerForm } from "./TemplateDesignerForm";
import { TemplateDesignerSkeleton } from "./TemplateDesignerSkeleton";
import { TemplateNotFound } from "./TemplateNotFound";

export type TemplateDesignerViewProps = { mode: "create" } | { mode: "edit"; templateId: string };

/** Route entry for /certificates/templates/new and /certificates/templates/[id]/edit (loads the template when editing). */
export function TemplateDesignerView(props: TemplateDesignerViewProps) {
  const templateId = props.mode === "edit" ? props.templateId : null;
  const [state, setState] = useState<{ id: string | null; item: CertificateTemplate | null; loaded: boolean }>({ id: null, item: null, loaded: false });

  useEffect(() => {
    if (!templateId) return;
    let alive = true;
    fetchTemplate(templateId).then(
      (item) => alive && setState({ id: templateId, item, loaded: true }),
      () => alive && setState({ id: templateId, item: null, loaded: true })
    );
    return () => {
      alive = false;
    };
  }, [templateId]);

  if (!templateId) return <TemplateDesignerForm mode="create" />;
  if (!state.loaded || state.id !== templateId) return <TemplateDesignerSkeleton />;
  if (!state.item) return <TemplateNotFound />;
  return <TemplateDesignerForm key={state.item.id} mode="edit" original={state.item} />;
}

export default TemplateDesignerView;
