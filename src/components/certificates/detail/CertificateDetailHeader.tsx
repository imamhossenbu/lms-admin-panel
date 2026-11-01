"use client";

import React from "react";
import { Download, Mail } from "lucide-react";
import type { IssuedCertificate, IssuedStatus } from "@/types/certificate";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { formatCertDate } from "@/lib/certificateStats";
import { CertificateStatusBadge } from "../shared/CertificateStatusBadge";
import { CertificateMoreMenu, type CertificateMoreMenuProps } from "./CertificateMoreMenu";
import type { CertificateBusy } from "./useCertificateActions";

export interface CertificateDetailHeaderProps extends Omit<CertificateMoreMenuProps, "status" | "disabled"> {
  certificate: IssuedCertificate;
  courseTitle: string;
  status: IssuedStatus;
  busy: CertificateBusy;
  onDownload: () => void;
  onEmail: () => void;
}

/** Breadcrumb, "{learner} — {course}" + status badge, code / issue subtitle and the page actions. */
export function CertificateDetailHeader({ certificate: c, courseTitle, status, busy, onDownload, onEmail, ...menu }: CertificateDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Certificates", href: "/certificates" }, { label: c.code }]} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold text-primary-500 break-words">
              {c.recipient.name} <span className="text-primary-300">— {courseTitle}</span>
            </h1>
            <CertificateStatusBadge status={status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 body-regular text-primary-300">
            <span>
              Certificate <span className="text-primary-500">{c.code}</span>
            </span>
            <span aria-hidden>·</span>
            <span>Issued {formatCertDate(c.issuedAt)}</span>
            <span aria-hidden>·</span>
            <span>{c.method === "AUTO" ? "Auto" : "Manual"}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <PrimaryButton leftIcon={<Download />} onClick={onDownload} isLoading={busy === "download"} disabled={busy !== null}>
            Download PDF
          </PrimaryButton>
          <SecondaryButton leftIcon={<Mail />} onClick={onEmail} isLoading={busy === "email"} disabled={busy !== null || status === "REVOKED"}>
            Email to learner
          </SecondaryButton>
          <CertificateMoreMenu status={status} disabled={busy !== null} {...menu} />
        </div>
      </div>
    </div>
  );
}

export default CertificateDetailHeader;
