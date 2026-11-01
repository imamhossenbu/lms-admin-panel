import type { CertificateAccent, CertificateLayout, CertificateTemplate, IssueRules } from "@/types/certificate";
import type { CertificateRenderData, CertificateRenderTemplate } from "@/components/certificates/shared/certificateRenderTypes";
import { CERT_PLACEHOLDERS, type TemplateFormValues } from "@/validations/certificateSchema";
import { COURSE_OPTIONS } from "@/data/mockCourseCatalog";
import { formatCertDate } from "@/lib/certificateStats";

/** Template designer: defaults, mapping, preview data, plain-language rules and the sessionStorage draft. */

export type DesignerMode = "create" | "edit";

export const TEMPLATE_NAME_MAX = 80;
export const HEADING_MAX = 60;
export const BODY_MAX = 400;
export const MAX_SIGNERS = 3;
export const SIGNATURE_MAX_BYTES = 1024 * 1024;
export const SIGNATURE_TYPES = ["image/png", "image/jpeg"];

export const newSignerId = () => `signer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const DESIGNER_DEFAULTS: TemplateFormValues = {
  name: "",
  layout: "CLASSIC",
  orientation: "LANDSCAPE",
  accent: "orange",
  heading: "Certificate of Completion",
  bodyText: "This is to certify that {student_name} has successfully completed the course {course_title} on {completion_date}.",
  showLogo: true,
  showQr: true,
  showGrade: false,
  signers: [{ id: "signer-new-1", name: "", title: "", signatureUrl: "" }],
  courseIds: [],
  rules: { autoIssue: true, minCompletion: 100, minQuizScore: 60, requireAssignments: false, validityMonths: null },
  status: "DRAFT",
};

export const toFormValues = (t: CertificateTemplate): TemplateFormValues => ({
  name: t.name,
  layout: t.layout,
  orientation: t.orientation,
  accent: t.accent,
  heading: t.heading,
  bodyText: t.bodyText,
  showLogo: t.showLogo,
  showQr: t.showQr,
  showGrade: t.showGrade,
  signers: t.signers.map((s) => ({ ...s })),
  courseIds: [...t.courseIds],
  rules: { ...t.rules },
  status: t.status,
});

/** Trimmed values sent to the storage layer. */
export const toSaveValues = (v: TemplateFormValues): TemplateFormValues => ({
  ...v,
  name: v.name.trim(),
  heading: v.heading.trim(),
  bodyText: v.bodyText.trim(),
  signers: v.signers.map((s) => ({ ...s, name: s.name.trim(), title: s.title.trim(), signatureUrl: s.signatureUrl.startsWith("blob:") ? "" : s.signatureUrl })),
});

/** Stable comparison string (NaN ≈ null) to detect unsaved changes. */
export const snapshotValues = (v: TemplateFormValues) =>
  JSON.stringify(v, (_k, val) => (typeof val === "number" && Number.isNaN(val) ? null : val));

/** Turns zod's "expected number, received NaN" into a friendly message. */
export const numberError = (message: string | undefined, fallback: string) =>
  message && /expected number|received nan|invalid input/i.test(message) ? fallback : message;

// ---------------------------------------------------------------- options
export const LAYOUT_OPTIONS: { value: CertificateLayout; title: string; description: string }[] = [
  { value: "CLASSIC", title: "Classic", description: "Framed border, centred serif look" },
  { value: "MODERN", title: "Modern", description: "Bold accent band, left aligned" },
  { value: "MINIMAL", title: "Minimal", description: "Clean, lots of white space" },
];

/** Accent order in the picker (colours come from the shared CERT_ACCENT token map). */
export const ACCENT_ORDER: CertificateAccent[] = ["orange", "blue", "green", "purple", "navy"];
export const ACCENT_RING: Record<CertificateAccent, string> = {
  orange: "ring-brand-orange",
  blue: "ring-blue",
  green: "ring-green",
  purple: "ring-purple",
  navy: "ring-brand-navy",
};

export const PLACEHOLDER_LABEL: Record<(typeof CERT_PLACEHOLDERS)[number], string> = {
  "{student_name}": "Student name",
  "{course_title}": "Course title",
  "{completion_date}": "Completion date",
  "{grade}": "Grade",
  "{instructor_name}": "Instructor name",
  "{certificate_id}": "Certificate ID",
};

/** Live hint for the body text (mirrors the schema's cross-field checks so they show while typing). */
export function bodyTextIssue(body: string, showGrade: boolean): string | undefined {
  if (!body.includes("{student_name}")) return "Include {student_name} so each certificate is personalised";
  const unknown = (body.match(/\{[a-z_]+\}/g) ?? []).find((p) => !(CERT_PLACEHOLDERS as readonly string[]).includes(p));
  if (unknown) return `Unknown placeholder: ${unknown}`;
  if (body.includes("{grade}") && !showGrade) return "Turn on “Show grade” to use {grade}";
  return undefined;
}

// ---------------------------------------------------------------- preview
export interface SampleLearner {
  id: string;
  name: string;
  grade: number;
}

export const SAMPLE_LEARNERS: SampleLearner[] = [
  { id: "sample-1", name: "Sarah Rahman", grade: 92 },
  { id: "sample-2", name: "Mahin Tarek", grade: 85 },
  { id: "sample-3", name: "Ayesha Chowdhury", grade: 78 },
];

export const SAMPLE_CERTIFICATE_ID = "EDU-HTML-2026-00042";

export const courseTitleOf = (id: string) => COURSE_OPTIONS.find((c) => c.value === id)?.label ?? "Unknown course";

/** Renderer template built from the (possibly partial) live form values; local blob previews override hosted signature URLs. */
export function previewTemplate(v: Partial<TemplateFormValues>, signatureOverrides: Record<string, string> = {}): CertificateRenderTemplate {
  return {
    layout: v.layout ?? DESIGNER_DEFAULTS.layout,
    orientation: v.orientation ?? DESIGNER_DEFAULTS.orientation,
    accent: v.accent ?? DESIGNER_DEFAULTS.accent,
    heading: v.heading ?? "",
    bodyText: v.bodyText ?? "",
    showLogo: v.showLogo ?? true,
    showQr: v.showQr ?? true,
    showGrade: v.showGrade ?? false,
    signers: (v.signers ?? []).map((s, i) => ({
      id: s?.id ?? `signer-${i}`,
      name: s?.name ?? "",
      title: s?.title ?? "",
      signatureUrl: (s?.id && signatureOverrides[s.id]) || s?.signatureUrl || "",
    })),
  };
}

/** Sample values for the live preview. */
export function previewData(learner: SampleLearner, v: Partial<TemplateFormValues>): CertificateRenderData {
  const firstCourse = v.courseIds?.[0];
  return {
    studentName: learner.name,
    courseTitle: firstCourse ? courseTitleOf(firstCourse) : "HTML Fundamentals",
    completionDate: formatCertDate(new Date().toISOString()),
    grade: learner.grade,
    instructorName: v.signers?.[0]?.name?.trim() || "Arif Hossain",
    certificateId: SAMPLE_CERTIFICATE_ID,
  };
}

// ---------------------------------------------------------------- rules in plain language
const joinAnd = (parts: string[]) => (parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`);

