import React from "react";
import Link from "next/link";
import { Award, BookOpen, CalendarCheck, CalendarClock, CalendarPlus, Download, FileBadge, Info, Mail, Wand2 } from "lucide-react";
import type { CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { exactDate, shortDate, timeAgo } from "./certificateDetailFormat";
import { CertificateInfoRow } from "./CertificateInfoRow";
import { CertificateRecipientBlock } from "./CertificateRecipientBlock";

export interface CertificateInfoCardProps {
  certificate: IssuedCertificate;
  template: CertificateTemplate | null;
}

/** Recipient, course, template, grade, dates, method, downloads and last email. */
export function CertificateInfoCard({ certificate: c, template }: CertificateInfoCardProps) {
  const course = { title: c.courseTitle || "Unknown course" };
  return (
    <IconSectionCard icon={<Info className="h-5 w-5" />} title="Certificate Details" tone="blue" bodyClassName="mt-4">
      <CertificateRecipientBlock recipient={c.recipient} />
      <dl className="mt-2 divide-y divide-dash">
        <CertificateInfoRow icon={BookOpen} label="Course" title={course.title}>
          <span className="truncate">{course.title}</span>
        </CertificateInfoRow>
        <CertificateInfoRow icon={FileBadge} label="Template" title={template?.name}>
          {template ? (
            <Link href={`/certificates/templates/${template.id}/edit`} className="truncate text-brand-orange transition-colors hover:underline">
              {template.name}
            </Link>
          ) : (
            <span className="text-primary-300">Deleted template</span>
          )}
        </CertificateInfoRow>
        <CertificateInfoRow icon={Award} label="Grade">
          {c.grade === null ? <span className="text-primary-300">Not shown</span> : `${c.grade}%`}
        </CertificateInfoRow>
        <CertificateInfoRow icon={CalendarCheck} label="Completed" title={exactDate(c.completedAt)}>
          {shortDate(c.completedAt)}
        </CertificateInfoRow>
        <CertificateInfoRow icon={CalendarPlus} label="Issued" title={exactDate(c.issuedAt)}>
          {shortDate(c.issuedAt)}
        </CertificateInfoRow>
        <CertificateInfoRow icon={CalendarClock} label="Expires" title={c.expiresAt ? exactDate(c.expiresAt) : undefined}>
          {c.expiresAt ? shortDate(c.expiresAt) : <span className="text-primary-300">Never</span>}
        </CertificateInfoRow>
        <CertificateInfoRow icon={Wand2} label="Method">
          <ToneBadge tone={c.method === "AUTO" ? "blue" : "purple"} size="sm">
            {c.method === "AUTO" ? "Automatic" : "Manual"}
          </ToneBadge>
        </CertificateInfoRow>
        <CertificateInfoRow icon={Download} label="Downloads">
          {c.downloads.toLocaleString()}
        </CertificateInfoRow>
        <CertificateInfoRow icon={Mail} label="Emailed" title={c.emailedAt ? exactDate(c.emailedAt) : undefined}>
          {c.emailedAt ? timeAgo(c.emailedAt) : <span className="text-primary-300">Not yet</span>}
        </CertificateInfoRow>
      </dl>
    </IconSectionCard>
  );
}

export default CertificateInfoCard;
