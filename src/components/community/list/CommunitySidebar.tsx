"use client";

import React from "react";
import type { ThreadCategory } from "@/types/community";
import type { ModerationQueueItem } from "@/lib/communityStorage";
import { cn } from "@/lib/cn";
import { ModerationQueueCard } from "./ModerationQueueCard";
import { TopContributorsCard, type Contributor } from "./TopContributorsCard";
import { TrendingTagsCard } from "./TrendingTagsCard";
import { CategoryBreakdownCard } from "./CategoryBreakdownCard";

export interface CommunitySidebarProps {
  queue: ModerationQueueItem[];
  contributors: Contributor[];
  tags: { tag: string; score: number }[];
  categoryCounts: Record<ThreadCategory, number>;
  query: string;
  category: string;
  onReview: (threadId: string) => void;
  onTag: (tag: string) => void;
  onCategory: (category: ThreadCategory | null) => void;
  /** "column" = sticky right column (list view); "grid" = 2-up grid under the full-width table. */
  layout?: "column" | "grid";
}

/** Moderation Queue, Top Contributors, Trending Tags and By Category. */
export function CommunitySidebar({ queue, contributors, tags, categoryCounts, query, category, onReview, onTag, onCategory, layout = "column" }: CommunitySidebarProps) {
  return (
    <aside className={cn("gap-5", layout === "column" ? "flex flex-col xl:sticky xl:top-5" : "grid grid-cols-1 lg:grid-cols-2")}>
      <ModerationQueueCard index={0} queue={queue} onReview={onReview} />
      <TopContributorsCard index={1} contributors={contributors} />
      <TrendingTagsCard index={2} tags={tags} activeQuery={query} onSelect={onTag} />
      <CategoryBreakdownCard index={3} counts={categoryCounts} activeCategory={category} onSelect={onCategory} />
    </aside>
  );
}

export default CommunitySidebar;
