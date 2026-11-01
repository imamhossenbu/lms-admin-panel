import type { CertificateTemplate, IssueMethod, IssuedCertificate, IssuedStatus } from "@/types/certificate";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { certificateStatus } from "@/lib/certificateStats";
import { COURSE_OPTIONS, getCourseContext } from "@/data/mockCourseCatalog";
import { isInDateRange, type DateRange } from "@/components/ui/DateRangeFilter";

/** Pure helpers for the Certificates list (filters, rows, CSV, captions). */

export type CertificatesTab = "issued" | "templates" | "eligible";
export const CERT_TABS: CertificatesTab[] = ["issued", "templates", "eligible"];
export const parseTab = (v: string): CertificatesTab => (CERT_TABS.includes(v as CertificatesTab) ? (v as CertificatesTab) : "issued");

const DAY = 86400000;

export const courseTitleOf = (courseId: string) => getCourseContext(courseId).course.title;

export const formatShortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "just now", "5m ago", "3h ago", "2d ago", else short date. */
export function timeAgo(iso: string, now: Date = new Date()) {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(iso);
}

// ---------------------------------------------------------------- issued rows
export interface IssuedRow {
  id: string;
  cert: IssuedCertificate;
  status: IssuedStatus;
  courseTitle: string;
  template: CertificateTemplate | null;
  templateName: string;
  /** Valid and expiring within 30 days. */
  expiresSoon: boolean;
}

export function toIssuedRows(certs: IssuedCertificate[], templates: CertificateTemplate[], now: Date = new Date()): IssuedRow[] {
  const byId = new Map(templates.map((t) => [t.id, t]));
  return [...certs]
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
    .map((cert) => {
      const status = certificateStatus(cert, now);
      const template = byId.get(cert.templateId) ?? null;
      return {
        id: cert.id,
        cert,
        status,
        courseTitle: courseTitleOf(cert.courseId),
        template,
        templateName: template?.name ?? "Deleted template",
        expiresSoon: status === "VALID" && !!cert.expiresAt && new Date(cert.expiresAt).getTime() - now.getTime() < 30 * DAY,
      };
    });
}

export interface IssuedFilters {
  query: string;
  courseId: string;
  templateId: string;
  status: string;
  method: string;
  range: DateRange;
}

export const isIssuedFiltered = (f: IssuedFilters) =>
  !!f.query || f.courseId !== "All" || f.templateId !== "All" || f.status !== "All" || f.method !== "All" || !!f.range.from || !!f.range.to;

export function filterIssued(rows: IssuedRow[], f: IssuedFilters) {
  const q = f.query.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!q || r.cert.recipient.name.toLowerCase().includes(q) || r.cert.recipient.email.toLowerCase().includes(q) || r.cert.code.toLowerCase().includes(q)) &&
      (f.courseId === "All" || r.cert.courseId === f.courseId) &&
      (f.templateId === "All" || r.cert.templateId === f.templateId) &&
      (f.status === "All" || r.status === f.status) &&
      (f.method === "All" || r.cert.method === f.method) &&
      isInDateRange(r.cert.issuedAt, f.range)
  );
}

export const STATUS_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Status" },
  { value: "VALID", label: "Valid" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REVOKED", label: "Revoked" },
];

export const METHOD_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Methods" },
  { value: "AUTO", label: "Auto-issued" },
  { value: "MANUAL", label: "Manual" },
];

export const METHOD_LABEL: Record<IssueMethod, string> = { AUTO: "Auto", MANUAL: "Manual" };

export const courseFilterOptions = (): AppSelectOption[] => [{ value: "All", label: "All Courses" }, ...COURSE_OPTIONS];
export const templateFilterOptions = (templates: CertificateTemplate[]): AppSelectOption[] => [
  { value: "All", label: "All Templates" },
  ...templates.map((t) => ({ value: t.id, label: t.name })),
];

// ---------------------------------------------------------------- templates
/** "Auto · 100% completion · quiz ≥ 60% · assignments · 24-month validity". */
export function rulesSummary(t: CertificateTemplate) {
  const parts = [t.rules.autoIssue ? "Auto" : "Manual", `${t.rules.minCompletion}% completion`];
  if (t.rules.minQuizScore !== null) parts.push(`quiz ≥ ${t.rules.minQuizScore}%`);
  if (t.rules.requireAssignments) parts.push("assignments passed");
  if (t.rules.validityMonths) parts.push(`valid ${t.rules.validityMonths} mo`);
  return parts.join(" · ");
}

// ---------------------------------------------------------------- CSV
const csvCell = (value: string | number) => {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export function buildCertificatesCsv(rows: IssuedRow[]) {
  const header = ["Code", "Recipient", "Email", "Course", "Template", "Issued", "Expires", "Grade", "Method", "Status"];
  const body = rows.map((r) => [
    r.cert.code,
    r.cert.recipient.name,
    r.cert.recipient.email,
    r.courseTitle,
    r.templateName,
    formatShortDate(r.cert.issuedAt),
    r.cert.expiresAt ? formatShortDate(r.cert.expiresAt) : "Never",
    r.cert.grade === null ? "" : `${r.cert.grade}%`,
    METHOD_LABEL[r.cert.method],
    r.status,
  ]);
  return [header, ...body].map((line) => line.map(csvCell).join(",")).join("\n");
}

/** Triggers a browser download; returns the file name. */
export function downloadCertificatesCsv(rows: IssuedRow[]) {
  const url = URL.createObjectURL(new Blob([buildCertificatesCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const fileName = `certificates-${new Date().toISOString().slice(0, 10)}.csv`;
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}

// ---------------------------------------------------------------- revoke reasons
export const REVOKE_REASON_OPTIONS: AppSelectOption[] = [
  { value: "ACADEMIC_MISCONDUCT", label: "Academic misconduct" },
  { value: "ISSUED_IN_ERROR", label: "Issued in error" },
  { value: "REFUND", label: "Course refunded" },
  { value: "OTHER", label: "Other" },
];

export const revokeReasonText = (reason: string, details: string) => {
  const label = REVOKE_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? "Other";
  return details.trim() ? `${label} — ${details.trim()}` : label;
};
