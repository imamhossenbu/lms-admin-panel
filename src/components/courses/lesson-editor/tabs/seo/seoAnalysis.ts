/**
 * Pure SEO scoring for the Edit Lesson → SEO tab (no React, unit-testable).
 * Weights add up to 100; the optional "meta keywords" check still counts toward the score.
 */

export const SEO_TITLE_RANGE = { min: 30, max: 70 } as const;
export const SEO_DESCRIPTION_RANGE = { min: 120, max: 160 } as const;
export const SEO_CONTENT_MIN = 300;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface SeoAnalysisInput {
  title: string;
  description: string;
  slug: string;
  focusKeyword: string;
  metaKeywords: string[];
  /** Lesson body HTML (content.body). */
  contentHtml: string;
}

export type SeoCheckId = "title" | "description" | "keyword" | "slug" | "metaKeywords" | "content";

export interface SeoCheck {
  id: SeoCheckId;
  label: string;
  passed: boolean;
  optional: boolean;
  weight: number;
}

export type SeoGrade = "good" | "fair" | "poor";

export interface SeoAnalysisResult {
  score: number;
  grade: SeoGrade;
  gradeLabel: string;
  checks: SeoCheck[];
}

const WEIGHTS: Record<SeoCheckId, number> = { title: 20, description: 20, keyword: 15, slug: 15, metaKeywords: 15, content: 15 };

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}

/** "Introduction to HTML!" → "introduction-to-html". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

/** Every word of the keyword appears in the text (case-insensitive). */
export function containsKeyword(text: string, keyword: string): boolean {
  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return false;
  const haystack = text.toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function gradeOf(score: number): SeoGrade {
  if (score >= 80) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

const GRADE_LABEL: Record<SeoGrade, string> = { good: "Good", fair: "Needs work", poor: "Poor" };

export function analyzeSeo(input: SeoAnalysisInput): SeoAnalysisResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const slug = input.slug.trim();
  const keyword = input.focusKeyword.trim();
  const contentLength = stripHtml(input.contentHtml).length;

  const titleOk = title.length >= SEO_TITLE_RANGE.min && title.length <= SEO_TITLE_RANGE.max;
  const descriptionOk = description.length >= SEO_DESCRIPTION_RANGE.min && description.length <= SEO_DESCRIPTION_RANGE.max;
  const keywordOk = !!keyword && (containsKeyword(title, keyword) || containsKeyword(description, keyword));
  const slugOk = slug.length >= 3 && slug.length <= 100 && SLUG_PATTERN.test(slug);
  const metaOk = input.metaKeywords.some((k) => k.trim().length > 0);
  const contentOk = contentLength > SEO_CONTENT_MIN;

  const checks: SeoCheck[] = [
    {
      id: "title",
      passed: titleOk,
      optional: false,
      weight: WEIGHTS.title,
      label: titleOk ? "SEO title length is good" : `SEO title should be ${SEO_TITLE_RANGE.min}–${SEO_TITLE_RANGE.max} characters (now ${title.length})`,
    },
    {
      id: "description",
      passed: descriptionOk,
      optional: false,
      weight: WEIGHTS.description,
      label: descriptionOk
        ? "SEO description length is good"
        : `SEO description should be ${SEO_DESCRIPTION_RANGE.min}–${SEO_DESCRIPTION_RANGE.max} characters (now ${description.length})`,
    },
    {
      id: "keyword",
      passed: keywordOk,
      optional: false,
      weight: WEIGHTS.keyword,
      label: keywordOk ? "Focus keyword added" : keyword ? "Use the focus keyword in the title or description" : "Add a focus keyword",
    },
    { id: "slug", passed: slugOk, optional: false, weight: WEIGHTS.slug, label: slugOk ? "URL slug is valid" : "Fix the URL slug" },
    { id: "metaKeywords", passed: metaOk, optional: true, weight: WEIGHTS.metaKeywords, label: metaOk ? "Meta keywords added" : "Add meta keywords (optional)" },
    {
      id: "content",
      passed: contentOk,
      optional: false,
      weight: WEIGHTS.content,
      label: contentOk ? "Content looks optimized" : `Add more lesson content (over ${SEO_CONTENT_MIN} characters)`,
    },
  ];

  const score = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);
  const grade = gradeOf(score);
  return { score, grade, gradeLabel: GRADE_LABEL[grade], checks };
}

/** Cuts text to `max` characters with an ellipsis (search-result style). */
export function truncateText(text: string, max: number): string {
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/** "https://lms.yoursite.com/courses/html" + "intro" → ["lms.yoursite.com", "courses", "html", "lessons", "intro"]. */
export function previewBreadcrumb(publicUrl: string, slug: string): string[] {
  let parts: string[];
  try {
    const url = new URL(publicUrl);
    parts = [url.host, ...url.pathname.split("/").filter(Boolean)];
  } catch {
    parts = publicUrl.replace(/^https?:\/\//, "").split("/").filter(Boolean);
  }
  return [...parts, "lessons", ...(slug.trim() ? [slug.trim()] : [])];
}
