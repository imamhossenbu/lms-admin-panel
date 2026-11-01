"use client";

import React from "react";
import { History, Inbox } from "lucide-react";
import type { QuizActivity } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { ActivityItem } from "./ActivityItem";

export interface ActivityTimelineCardProps {
  items: QuizActivity[];
  kind: string;
  kindOptions: { value: string; label: string }[];
  onKindChange: (kind: string) => void;
}

/** Vertical, newest-first timeline of quiz events with a kind filter. */
export function ActivityTimelineCard({ items, kind, kindOptions, onKindChange }: ActivityTimelineCardProps) {
  return (
    <IconSectionCard
      icon={<History className="h-5 w-5" />}
      title="Activity Log"
      description="Every change made to this quiz, newest first."
      action={<AppSelect size="sm" value={kind} onValueChange={onKindChange} options={kindOptions} />}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-12 text-center">
          <Inbox className="h-8 w-8 text-primary-300" />
          <p className="mt-2 body-sm-medium text-primary-500">No activity to show</p>
          <p className="mt-0.5 max-w-xs body-xsm-regular text-primary-300">
            {kind === "All" ? "Changes to this quiz will be recorded here." : "No events of this type yet. Try another filter."}
          </p>
        </div>
      ) : (
        <ol>
          {items.map((item, i) => (
            <ActivityItem key={item.id} item={item} index={i} isLast={i === items.length - 1} />
          ))}
        </ol>
      )}
    </IconSectionCard>
  );
}

export default ActivityTimelineCard;
