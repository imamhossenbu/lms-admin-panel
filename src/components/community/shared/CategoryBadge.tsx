import React from "react";
import { HelpCircle, Lightbulb, Megaphone, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";
import type { ThreadCategory } from "@/types/community";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";

/** Label, tone and icon per thread category (shared by list, thread and form). */
export const CATEGORY_VIEW: Record<ThreadCategory, { label: string; tone: Tone; icon: LucideIcon }> = {
  QUESTION: { label: "Question", tone: "blue", icon: HelpCircle },
  DISCUSSION: { label: "Discussion", tone: "purple", icon: MessagesSquare },
  ANNOUNCEMENT: { label: "Announcement", tone: "orange", icon: Megaphone },
  SHOWCASE: { label: "Showcase", tone: "green", icon: Sparkles },
  FEEDBACK: { label: "Feedback", tone: "yellow", icon: Lightbulb },
};

export const THREAD_CATEGORIES = Object.keys(CATEGORY_VIEW) as ThreadCategory[];

export interface CategoryBadgeProps {
  category: ThreadCategory;
  size?: "sm" | "md";
  className?: string;
}

/** Category pill (single line) with its icon. */
export function CategoryBadge({ category, size = "sm", className }: CategoryBadgeProps) {
  const view = CATEGORY_VIEW[category];
  const Icon = view.icon;
  return (
    <ToneBadge tone={view.tone} size={size} className={className} icon={<Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}>
      {view.label}
    </ToneBadge>
  );
}

export default CategoryBadge;
