"use client";

import React from "react";
import { CalendarPlus, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { LiveFormMode } from "./liveFormUtils";

export const LIVE_FORM_ID = "live-class-form";

export interface LiveClassFormHeaderProps {
  mode: LiveFormMode;
  classId?: string;
  classTitle?: string;
  isSubmitting: boolean;
  disabled?: boolean;
}

/** Breadcrumb + "Schedule Live Class" / "Edit Live Class" and the submit button (no page-level back button). */
export function LiveClassFormHeader({ mode, classId, classTitle, isSubmitting, disabled }: LiveClassFormHeaderProps) {
  const breadcrumbs: BreadcrumbItem[] =
    mode === "create"
      ? [{ label: "Live Classes", href: "/live-classes" }, { label: "Schedule Live Class" }]
      : [{ label: "Live Classes", href: "/live-classes" }, { label: classTitle || "Live Class", href: `/live-classes/${classId}` }, { label: "Edit" }];

  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={breadcrumbs}
      title={<span className="heading-h3 font-bold! text-primary-500 tracking-tight">{mode === "create" ? "Schedule Live Class" : "Edit Live Class"}</span>}
      subtitle={mode === "create" ? "Create a new live class session for your course." : "Update the details, schedule and settings of this live class."}
    >
      <LiveFormSubmitButton mode={mode} isSubmitting={isSubmitting} disabled={disabled} />
    </PageHeader>
  );
}

/** Orange submit button bound to the form by id (used in the header and the bottom bar). */
export function LiveFormSubmitButton({ mode, isSubmitting, disabled }: { mode: LiveFormMode; isSubmitting: boolean; disabled?: boolean }) {
  return (
    <PrimaryButton
      type="submit"
      form={LIVE_FORM_ID}
      isLoading={isSubmitting}
      disabled={isSubmitting || disabled}
      leftIcon={mode === "create" ? <CalendarPlus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
    >
      {isSubmitting ? (mode === "create" ? "Scheduling..." : "Saving...") : mode === "create" ? "Schedule Class" : "Save Changes"}
    </PrimaryButton>
  );
}

export default LiveClassFormHeader;
