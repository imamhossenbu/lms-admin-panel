"use client";

import React, { useEffect, useState } from "react";
import type { NotificationTemplateItem } from "@/types/notification";
import { fetchTemplateItem } from "@/lib/notificationStorage";
import { TemplateEditorForm } from "./TemplateEditorForm";
import { TemplateEditorSkeleton } from "./TemplateEditorSkeleton";
import { TemplateNotFound } from "./TemplateNotFound";

/** Route entry for /notifications/templates/[id]/edit: loads the template, then the form. Render inside <Suspense>. */
export function TemplateEditorView({ templateId }: { templateId: string }) {
  const [state, setState] = useState<{ id: string | null; template: NotificationTemplateItem | null }>({ id: null, template: null });

  useEffect(() => {
    let alive = true;
    fetchTemplateItem(templateId).then(
      (template) => alive && setState({ id: templateId, template }),
      () => alive && setState({ id: templateId, template: null })
    );
    return () => {
      alive = false;
    };
  }, [templateId]);

  if (state.id !== templateId) return <TemplateEditorSkeleton />;
  if (!state.template) return <TemplateNotFound />;
  return <TemplateEditorForm key={state.template.id} template={state.template} />;
}

export default TemplateEditorView;
