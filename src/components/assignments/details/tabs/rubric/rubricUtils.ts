import type { AssignmentRubric, RubricCriterion, RubricLevel, RubricLevelTone } from "@/types/assignment";
import type { RubricFormValues } from "@/validations/assignmentSchema";

export const rid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Visual style per performance level (design: Excellent green, Good blue, Needs Improvement orange). */
export const LEVEL_STYLE: Record<RubricLevelTone, { bg: string; border: string; text: string; badge: "green" | "blue" | "orange" }> = {
  EXCELLENT: { bg: "bg-green-bg", border: "border-green/30", text: "text-green", badge: "green" },
  GOOD: { bg: "bg-blue-14", border: "border-blue/30", text: "text-blue", badge: "blue" },
  NEEDS_IMPROVEMENT: { bg: "bg-brand-orange-light", border: "border-brand-orange/20", text: "text-brand-orange", badge: "orange" },
};

export const LEVEL_TONE_ORDER: RubricLevelTone[] = ["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT"];

const DEFAULT_LEVEL_LABEL: Record<RubricLevelTone, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  NEEDS_IMPROVEMENT: "Needs Improvement",
};

/** A blank 3-level criterion worth `points` (levels at 100% / ~60% / ~25%). */
export function newCriterion(points = 8): RubricCriterion {
  const ratios: Record<RubricLevelTone, number> = { EXCELLENT: 1, GOOD: 0.6, NEEDS_IMPROVEMENT: 0.25 };
  return {
    id: rid("crit"),
    title: "",
    description: "",
    points,
    levels: LEVEL_TONE_ORDER.map<RubricLevel>((tone) => ({
      id: rid("lvl"),
      tone,
      label: DEFAULT_LEVEL_LABEL[tone],
      points: Math.round(points * ratios[tone]),
      description: "",
    })),
  };
}

/** Deep copy with fresh criterion + level ids. */
export const cloneCriterion = (c: RubricCriterion, titleSuffix = ""): RubricCriterion => ({
  ...c,
  id: rid("crit"),
  title: `${c.title}${titleSuffix}`.slice(0, 80),
  levels: c.levels.map((l) => ({ ...l, id: rid("lvl") })),
});

export const cloneCriteria = (criteria: RubricCriterion[]) => criteria.map((c) => cloneCriterion(c));

export const toRubricForm = (r: AssignmentRubric): RubricFormValues => structuredClone(r);

export const criteriaSum = (criteria: Pick<RubricCriterion, "points">[]) => criteria.reduce((s, c) => s + (Number(c.points) || 0), 0);

/** Levels sorted high → low (stable display order). */
export const sortedLevels = (levels: RubricLevel[]) => [...levels].sort((a, b) => b.points - a.points);

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "rubric";

export const errorMessage = (e: unknown, fallback = "Something went wrong. Please try again.") =>
  e instanceof Error && e.message ? e.message : fallback;
