import React from "react";
import { Award, BarChart3, BookOpen, Code2, Globe, HardDrive, Headphones, MessagesSquare, Palette, Sparkles, UserCog, Users, Video, type LucideIcon } from "lucide-react";
import type { FeatureMeta, LimitMeta } from "@/lib/planAccess";

/** FEATURE_META / LIMIT_META store lucide icon names; this maps them to components. */
export const META_ICONS: Record<FeatureMeta["icon"] | LimitMeta["icon"], LucideIcon> = {
  Video,
  Award,
  MessagesSquare,
  Sparkles,
  BarChart3,
  Globe,
  Palette,
  Code2,
  Headphones,
  Users,
  BookOpen,
  UserCog,
  HardDrive,
};

export function MetaIcon({ name, className }: { name: FeatureMeta["icon"] | LimitMeta["icon"]; className?: string }) {
  const Icon = META_ICONS[name];
  return <Icon className={className} />;
}
