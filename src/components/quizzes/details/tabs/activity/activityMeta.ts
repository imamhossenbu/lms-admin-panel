import { Archive, Copy, EyeOff, FilePlus2, ListMinus, ListPlus, Pencil, Send, Settings2, type LucideIcon } from "lucide-react";
import type { QuizActivityKind } from "@/types/quiz";

export type ActivityTone = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";

export const ACTIVITY_META: Record<QuizActivityKind, { label: string; icon: LucideIcon; tone: ActivityTone }> = {
  CREATED: { label: "Created", icon: FilePlus2, tone: "blue" },
  UPDATED: { label: "Updated", icon: Pencil, tone: "orange" },
  PUBLISHED: { label: "Published", icon: Send, tone: "green" },
  UNPUBLISHED: { label: "Unpublished", icon: EyeOff, tone: "gray" },
  ARCHIVED: { label: "Archived", icon: Archive, tone: "yellow" },
  QUESTION_ADDED: { label: "Question Added", icon: ListPlus, tone: "purple" },
  QUESTION_REMOVED: { label: "Question Removed", icon: ListMinus, tone: "red" },
  SETTINGS_CHANGED: { label: "Settings Changed", icon: Settings2, tone: "blue" },
  DUPLICATED: { label: "Duplicated", icon: Copy, tone: "purple" },
};

export const ACTIVITY_KINDS = Object.keys(ACTIVITY_META) as QuizActivityKind[];

/** Token classes for the round icon on the timeline. */
export const ACTIVITY_ICON_TONE: Record<ActivityTone, string> = {
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  red: "bg-red-14 text-red",
  yellow: "bg-yellow-bg text-yellow",
  purple: "bg-purple-14 text-purple",
  orange: "bg-brand-orange-light text-brand-orange",
  gray: "bg-gray-bg text-primary-400",
};
