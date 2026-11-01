"use client";

import React from "react";
import { Archive, BellOff, CircleCheck, SearchX, type LucideIcon } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import type { InboxStatus } from "./inboxUtils";

const COPY: Record<InboxStatus, { icon: LucideIcon; tint: string; title: string; text: string }> = {
  unread: { icon: CircleCheck, tint: "bg-green-bg text-green", title: "You're all caught up", text: "New enrollments, payments, submissions and alerts will show up here." },
  all: { icon: BellOff, tint: "bg-gray-bg text-primary-300", title: "No notifications yet", text: "Activity across your academy will appear here as it happens." },
  archived: { icon: Archive, tint: "bg-gray-bg text-primary-300", title: "No archived notifications", text: "Notifications you archive are kept here so you can restore them later." },
};

export interface InboxEmptyStateProps {
  status: InboxStatus;
  /** Search / category / priority narrow the list → "no matches" with Reset. */
  isNarrowed: boolean;
  onReset: () => void;
}

/** Per-view empty state ("You're all caught up") or "no matches" when filters are active. */
export function InboxEmptyState({ status, isNarrowed, onReset }: InboxEmptyStateProps) {
  const copy = isNarrowed
    ? { icon: SearchX, tint: "bg-gray-bg text-primary-300", title: "No notifications match your filters", text: "Try a different search term, category or priority." }
    : COPY[status];
  const Icon = copy.icon;
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-dash px-4 py-12 text-center">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-full", copy.tint)}>
        <Icon className="h-6 w-6" />
      </span>
      <p className="body-medium font-semibold! text-primary-500">{copy.title}</p>
      <p className="max-w-sm body-sm-regular text-primary-300">{copy.text}</p>
      {isNarrowed && (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      )}
    </div>
  );
}

export default InboxEmptyState;