/** "Issued automatically when a learner completes 100% of the course and scores at least 60% on quizzes. Never expires." */
export function rulesSummary(rules: Partial<IssueRules> | undefined): string {
  const r = { ...DESIGNER_DEFAULTS.rules, ...rules };
  const completion = Number.isFinite(r.minCompletion) ? r.minCompletion : 100;
  const conditions = [`completes ${completion}% of the course`];
  if (r.minQuizScore !== null && Number.isFinite(r.minQuizScore)) conditions.push(`scores at least ${r.minQuizScore}% on quizzes`);
  if (r.requireAssignments) conditions.push("passes all assignments");
  const lead = r.autoIssue ? "Issued automatically when a learner" : "Issued manually by an admin once a learner";
  const months = r.validityMonths;
  const expiry = months !== null && Number.isFinite(months) && months > 0 ? `Valid for ${months} month${months === 1 ? "" : "s"} after issue.` : "Never expires.";
  return `${lead} ${joinAnd(conditions)}. ${expiry}`;
}

// ---------------------------------------------------------------- sessionStorage draft
const DRAFT_PREFIX = "edupro_certificate_template_form_v1";
export const draftKey = (mode: DesignerMode, templateId?: string) => (mode === "create" ? `${DRAFT_PREFIX}::new` : `${DRAFT_PREFIX}::edit::${templateId ?? ""}`);

const num = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);
const nullableNum = (v: unknown) => (typeof v === "number" ? v : v === null ? null : Number.NaN);

export function readDraft(key: string): TemplateFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<TemplateFormValues> | null;
    if (!p || typeof p !== "object") return null;
    const rules: Partial<IssueRules> = p.rules ?? {};
    return {
      ...DESIGNER_DEFAULTS,
      ...p,
      signers: Array.isArray(p.signers) && p.signers.length
        ? p.signers.map((s) => ({
            id: typeof s?.id === "string" && s.id ? s.id : newSignerId(),
            name: typeof s?.name === "string" ? s.name : "",
            title: typeof s?.title === "string" ? s.title : "",
            // Never restore temporary blob: previews.
            signatureUrl: typeof s?.signatureUrl === "string" && !s.signatureUrl.startsWith("blob:") ? s.signatureUrl : "",
          }))
        : DESIGNER_DEFAULTS.signers,
      courseIds: Array.isArray(p.courseIds) ? p.courseIds.filter((c): c is string => typeof c === "string") : [],
      rules: {
        autoIssue: typeof rules.autoIssue === "boolean" ? rules.autoIssue : DESIGNER_DEFAULTS.rules.autoIssue,
        minCompletion: num(rules.minCompletion, Number.NaN),
        minQuizScore: nullableNum(rules.minQuizScore),
        requireAssignments: typeof rules.requireAssignments === "boolean" ? rules.requireAssignments : DESIGNER_DEFAULTS.rules.requireAssignments,
        validityMonths: nullableNum(rules.validityMonths),
      },
    };
  } catch {
    return null;
  }
}

export function writeDraft(key: string, values: TemplateFormValues) {
  try {
    sessionStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Storage full / disabled: the form still works, it just won't survive a reload.
  }
}

export function clearDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
