import type { CertificateTemplate, IssuedCertificate, IssuedStatus } from "@/types/certificate";

/** Pure helpers — every Certificates number is derived here (never hard-coded). */

const DAY = 86400000;

export const certificateStatus = (c: Pick<IssuedCertificate, "status" | "expiresAt">, now: Date = new Date()): IssuedStatus =>
  c.status === "REVOKED" ? "REVOKED" : c.expiresAt && new Date(c.expiresAt).getTime() < now.getTime() ? "EXPIRED" : "VALID";

export function certificateListStats(certs: IssuedCertificate[], now: Date = new Date()) {
  const t = now.getTime();
  const inWindow = (c: IssuedCertificate, from: number, to: number) => {
    const x = new Date(c.issuedAt).getTime();
    return x > from && x <= to;
  };
  const last30 = certs.filter((c) => inWindow(c, t - 30 * DAY, t)).length;
  const prev30 = certs.filter((c) => inWindow(c, t - 60 * DAY, t - 30 * DAY)).length;
  const statuses = certs.map((c) => certificateStatus(c, now));
  const expiringSoon = certs.filter((c) => certificateStatus(c, now) === "VALID" && c.expiresAt && new Date(c.expiresAt).getTime() - t < 30 * DAY).length;
  return {
    total: certs.length,
    valid: statuses.filter((s) => s === "VALID").length,
    revoked: statuses.filter((s) => s === "REVOKED").length,
    expired: statuses.filter((s) => s === "EXPIRED").length,
    last30,
    last30Delta: prev30 ? Math.round(((last30 - prev30) / prev30) * 100) : null,
    expiringSoon,
    verifications: certs.reduce((s, c) => s + c.verifications, 0),
    downloads: certs.reduce((s, c) => s + c.downloads, 0),
    autoShare: certs.length ? Math.round((certs.filter((c) => c.method === "AUTO").length / certs.length) * 100) : 0,
  };
}

/** Certificates issued per month for the last `months` months (oldest first). */
export function monthlyIssued(certs: IssuedCertificate[], months = 6, now: Date = new Date()) {
  return Array.from({ length: months }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {
      label: start.toLocaleDateString("en-US", { month: "short" }),
      count: certs.filter((c) => {
        const x = new Date(c.issuedAt).getTime();
        return x >= start.getTime() && x < end.getTime();
      }).length,
    };
  });
}

export function templateUsage(templates: CertificateTemplate[], certs: IssuedCertificate[]) {
  return templates.map((t) => ({ template: t, issued: certs.filter((c) => c.templateId === t.id).length, lastIssuedAt: certs.find((c) => c.templateId === t.id)?.issuedAt ?? null }));
}

/** Course → active template (or undefined). */
export const activeTemplateFor = (templates: CertificateTemplate[], courseId: string) =>
  templates.find((t) => t.status === "ACTIVE" && t.courseIds.includes(courseId));

/** Fill placeholders for previews and downloads. */
export function renderCertificateText(
  text: string,
  values: { studentName: string; courseTitle: string; completionDate: string; grade: number | null; instructorName: string; certificateId: string }
) {
  return text
    .replaceAll("{student_name}", values.studentName)
    .replaceAll("{course_title}", values.courseTitle)
    .replaceAll("{completion_date}", values.completionDate)
    .replaceAll("{grade}", values.grade === null ? "—" : `${values.grade}%`)
    .replaceAll("{instructor_name}", values.instructorName)
    .replaceAll("{certificate_id}", values.certificateId);
}

export const formatCertDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
export const verifyUrl = (code: string) => `https://edupro.com/verify/${code}`;
export const initialsOf = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
