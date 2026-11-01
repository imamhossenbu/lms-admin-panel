"use client";

import React from "react";
import { CircleCheck, EyeOff, MessagesSquare, Pin, SearchX, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import type { CommunityTab } from "./communityListUtils";

const TAB_EMPTY: Record<CommunityTab, { icon: LucideIcon; tint: string; title: string; text: string }> = {
  all: { icon: MessagesSquare, tint: "bg-gray-bg text-primary-300", title: "No discussions yet", text: "Start the first conversation for your students — share an announcement or open a discussion." },
  unanswered: { icon: CircleCheck, tint: "bg-green-bg text-green", title: "Every question has a reply", text: "Great job! New student questions without replies will show up here." },
  moderation: { icon: ShieldCheck, tint: "bg-green-bg text-green", title: "All clear", text: "There are no open reports. Reported discussions and replies will appear here." },
  pinned: { icon: Pin, tint: "bg-brand-orange-light text-brand-orange", title: "No pinned discussions", text: "Pin important threads from the ⋮ menu to keep them at the top of the list." },
  resolved: { icon: Sparkles, tint: "bg-blue-14 text-blue", title: "Nothing resolved yet", text: "Questions with an accepted answer and threads with a staff reply will show up here." },
  hidden: { icon: EyeOff, tint: "bg-gray-bg text-primary-300", title: "No hidden discussions", text: "Threads you hide from students are kept here so you can restore them later." },
};

export interface CommunityEmptyStateProps {
  tab: CommunityTab;
  isFiltered: boolean;
  onReset: () => void;
  onCreate: () => void;
}

/** Per-tab empty state, or "no matches" when filters are active. */
export function CommunityEmptyState({ tab, isFiltered, onReset, onCreate }: CommunityEmptyStateProps) {
  const copy = isFiltered
    ? { icon: SearchX, tint: "bg-gray-bg text-primary-300", title: "No discussions match your filters", text: "Try a different search term, course, category or date range." }
    : TAB_EMPTY[tab];
  const Icon = copy.icon;
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-full", copy.tint)}>
        <Icon className="h-6 w-6" />
      </span>
      <p className="body-medium font-semibold! text-primary-500">{copy.title}</p>
      <p className="max-w-sm body-sm-regular text-primary-300">{copy.text}</p>
      {isFiltered ? (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      ) : (
        tab === "all" && (
          <PrimaryButton size="sm" className="mt-2" onClick={onCreate}>
            New Discussion
          </PrimaryButton>
        )
      )}
    </div>
  );
}

export default CommunityEmptyState;
