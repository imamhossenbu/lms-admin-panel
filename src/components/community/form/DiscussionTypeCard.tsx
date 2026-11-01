"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Layers } from "lucide-react";
import type { ThreadCategory } from "@/types/community";
import type { ThreadFormValues } from "@/validations/communitySchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { CATEGORY_VIEW, THREAD_CATEGORIES } from "@/components/community/shared/CategoryBadge";

const TYPE_DESCRIPTION: Record<ThreadCategory, string> = {
  QUESTION: "Ask something and mark the best answer",
  DISCUSSION: "Open conversation",
  ANNOUNCEMENT: "Course-wide update from staff",
  SHOWCASE: "Share a project",
  FEEDBACK: "Report an issue or suggestion",
};

export const DISCUSSION_TYPE_OPTIONS: ChoiceOption<ThreadCategory>[] = THREAD_CATEGORIES.map((c) => {
  const Icon = CATEGORY_VIEW[c].icon;
  return { value: c, title: CATEGORY_VIEW[c].label, description: TYPE_DESCRIPTION[c], icon: <Icon className="h-5 w-5" /> };
});

export interface DiscussionTypeCardProps {
  /** Called after the user picks a type (e.g. to pin announcements by default). */
  onTypeChange?: (next: ThreadCategory, prev: ThreadCategory) => void;
}

/** Five selectable type tiles (Question, Discussion, Announcement, Showcase, Feedback). */
export function DiscussionTypeCard({ onTypeChange }: DiscussionTypeCardProps) {
  const { control } = useFormContext<ThreadFormValues>();
  return (
    <IconSectionCard icon={<Layers className="h-5 w-5" />} title="Discussion Type" description="Choose what kind of post this is." tone="orange">
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <ChoiceCardGroup<ThreadCategory>
            name="discussion-type"
            aria-label="Discussion type"
            value={field.value}
            onChange={(next) => {
              const prev = field.value;
              field.onChange(next);
              if (next !== prev) onTypeChange?.(next, prev);
            }}
            options={DISCUSSION_TYPE_OPTIONS}
            columns={5}
            iconPosition="top"
          />
        )}
      />
    </IconSectionCard>
  );
}

export default DiscussionTypeCard;
