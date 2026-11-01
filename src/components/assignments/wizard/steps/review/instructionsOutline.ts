import { htmlToText } from "@/lib/sanitizeHtml";
import { firstParagraph, htmlListItems } from "../../wizardFormat";

/** Splits instructions HTML by its h1–h3 headings (e.g. "Assignment Overview", "Requirements", "Submission Guidelines"). */
function sections(html: string): { heading: string; body: string }[] {
  const parts = (html ?? "").split(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  const out: { heading: string; body: string }[] = [{ heading: "", body: parts[0] ?? "" }];
  for (let i = 1; i < parts.length; i += 2) out.push({ heading: htmlToText(parts[i]).toLowerCase(), body: parts[i + 1] ?? "" });
  return out;
}

const find = (html: string, word: string) => sections(html).find((s) => s.heading.includes(word))?.body;

/** Overview text, requirement bullets and submission-guideline bullets of the instructions. */
export function instructionsOutline(html: string) {
  const requirementsHtml = find(html, "requirement");
  const guidelinesHtml = find(html, "submission");
  const overviewHtml = find(html, "overview");
  return {
    overview: firstParagraph(overviewHtml ?? html),
    requirements: htmlListItems(requirementsHtml ?? (guidelinesHtml ? "" : html)),
    guidelines: htmlListItems(guidelinesHtml ?? ""),
  };
}
