"use client";

import React from "react";
import { Save, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { ThreadFormMode } from "./threadFormUtils";

export const DISCUSSION_FORM_ID = "community-discussion-form";

export interface DiscussionFormHeaderProps {
  mode: ThreadFormMode;
  threadId?: string;
  threadTitle?: string;
  isSubmitting: boolean;
}

/** Breadcrumb + "New Discussion" / "Edit Discussion" and the submit button (no page-level back button). */
export function DiscussionFormHeader({ mode, threadId, threadTitle, isSubmitting }: DiscussionFormHeaderProps) {
  const breadcrumbs: BreadcrumbItem[] =
    mode === "create"
      ? [{ label: "Community", href: "/community" }, { label: "New Discussion" }]
      : [{ label: "Community", href: "/community" }, { label: threadTitle || "Discussion", href: `/community/${threadId}` }, { label: "Edit" }];

  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      title={<span className="heading-h3 font-bold! text-primary-500 tracking-tight">{mode === "create" ? "New Discussion" : "Edit Discussion"}</span>}
      subtitle={mode === "create" ? "Start a conversation, ask a question or post an update for a course." : "Update the content, course and moderation settings of this discussion."}
    >
      <DiscussionSubmitButton mode={mode} isSubmitting={isSubmitting} />
    </PageHeader>
  );
}

/** Orange submit button bound to the form by id (used in the header and the bottom bar). */
export function DiscussionSubmitButton({ mode, isSubmitting }: { mode: ThreadFormMode; isSubmitting: boolean }) {
  return (
    <PrimaryButton
      type="submit"
      form={DISCUSSION_FORM_ID}
      isLoading={isSubmitting}
      disabled={isSubmitting}
      leftIcon={mode === "create" ? <Send className="h-4 w-4" /> : <Save className="h-4 w-4" />}
    >
      {isSubmitting ? (mode === "create" ? "Publishing..." : "Saving...") : mode === "create" ? "Publish Discussion" : "Save Changes"}
    </PrimaryButton>
  );
}

export default DiscussionFormHeader;
