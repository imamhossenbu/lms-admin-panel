import type { CertificateEvent, CertificateRecipient, CertificateTemplate, EligibleLearner, IssuedCertificate } from "@/types/certificate";
import { COURSE_CONTEXTS } from "@/data/mockCourseCatalog";

/**
 * Deterministic mock data for Certificates (mock-first), relative to "now".
 * 4 templates (3 active across the 4 catalogue courses, 1 draft), ~140 issued certificates over the last
 * 10 months (a few revoked, a few expired), an event log per certificate, and an eligible-but-not-issued
 * queue. Every number on the pages is DERIVED in src/lib/certificateStats.ts.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Sarah", "Mahin", "Ayesha", "Rakibul", "Sadia", "Imran", "Nusrat", "Ahmed", "Fahim", "Tanvir", "Nabila", "Kamrul", "Tasnim", "Shahriar", "Jannatul", "Hasibul", "Farhana", "Arifur", "Shamima", "Zubair"];
const LAST = ["Rahman", "Tarek", "Faria", "Islam", "Nur", "Hossain", "Tahsin", "Rony", "Ahmed", "Karim", "Khan", "Chowdhury"];
export const CERT_LEARNERS: CertificateRecipient[] = Array.from({ length: 120 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7 + Math.floor(i / FIRST.length)) % LAST.length];
  return { id: `learner-${i + 1}`, name: `${first} ${last}`, email: `${first.toLowerCase()}.${last.toLowerCase()}${i < FIRST.length ? "" : i}@example.com` };
});

const COURSE_CODE: Record<string, string> = {};
COURSE_CONTEXTS.forEach((c) => (COURSE_CODE[c.course.id] = c.course.title.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 4)));
export const courseCode = (courseId: string) => COURSE_CODE[courseId] ?? "EDU";

const DEFAULT_BODY = "This is to certify that {student_name} has successfully completed the course {course_title} on {completion_date}.";

export interface CertificateSeed {
  templates: CertificateTemplate[];
  certificates: IssuedCertificate[];
  events: CertificateEvent[];
  eligible: EligibleLearner[];
}

export function buildCertificateSeed(now: Date = new Date()): CertificateSeed {
  const rand = mulberry32(20261102);
  const DAY = 86400000;
  const [html, js, css, fw] = COURSE_CONTEXTS.map((c) => c.course.id);
  const created = (daysAgo: number) => new Date(now.getTime() - daysAgo * DAY).toISOString();

  const templates: CertificateTemplate[] = [
    {
      id: "template-classic",
      name: "Classic Completion",
      layout: "CLASSIC",
      orientation: "LANDSCAPE",
      accent: "orange",
      heading: "Certificate of Completion",
      bodyText: DEFAULT_BODY,
      showLogo: true,
      showQr: true,
      showGrade: false,
      signers: [
        { id: "signer-1", name: "Arif Hossain", title: "Lead Instructor", signatureUrl: "" },
        { id: "signer-2", name: "Nadia Karim", title: "Head of Academics", signatureUrl: "" },
      ],
      courseIds: [html, fw],
      rules: { autoIssue: true, minCompletion: 100, minQuizScore: 60, requireAssignments: true, validityMonths: null },
      status: "ACTIVE",
      createdAt: created(320),
      updatedAt: created(40),
    },
    {
      id: "template-modern",
      name: "Modern Achievement",
      layout: "MODERN",
      orientation: "LANDSCAPE",
      accent: "blue",
      heading: "Certificate of Achievement",
      bodyText: "Awarded to {student_name} for completing {course_title} with a final grade of {grade} on {completion_date}.",
      showLogo: true,
      showQr: true,
      showGrade: true,
      signers: [{ id: "signer-3", name: "Faria Islam", title: "Course Instructor", signatureUrl: "" }],
      courseIds: [js],
      rules: { autoIssue: true, minCompletion: 90, minQuizScore: 70, requireAssignments: false, validityMonths: 24 },
      status: "ACTIVE",
      createdAt: created(260),
      updatedAt: created(18),
    },
    {
      id: "template-minimal",
      name: "Minimal Professional",
      layout: "MINIMAL",
      orientation: "PORTRAIT",
      accent: "navy",
      heading: "Professional Certificate",
      bodyText: "{student_name} has completed {course_title}. Certificate ID {certificate_id}.",
      showLogo: false,
      showQr: true,
      showGrade: false,
      signers: [{ id: "signer-4", name: "Kazi Rahman", title: "Program Director", signatureUrl: "" }],
      courseIds: [css],
      rules: { autoIssue: false, minCompletion: 100, minQuizScore: null, requireAssignments: true, validityMonths: 6 },
      status: "ACTIVE",
      createdAt: created(200),
      updatedAt: created(60),
    },
    {
      id: "template-draft",
      name: "Workshop Participation (draft)",
      layout: "MODERN",
      orientation: "LANDSCAPE",
      accent: "purple",
      heading: "Certificate of Participation",
      bodyText: "Presented to {student_name} for participating in {course_title}.",
      showLogo: true,
      showQr: false,
      showGrade: false,
      signers: [{ id: "signer-5", name: "Samira Akter", title: "Workshop Host", signatureUrl: "" }],
      courseIds: [],
      rules: { autoIssue: false, minCompletion: 50, minQuizScore: null, requireAssignments: false, validityMonths: null },
      status: "DRAFT",
      createdAt: created(9),
      updatedAt: created(2),
    },
  ];

  const templateFor = (courseId: string) => templates.find((t) => t.status === "ACTIVE" && t.courseIds.includes(courseId))!;
  const certificates: IssuedCertificate[] = [];
  const events: CertificateEvent[] = [];
  const counters: Record<string, number> = {};
  const courseWeights: [string, number][] = [[html, 60], [js, 40], [css, 25], [fw, 18]];
  const usedPairs = new Set<string>();

  courseWeights.forEach(([courseId, count]) => {
    const tpl = templateFor(courseId);
    for (let i = 0; i < count; i++) {
      let learner = CERT_LEARNERS[Math.floor(rand() * CERT_LEARNERS.length)];
      let guard = 0;
      while (usedPairs.has(`${courseId}:${learner.id}`) && guard++ < 50) learner = CERT_LEARNERS[Math.floor(rand() * CERT_LEARNERS.length)];
      if (usedPairs.has(`${courseId}:${learner.id}`)) continue;
      usedPairs.add(`${courseId}:${learner.id}`);
      // Skewed toward recent months (growth).
      const daysAgo = Math.floor(Math.pow(rand(), 1.6) * 300) + 1;
      const completedAt = new Date(now.getTime() - daysAgo * DAY - Math.floor(rand() * 12) * 3600000);
      const issuedAt = new Date(completedAt.getTime() + (tpl.rules.autoIssue ? 5 * 60000 : (1 + Math.floor(rand() * 3)) * DAY));
      if (issuedAt > now) continue;
      const expiresAt = tpl.rules.validityMonths ? new Date(issuedAt.getFullYear(), issuedAt.getMonth() + tpl.rules.validityMonths, issuedAt.getDate()) : null;
      const year = issuedAt.getFullYear();
      counters[`${courseId}${year}`] = (counters[`${courseId}${year}`] ?? 0) + 1;
      const id = `cert-${certificates.length + 1}`;
      const revoked = rand() < 0.035;
      const grade = tpl.showGrade ? 70 + Math.floor(rand() * 30) : null;
      const downloads = Math.floor(rand() * 6);
      const verifications = Math.floor(rand() * 4);
      const cert: IssuedCertificate = {
        id,
        code: `EDU-${courseCode(courseId)}-${year}-${String(counters[`${courseId}${year}`]).padStart(5, "0")}`,
        templateId: tpl.id,
        courseId,
        recipient: learner,
        grade,
        completedAt: completedAt.toISOString(),
        issuedAt: issuedAt.toISOString(),
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
        method: tpl.rules.autoIssue ? "AUTO" : "MANUAL",
        status: revoked ? "REVOKED" : "VALID",
        revokedReason: revoked ? "Issued in error — learner was enrolled in the wrong cohort." : "",
        revokedAt: revoked ? new Date(Math.min(now.getTime() - 3600000, issuedAt.getTime() + 6 * DAY)).toISOString() : null,
        downloads,
        verifications,
        emailedAt: new Date(issuedAt.getTime() + 60000).toISOString(),
      };
      certificates.push(cert);
      const ev = (kind: CertificateEvent["kind"], message: string, at: Date, actor = "System") =>
        events.push({ id: `${id}-ev-${events.length + 1}`, certificateId: id, kind, message, actor, at: at.toISOString() });
      ev("ISSUED", tpl.rules.autoIssue ? "Issued automatically after course completion" : "Issued manually", issuedAt, tpl.rules.autoIssue ? "System" : "Admin");
      ev("EMAILED", `Emailed to ${learner.email}`, new Date(issuedAt.getTime() + 60000));
      for (let d = 0; d < downloads; d++) ev("DOWNLOADED", "Downloaded as PDF", new Date(Math.min(now.getTime() - 60000, issuedAt.getTime() + (d + 1) * 2 * DAY)), learner.name);
      for (let v = 0; v < verifications; v++) ev("VERIFIED", "Verified via public link", new Date(Math.min(now.getTime() - 60000, issuedAt.getTime() + (v + 1) * 9 * DAY)), "Public");
      if (revoked) ev("REVOKED", "Revoked: issued in error", new Date(cert.revokedAt!), "Admin");
    }
  });

  // Eligible but not issued (CSS template is manual-issue → queue).
  const eligible: EligibleLearner[] = [];
  for (let i = 0; i < 7; i++) {
    const learner = CERT_LEARNERS[(i * 13 + 5) % CERT_LEARNERS.length];
    if (usedPairs.has(`${css}:${learner.id}`)) continue;
    eligible.push({ recipient: learner, courseId: css, completion: 100, quizScore: 72 + i * 3, completedAt: new Date(now.getTime() - (i + 1) * DAY).toISOString() });
  }

  certificates.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  events.sort((a, b) => b.at.localeCompare(a.at));
  return { templates, certificates, events, eligible };
}
