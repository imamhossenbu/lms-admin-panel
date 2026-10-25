import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import type { CourseLevel } from "./aiOutline";

export const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "ALL_LEVELS", label: "All Levels" },
];

export const levelLabel = (level?: string) => LEVEL_OPTIONS.find((l) => l.value === level)?.label ?? "";

export const LANGUAGE_OPTIONS = [
  "English",
  "Bengali",
  "Hindi",
  "Urdu",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Chinese",
  "Japanese",
];

/**
 * The backend has no subcategory model, so the options are derived from the
 * category name and the chosen subcategory is saved as a course tag.
 */
const SUBCATEGORY_MAP: { match: RegExp; options: string[] }[] = [
  { match: /web|frontend|fullstack|javascript|react/i, options: ["Frontend Development", "Backend Development", "Full-Stack Development", "Web Design", "Web Performance"] },
  { match: /ai|artificial|machine|data|neural|ml/i, options: ["Machine Learning", "Deep Learning", "Generative AI", "Data Science", "Computer Vision"] },
  { match: /cloud|devops|docker|aws/i, options: ["Cloud Platforms", "Containers & Kubernetes", "CI/CD", "Infrastructure as Code", "Site Reliability"] },
  { match: /security|cyber/i, options: ["Network Security", "Application Security", "Ethical Hacking", "Cryptography", "Security Compliance"] },
  { match: /mobile|android|ios|flutter/i, options: ["Android Development", "iOS Development", "Cross-Platform Apps", "Mobile UI/UX"] },
  { match: /design|ui|ux/i, options: ["UI Design", "UX Research", "Product Design", "Design Systems"] },
  { match: /business|marketing|finance/i, options: ["Digital Marketing", "Entrepreneurship", "Finance & Accounting", "Management"] },
  { match: /software|engineering|programming/i, options: ["Software Architecture", "Testing & QA", "Algorithms", "Clean Code"] },
];

const DEFAULT_SUBCATEGORIES = ["Fundamentals", "Advanced Topics", "Projects & Case Studies", "Certification Prep"];

export const subcategoryOptionsFor = (categoryName?: string) =>
  SUBCATEGORY_MAP.find((entry) => categoryName && entry.match.test(categoryName))?.options ?? DEFAULT_SUBCATEGORIES;

export const THUMBNAIL_UPLOAD = {
  accept: "image/png,image/jpeg,image/webp",
  types: ["image/png", "image/jpeg", "image/webp"],
  maxBytes: 5 * 1024 * 1024,
  title: "Upload Thumbnail",
  hint: "PNG, JPG (16:9 ratio)",
  subHint: "Recommended: 1280 × 720",
  typeError: "Please choose a PNG, JPG or WebP image.",
  sizeError: "Thumbnail images can be at most 5 MB.",
};

export const VIDEO_UPLOAD = {
  accept: "video/mp4,video/webm",
  types: ["video/mp4", "video/webm"],
  maxBytes: 500 * 1024 * 1024,
  title: "Upload Video",
  hint: "MP4, WebM (Max 500MB)",
  subHint: "Recommended: 1-3 minutes",
  typeError: "Please choose an MP4 or WebM video.",
  sizeError: "Promo videos can be at most 500 MB.",
};

export const CREATE_COURSE_STEPS = [
  { title: "Basic Information", subtitle: "Course details and media" },
  { title: "Curriculum", subtitle: "Modules and lessons" },
  { title: "Pricing & Access", subtitle: "Pricing and enrollment" },
  { title: "Additional Settings", subtitle: "Advanced options" },
  { title: "Review & Publish", subtitle: "Final check and publish" },
];

export const PREVIEW_TABS = ["overview", "curriculum", "instructor", "reviews"] as const;
export type PreviewTab = (typeof PREVIEW_TABS)[number];

export const isPreviewTab = (value: string | null): value is PreviewTab =>
  !!value && (PREVIEW_TABS as readonly string[]).includes(value);

export const EMPTY_BASIC_INFO: CourseBasicInfoInput = {
  title: "",
  shortDescription: "",
  description: "",
  thumbnail: "",
  promoVideo: "",
  categoryId: "",
  subcategory: "",
  language: "English",
  level: "BEGINNER",
  tags: [],
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Bullet items of the rich-text description, used as a fallback "What You'll Learn" list. */
export const listItemsFromHtml = (html: string, limit = 6) =>
  Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((m) => m[1].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean)
    .slice(0, limit);
