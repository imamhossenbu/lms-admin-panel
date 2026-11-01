import type { CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { formatCertDate } from "@/lib/certificateStats";
import type { CertificateRenderData } from "../shared/CertificateRender";

/** Values substituted into the rendered certificate (same mapping as the PDF download). */
export const certificateRenderData = (c: IssuedCertificate, template: CertificateTemplate, courseTitle: string): CertificateRenderData => ({
  studentName: c.recipient.name,
  courseTitle,
  completionDate: formatCertDate(c.completedAt),
  grade: c.grade,
  instructorName: template.signers[0]?.name ?? "EduPro",
  certificateId: c.code,
});

export default certificateRenderData;
