"use client";

import React from "react";
import { Award, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { DesignerMode } from "./designerUtils";

export const TEMPLATE_FORM_ID = "certificate-template-form";

export interface TemplateDesignerHeaderProps {
  mode: DesignerMode;
  templateName?: string;
  isSubmitting: boolean;
  disabled?: boolean;
}

/** Breadcrumb (🏠 › Certificates › Templates › New Template / {name}) + title + orange save button. */
export function TemplateDesignerHeader({ mode, templateName, isSubmitting, disabled }: TemplateDesignerHeaderProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Certificates", href: "/certificates" },
    { label: "Templates", href: "/certificates?tab=templates" },
    { label: mode === "create" ? "New Template" : templateName || "Edit Template" },
  ];

  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      title={<span className="heading-h3 font-bold! text-primary-500 tracking-tight">{mode === "create" ? "New Certificate Template" : "Edit Certificate Template"}</span>}
      subtitle={
        mode === "create"
          ? "Design the certificate learners receive and decide when it is issued."
          : "Update the design, content, signatures and issue rules of this template."
      }
    >
      <TemplateSubmitButton mode={mode} isSubmitting={isSubmitting} disabled={disabled} />
    </PageHeader>
  );
}

/** Orange submit button bound to the form by id (header + bottom bar). */
export function TemplateSubmitButton({ mode, isSubmitting, disabled }: { mode: DesignerMode; isSubmitting: boolean; disabled?: boolean }) {
  return (
    <PrimaryButton
      type="submit"
      form={TEMPLATE_FORM_ID}
      isLoading={isSubmitting}
      disabled={isSubmitting || disabled}
      leftIcon={mode === "create" ? <Award className="h-4 w-4" /> : <Save className="h-4 w-4" />}
    >
      {isSubmitting ? "Saving..." : mode === "create" ? "Create Template" : "Save Changes"}
    </PrimaryButton>
  );
}

export default TemplateDesignerHeader;
