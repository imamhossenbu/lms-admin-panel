import type { WizardCriterion } from "@/validations/assignmentWizardSchema";

export interface RubricTemplateCriterion {
  title: string;
  description: string;
  /** Relative weight; points are distributed proportionally to sum to the assignment total. */
  weight: number;
}

export interface RubricTemplate {
  id: string;
  name: string;
  rubricTitle: string;
  rubricDescription: string;
  criteria: RubricTemplateCriterion[];
}

export const RUBRIC_TEMPLATES: RubricTemplate[] = [
  {
    id: "html-page",
    name: "HTML Page Rubric",
    rubricTitle: "HTML Page Evaluation Rubric",
    rubricDescription: "This rubric will be used to evaluate how well the HTML page meets the assignment requirements.",
    criteria: [
      { title: "HTML Structure", description: "Uses proper HTML5 structure (<!DOCTYPE html>, html, head, body)", weight: 1 },
      { title: "Headings & Content", description: "Includes a clear main heading (h1) and well-structured content", weight: 1 },
      { title: "Paragraphs & Writing", description: "Includes at least one meaningful paragraph describing yourself", weight: 1 },
      { title: "Hyperlink", description: "Includes a working hyperlink to any website (e.g. Google)", weight: 1 },
    ],
  },
  {
    id: "coding-project",
    name: "Coding Project Rubric",
    rubricTitle: "Coding Project Rubric",
    rubricDescription: "Evaluates functionality, code quality, structure and documentation of the project.",
    criteria: [
      { title: "Functionality", description: "The project works as described and meets every requirement", weight: 4 },
      { title: "Code Quality", description: "Readable, consistent code with meaningful names and no dead code", weight: 3 },
      { title: "Project Structure", description: "Files and folders are organised logically", weight: 2 },
      { title: "Documentation", description: "Includes a short README explaining how to run the project", weight: 1 },
    ],
  },
  {
    id: "written-response",
    name: "Written Response Rubric",
    rubricTitle: "Written Response Rubric",
    rubricDescription: "Evaluates understanding, organisation and clarity of the written answer.",
    criteria: [
      { title: "Understanding", description: "Demonstrates clear understanding of the topic and key concepts", weight: 2 },
      { title: "Organisation", description: "Ideas are presented in a logical order with clear paragraphs", weight: 1 },
      { title: "Clarity & Grammar", description: "Writing is clear, concise and free of major grammar errors", weight: 1 },
    ],
  },
];

export const newCriterionId = () => `crit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Integer points proportional to `weights` that sum exactly to `total` (largest remainder, ≥ 1 each). */
export function distributePoints(weights: number[], total: number): number[] {
  if (!weights.length) return [];
  const target = Math.max(weights.length, Math.round(Number.isFinite(total) ? total : 0));
  const w = weights.some((x) => x > 0) ? weights.map((x) => Math.max(0, x)) : weights.map(() => 1);
  const sumW = w.reduce((s, x) => s + x, 0);
  // Reserve 1 point per criterion, share the rest by weight.
  const rest = target - weights.length;
  const raw = w.map((x) => (x / sumW) * rest);
  const points = raw.map(Math.floor);
  let left = rest - points.reduce((s, n) => s + n, 0);
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) points[order[k].i] += 1;
  return points.map((n) => n + 1);
}

/** Template / copied criteria → wizard criteria scaled to the assignment total. */
export function criteriaFromWeights(items: { title: string; description: string; weight: number }[], total: number): WizardCriterion[] {
  const points = distributePoints(items.map((c) => c.weight), total);
  return items.map((c, i) => ({ id: newCriterionId(), title: c.title, description: c.description, points: points[i] }));
}
