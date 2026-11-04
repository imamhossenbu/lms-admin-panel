import { BarChart2, Briefcase, Camera, Code2, Globe, Heart, LayoutGrid, Megaphone, Music, Palette, type LucideIcon } from "lucide-react";
import type { CategoryIconOption } from "@/types/category";

export interface CategoryIconConfig extends CategoryIconOption {
  icon: LucideIcon;
  bg: string;
  text: string;
}

/** Icon choices for a category (stored as the `icon` id on the API). */
export const CATEGORY_ICONS: CategoryIconConfig[] = [
  { id: "code", label: "Development", icon: Code2, bg: "bg-purple-14", text: "text-purple" },
  { id: "design", label: "Design", icon: Palette, bg: "bg-red-14", text: "text-red" },
  { id: "marketing", label: "Marketing", icon: Megaphone, bg: "bg-brand-orange-light", text: "text-brand-orange" },
  { id: "business", label: "Business", icon: Briefcase, bg: "bg-green-bg", text: "text-green" },
  { id: "photography", label: "Photography", icon: Camera, bg: "bg-yellow-bg", text: "text-yellow" },
  { id: "data-science", label: "Data Science", icon: BarChart2, bg: "bg-blue-14", text: "text-blue" },
  { id: "language", label: "Language", icon: Globe, bg: "bg-blue-14", text: "text-blue" },
  { id: "health", label: "Health & Fitness", icon: Heart, bg: "bg-green-bg", text: "text-green" },
  { id: "music", label: "Music", icon: Music, bg: "bg-red-14", text: "text-red" },
  { id: "other", label: "Other", icon: LayoutGrid, bg: "bg-blue-14", text: "text-blue" },
];

export const CATEGORY_ICON_BY_ID: Record<string, CategoryIconConfig> = Object.fromEntries(CATEGORY_ICONS.map((i) => [i.id, i]));

/** "Web Design!" → "web-design" */
export const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
