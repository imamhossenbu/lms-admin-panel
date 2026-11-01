"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ComposeActionButtons, type ComposeBusy } from "./ComposeActionButtons";
import type { ComposeMode } from "./composeUtils";

export interface ComposeHeaderProps {
  mode: ComposeMode;
  broadcastId?: string;
  broadcastTitle?: string;
  busy: ComposeBusy;
  onSaveDraft: () => void;
}

/** Breadcrumb trail for the compose / edit pages. */
export function composeBreadcrumbs(mode: ComposeMode, broadcastId?: string, broadcastTitle?: string): BreadcrumbItem[] {
  const base: BreadcrumbItem[] = [
    { label: "Notifications", href: "/notifications" },
    { label: "Broadcasts", href: "/notifications?tab=broadcasts" },
  ];
  return mode === "create"
    ? [...base, { label: "New Broadcast" }]
    : [...base, { label: broadcastTitle || "Broadcast", href: `/notifications/broadcasts/${broadcastId}` }, { label: "Edit" }];
}

/** Breadcrumb + "New Broadcast" / "Edit Broadcast" with Save as Draft + Send in the top-right. */
export function ComposeHeader({ mode, broadcastId, broadcastTitle, busy, onSaveDraft }: ComposeHeaderProps) {
  return (
    <PageHeader
      breadcrumbs={composeBreadcrumbs(mode, broadcastId, broadcastTitle)}
      title={<span className="heading-h3 font-bold! text-primary-500">{mode === "create" ? "New Broadcast" : "Edit Broadcast"}</span>}
      subtitle={mode === "create" ? "Send an announcement to students or instructors across In-app, Email and Push." : "Update this broadcast before it goes out."}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ComposeActionButtons busy={busy} onSaveDraft={onSaveDraft} />
      </div>
    </PageHeader>
  );
}

export default ComposeHeader;
