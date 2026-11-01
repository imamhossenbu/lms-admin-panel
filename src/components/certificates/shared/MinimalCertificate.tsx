"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { CertificateLayoutProps } from "./certificateRenderTypes";
import { CertificateLogo, CertificateQr, GradePill, SignerBlock } from "./CertificateParts";

/** MINIMAL: thin border, a single accent rule and generous whitespace. */
export function MinimalCertificate({ template, data, body, accent, s }: CertificateLayoutProps) {
  return (
    <div className={cn("h-full w-full border border-dash bg-white", s.frame)}>
      <div className={cn("flex h-full w-full flex-col items-center justify-between text-center", s.pad)}>
        <div className={cn("flex flex-col items-center", s.gap)}>
          {template.showLogo && <CertificateLogo s={s} center />}
          <span className={cn("h-0.5", s.rule, accent.solid)} aria-hidden />
          <p className={cn("uppercase tracking-widest", s.heading, accent.text)}>{template.heading}</p>
        </div>

        <div className={cn("flex min-w-0 max-w-full flex-col items-center", s.gap)}>
          <p className={cn("max-w-full truncate text-primary-500", s.name)} title={data.studentName}>
            {data.studentName}
          </p>
          <span className="h-px w-1/3 bg-slate-200" aria-hidden />
          <p className={cn("max-w-prose text-primary-300", s.body)}>{body}</p>
          {template.showGrade && <GradePill grade={data.grade} accent={accent} s={s} />}
        </div>

        <div className="flex w-full items-end justify-between gap-3">
          <div className="flex min-w-0 gap-4 overflow-hidden">
            {template.signers.map((signer) => (
              <SignerBlock key={signer.id} signer={signer} s={s} align="left" />
            ))}
          </div>
          <div className="flex shrink-0 items-end gap-3">
            <span className={cn("whitespace-nowrap text-primary-300", s.meta)}>{data.completionDate}</span>
            {template.showQr && <CertificateQr code={data.certificateId} s={s} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalCertificate;
