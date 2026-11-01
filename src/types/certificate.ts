/** Certificates (mock-first). API-ready shapes — swap src/lib/certificateStorage.ts for real calls later. */

export type CertificateLayout = "CLASSIC" | "MODERN" | "MINIMAL";
export type CertificateOrientation = "LANDSCAPE" | "PORTRAIT";
/** Token-based accent (maps to globals.css colours). */
export type CertificateAccent = "orange" | "blue" | "green" | "purple" | "navy";
export type TemplateStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface CertificateSigner {
  id: string;
  name: string;
  title: string;
  /** Hosted signature image ("" = typed signature in a script style). */
  signatureUrl: string;
}

export interface IssueRules {
  /** Issue automatically when the rules are met (else admins issue manually). */
  autoIssue: boolean;
  /** Minimum course completion %. */
  minCompletion: number;
  /** Minimum average quiz score % (null = not required). */
  minQuizScore: number | null;
  /** All assignments must be graded and passed. */
  requireAssignments: boolean;
  /** Months until the certificate expires (null = never). */
  validityMonths: number | null;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  layout: CertificateLayout;
  orientation: CertificateOrientation;
  accent: CertificateAccent;
  /** Heading on the certificate, e.g. "Certificate of Completion". */
  heading: string;
  /**
   * Body with placeholders: {student_name} {course_title} {completion_date} {grade} {instructor_name} {certificate_id}.
   */
  bodyText: string;
  showLogo: boolean;
  showQr: boolean;
  showGrade: boolean;
  signers: CertificateSigner[];
  /** Courses that use this template (a course can only use one ACTIVE template). */
  courseIds: string[];
  rules: IssueRules;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export type IssuedStatus = "VALID" | "REVOKED" | "EXPIRED";
export type IssueMethod = "AUTO" | "MANUAL";

export interface CertificateRecipient {
  id: string;
  name: string;
  email: string;
}

export interface IssuedCertificate {
  id: string;
  /** Public verification code, e.g. "EDU-HTML-2026-00042". */
  code: string;
  templateId: string;
  courseId: string;
  recipient: CertificateRecipient;
  /** Final grade % when the template shows grades (null otherwise). */
  grade: number | null;
  completedAt: string;
  issuedAt: string;
  /** null = never expires. */
  expiresAt: string | null;
  method: IssueMethod;
  /** Stored status: VALID or REVOKED. EXPIRED is derived from expiresAt (certificateStatus()). */
  status: Exclude<IssuedStatus, "EXPIRED">;
  revokedReason: string;
  revokedAt: string | null;
  downloads: number;
  verifications: number;
  emailedAt: string | null;
}

export type CertificateEventKind = "ISSUED" | "EMAILED" | "DOWNLOADED" | "VERIFIED" | "REVOKED" | "RESTORED" | "REISSUED";

export interface CertificateEvent {
  id: string;
  certificateId: string;
  kind: CertificateEventKind;
  message: string;
  actor: string;
  at: string;
}

/** Completed-course learner who qualifies but has no certificate yet (manual issue queue). */
export interface EligibleLearner {
  recipient: CertificateRecipient;
  courseId: string;
  completion: number;
  quizScore: number | null;
  completedAt: string;
}
