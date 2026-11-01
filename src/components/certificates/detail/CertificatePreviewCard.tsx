"use client";

import React from "react";
import { FileWarning } from "lucide-react";
import type { CertificateTemplate, IssuedCertificate, IssuedStatus } from "@/types/certificate";
import { cn } from "@/lib/cn";
import { CertificateRender } from "../shared/CertificateRender";
import { CertificateStatusBanner } from "./CertificateStatusBanner";
import { certificateRenderData } from "./certificateRenderData";

export interface CertificatePreviewCardProps {
  certificate: IssuedCertificate;
  template: CertificateTemplate | null;
  courseTitle: string;
  status: IssuedStatus;
}

/** Large rendered certificate on a subtle stage, with the revoked / expired banner above it. */
export function CertificatePreviewCard({ certificate, template, courseTitle, status }: CertificatePreviewCardProps) {
  const portrait = template?.orientation === "PORTRAIT";
  return (
    <section className="dashboard-card space-y-4 p-5">
      <CertificateStatusBanner certificate={certificate} status={status} />
      <div className="rounded-xl border border-dash bg-gray-bg p-4 sm:p-8">
        {template ? (
          <div className={cn("relative mx-auto", portrait ? "max-w-md" : "max-w-4xl", status !== "VALID" && "opacity-80 grayscale")}>
            <CertificateRender template={template} data={certificateRenderData(certificate, template, courseTitle)} scale="lg" />
          </div>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-bg text-yellow">
              <FileWarning className="h-7 w-7" />
            </span>
            <p className="body-sm-medium font-semibold! text-primary-500">Template not available</p>
            <p className="body-xsm-regular text-primary-300">The template used for this certificate was deleted, so it can&apos;t be previewed.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CertificatePreviewCard;
