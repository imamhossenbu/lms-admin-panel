"use client";

import React from "react";
import { Save, Send } from "lucide-react";
import type { NotificationTemplateItem } from "@/types/notification";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { TEMPLATE_FORM_ID } from "./templateUtils";

export interface TemplateEditorHeaderProps {
  template: NotificationTemplateItem;
  isSubmitting: boolean;
  isSendingTest: boolean;
  onSendTest: () => void;
}

/** 🏠 › Notifications › Templates › {name}, title and Send test / Save Changes. */
export function TemplateEditorHeader({ template, isSubmitting, isSendingTest, onSendTest }: TemplateEditorHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[
        { label: "Notifications", href: "/notifications" },
        { label: "Templates", href: "/notifications?tab=templates" },
        { label: template.name },
      ]}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">Edit Template</span>}
      subtitle="Change the wording and channels of this automated message."
    >
      <SecondaryButton leftIcon={<Send className="h-4 w-4" />} isLoading={isSendingTest} disabled={isSendingTest || isSubmitting} onClick={onSendTest}>
        {isSendingTest ? "Sending..." : "Send test"}
      </SecondaryButton>
      <TemplateSaveButton isSubmitting={isSubmitting} />
    </PageHeader>
  );
}

/** Orange submit button bound to the editor form by id (header + bottom bar). */
export function TemplateSaveButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <PrimaryButton type="submit" form={TEMPLATE_FORM_ID} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Save className="h-4 w-4" />}>
      {isSubmitting ? "Saving..." : "Save Changes"}
    </PrimaryButton>
  );
}

export default TemplateEditorHeader;
