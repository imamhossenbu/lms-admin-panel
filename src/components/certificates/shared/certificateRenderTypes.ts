import type { CertificateTemplate } from "@/types/certificate";
import type { AccentClasses } from "./certificateAccent";
import type { CertScaleClasses } from "./certificateScale";

/** Template fields the renderer needs (works for saved templates and live designer form values). */
export type CertificateRenderTemplate = Pick<CertificateTemplate, "layout" | "orientation" | "accent" | "heading" | "bodyText" | "showLogo" | "showQr" | "showGrade" | "signers">;

/** Values substituted into the certificate. */
export interface CertificateRenderData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  grade: number | null;
  instructorName: string;
  /** Public verification code (also seeds the QR block). */
  certificateId: string;
}

/** Props shared by the three layout components. */
export interface CertificateLayoutProps {
  template: CertificateRenderTemplate;
  data: CertificateRenderData;
  /** Body text with placeholders already filled. */
  body: string;
  accent: AccentClasses;
  s: CertScaleClasses;
  portrait: boolean;
}
