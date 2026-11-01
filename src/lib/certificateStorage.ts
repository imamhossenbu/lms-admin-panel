import type { CertificateEvent, CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import type { IssueCertificateValues, TemplateFormValues } from "@/validations/certificateSchema";
import { buildCertificateSeed, CERT_LEARNERS, courseCode, type CertificateSeed } from "@/data/mockCertificateData";
import { certificateStatus } from "@/lib/certificateStats";

/** Mock-first persistence for Certificates (localStorage + simulated latency). Swap for API calls later. */

const STORAGE_KEY = "edupro_certificates_v1";
export const CERTIFICATES_UPDATED_EVENT = "edupro_certificates_updated";
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export { CERT_LEARNERS };

function read(): CertificateSeed {
  if (typeof window === "undefined") return buildCertificateSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as CertificateSeed;
      if (Array.isArray(p?.templates) && Array.isArray(p?.certificates) && Array.isArray(p?.events) && Array.isArray(p?.eligible)) return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildCertificateSeed();
  write(seed);
  return seed;
}

function write(d: CertificateSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(CERTIFICATES_UPDATED_EVENT));
}

const log = (d: CertificateSeed, certificateId: string, kind: CertificateEvent["kind"], message: string, actor = "Admin"): CertificateSeed => ({
  ...d,
  events: [{ id: uid("ev"), certificateId, kind, message, actor, at: new Date().toISOString() }, ...d.events],
});

// ---------------------------------------------------------------- reads
export const getCertificatesSnapshot = () => read();
export async function fetchCertificates(): Promise<CertificateSeed> {
  await wait(300);
  return read();
}
export async function fetchCertificate(id: string) {
  await wait(300);
  const d = read();
  const certificate = d.certificates.find((c) => c.id === id);
  if (!certificate) return null;
  return { certificate, template: d.templates.find((t) => t.id === certificate.templateId) ?? null, events: d.events.filter((e) => e.certificateId === id) };
}
export async function fetchTemplate(id: string) {
  await wait(300);
  return read().templates.find((t) => t.id === id) ?? null;
}
/** Public verification by code (case-insensitive). */
export async function verifyCertificateCode(code: string) {
  await wait(500);
  const d = read();
  const certificate = d.certificates.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  if (certificate) write(log({ ...d, certificates: d.certificates.map((c) => (c.id === certificate.id ? { ...c, verifications: c.verifications + 1 } : c)) }, certificate.id, "VERIFIED", "Verified from the admin panel"));
  return certificate ?? null;
}

// ---------------------------------------------------------------- templates
/** A course can only be in ONE active template — activating moves it out of the others. */
const exclusiveCourses = (templates: CertificateTemplate[], self: CertificateTemplate) =>
  self.status !== "ACTIVE"
    ? templates
    : templates.map((t) => (t.id !== self.id && t.status === "ACTIVE" ? { ...t, courseIds: t.courseIds.filter((c) => !self.courseIds.includes(c)) } : t));

export async function createTemplate(v: TemplateFormValues): Promise<CertificateTemplate> {
  await wait();
  const d = read();
  const now = new Date().toISOString();
  const t: CertificateTemplate = { ...v, id: uid("template"), createdAt: now, updatedAt: now };
  write({ ...d, templates: exclusiveCourses([t, ...d.templates], t) });
  return t;
}

export async function updateTemplate(id: string, patch: Partial<TemplateFormValues>): Promise<CertificateTemplate> {
  await wait();
  const d = read();
  const cur = d.templates.find((t) => t.id === id);
  if (!cur) throw new Error("This template no longer exists.");
  const next = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  write({ ...d, templates: exclusiveCourses(d.templates.map((t) => (t.id === id ? next : t)), next) });
  return next;
}

export async function duplicateTemplate(id: string): Promise<CertificateTemplate> {
  const src = read().templates.find((t) => t.id === id);
  if (!src) throw new Error("This template no longer exists.");
  const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = src;
  void _i; void _c; void _u;
  return createTemplate({ ...structuredClone(rest), name: `${src.name} (Copy)`.slice(0, 80), status: "DRAFT", courseIds: [] });
}

/** Templates with issued certificates can't be deleted (archive instead). */
export async function deleteTemplate(id: string): Promise<void> {
  await wait();
  const d = read();
  if (d.certificates.some((c) => c.templateId === id)) throw new Error("Certificates were issued with this template. Archive it instead.");
  write({ ...d, templates: d.templates.filter((t) => t.id !== id) });
}

