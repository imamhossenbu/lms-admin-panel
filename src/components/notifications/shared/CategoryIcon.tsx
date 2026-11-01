import React from "react";
import { Award, CreditCard, FileCheck, MessageSquare, Settings, UserPlus, Video, type LucideIcon } from "lucide-react";
import type { NotificationCategory } from "@/types/notification";
import { cn } from "@/lib/cn";

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  /** Token tint for the icon tile. */
  tint: string;
  /** URL value for ?category=. */
  param: string;
}

export const CATEGORY_META: Record<NotificationCategory, CategoryMeta> = {
  ENROLLMENT: { label: "Enrollment", icon: UserPlus, tint: "bg-blue-14 text-blue", param: "enrollment" },
  PAYMENT: { label: "Payment", icon: CreditCard, tint: "bg-green-bg text-green", param: "payment" },
  SUBMISSION: { label: "Submission", icon: FileCheck, tint: "bg-purple-14 text-purple", param: "submission" },
  COMMUNITY: { label: "Community", icon: MessageSquare, tint: "bg-brand-orange-light text-brand-orange", param: "community" },
  LIVE_CLASS: { label: "Live class", icon: Video, tint: "bg-red-14 text-red", param: "live-class" },
  CERTIFICATE: { label: "Certificate", icon: Award, tint: "bg-yellow-bg text-yellow", param: "certificate" },
  SYSTEM: { label: "System", icon: Settings, tint: "bg-gray-bg text-primary-400", param: "system" },
};

export const NOTIFICATION_CATEGORIES = Object.keys(CATEGORY_META) as NotificationCategory[];

const SIZE = {
  sm: { box: "h-8 w-8 rounded-lg", icon: "h-4 w-4" },
  md: { box: "h-9 w-9 rounded-xl", icon: "h-4 w-4" },
  lg: { box: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
} as const;

export interface CategoryIconProps {
  category: NotificationCategory;
  size?: keyof typeof SIZE;
  className?: string;
}

/** Token-tinted icon tile for a notification category (inbox rows, navbar dropdown, filters). */
export function CategoryIcon({ category, size = "md", className }: CategoryIconProps) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.SYSTEM;
  const Icon = meta.icon;
  return (
    <span aria-hidden className={cn("flex shrink-0 items-center justify-center", SIZE[size].box, meta.tint, className)}>
      <Icon className={SIZE[size].icon} />
    </span>
  );
}

export default CategoryIcon;