// ---------------------------------------------------------------- issued certificates
export async function issueCertificate(v: IssueCertificateValues): Promise<IssuedCertificate> {
  await wait();
  let d = read();
  const template = d.templates.find((t) => t.status === "ACTIVE" && t.courseIds.includes(v.courseId));
  if (!template) throw new Error("This course has no active certificate template. Assign one first.");
  const recipient = CERT_LEARNERS.find((l) => l.id === v.recipientId);
  if (!recipient) throw new Error("Learner not found.");
  // Expired certificates count as not valid (status is derived), so they can be reissued.
  if (d.certificates.some((c) => c.courseId === v.courseId && c.recipient.id === v.recipientId && certificateStatus(c) === "VALID"))
    throw new Error(`${recipient.name} already has a valid certificate for this course.`);
  const issuedAt = new Date();
  const year = issuedAt.getFullYear();
  const seq = d.certificates.filter((c) => c.courseId === v.courseId && c.issuedAt.startsWith(String(year))).length + 1;
  const cert: IssuedCertificate = {
    id: uid("cert"),
    code: `EDU-${courseCode(v.courseId)}-${year}-${String(seq).padStart(5, "0")}`,
    templateId: template.id,
    courseId: v.courseId,
    recipient,
    grade: template.showGrade ? v.grade : null,
    completedAt: new Date(`${v.completedAt}T12:00`).toISOString(),
    issuedAt: issuedAt.toISOString(),
    expiresAt: template.rules.validityMonths ? new Date(year, issuedAt.getMonth() + template.rules.validityMonths, issuedAt.getDate()).toISOString() : null,
    method: "MANUAL",
    status: "VALID",
    revokedReason: "",
    revokedAt: null,
    downloads: 0,
    verifications: 0,
    emailedAt: v.sendEmail ? issuedAt.toISOString() : null,
  };
  d = { ...d, certificates: [cert, ...d.certificates], eligible: d.eligible.filter((e) => !(e.courseId === v.courseId && e.recipient.id === v.recipientId)) };
  d = log(d, cert.id, "ISSUED", v.note ? `Issued manually — ${v.note}` : "Issued manually");
  if (v.sendEmail) d = log(d, cert.id, "EMAILED", `Emailed to ${recipient.email}`, "System");
  write(d);
  return cert;
}

export async function revokeCertificate(id: string, reason: string, notifyLearner = false): Promise<void> {
  await wait();
  let d = read();
  const cert = d.certificates.find((c) => c.id === id);
  if (!cert) throw new Error("This certificate no longer exists.");
  d = log({ ...d, certificates: d.certificates.map((c) => (c.id === id ? { ...c, status: "REVOKED" as const, revokedReason: reason, revokedAt: new Date().toISOString() } : c)) }, id, "REVOKED", `Revoked: ${reason}`);
  if (notifyLearner) d = log(d, id, "EMAILED", `Revocation notice emailed to ${cert.recipient.email}`, "System");
  write(d);
}

export async function restoreCertificate(id: string): Promise<void> {
  await wait();
  const d = read();
  write(log({ ...d, certificates: d.certificates.map((c) => (c.id === id ? { ...c, status: "VALID" as const, revokedReason: "", revokedAt: null } : c)) }, id, "RESTORED", "Certificate restored"));
}

/** Re-send the certificate email (mock). */
export async function emailCertificate(id: string): Promise<void> {
  await wait(600);
  const d = read();
  const c = d.certificates.find((x) => x.id === id);
  if (!c) throw new Error("This certificate no longer exists.");
  write(log({ ...d, certificates: d.certificates.map((x) => (x.id === id ? { ...x, emailedAt: new Date().toISOString() } : x)) }, id, "EMAILED", `Emailed to ${c.recipient.email}`));
}

/** Count a download (the page generates the file client-side). */
export async function recordDownload(id: string): Promise<void> {
  const d = read();
  write(log({ ...d, certificates: d.certificates.map((c) => (c.id === id ? { ...c, downloads: c.downloads + 1 } : c)) }, id, "DOWNLOADED", "Downloaded by admin"));
}

/** Issue to everyone in the eligible queue for a course (respects duplicates). */
export async function issueToEligible(courseId: string, sendEmail: boolean): Promise<number> {
  const queue = read().eligible.filter((e) => e.courseId === courseId);
  let issued = 0;
  for (const e of queue) {
    await issueCertificate({ courseId, recipientId: e.recipient.id, grade: e.quizScore, completedAt: e.completedAt.slice(0, 10), sendEmail, note: "Bulk issue from eligible queue" });
    issued++;
  }
  return issued;
}

export function resetCertificateMockData() {
  write(buildCertificateSeed());
}
