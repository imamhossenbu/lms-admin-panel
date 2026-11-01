"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { CertificateLayoutProps } from "./certificateRenderTypes";
import { CertificateLogo, CertificateQr, CertificateSeal, GradePill, SignerBlock } from "./CertificateParts";

/** MODERN: solid accent band (left in landscape, top in portrait), left-aligned content. */
export function ModernCertificate({ template, data, body, accent, s, portrait }: CertificateLayoutProps) {
  const logo = template.showLogo && (
    <span className="flex rounded-lg bg-white p-1.5 shadow-xs">
      <CertificateLogo s={s} iconOnly />
    </span>
  );
  return (
    <div className={cn("flex h-full w-full overflow-hidden border border-dash bg-white", portrait ? "flex-col" : "flex-row")}>
      <div className={cn("relative flex shrink-0 overflow-hidden", accent.solid, portrait ? cn("w-full flex-row items-center justify-between", s.bandPortrait) : cn("flex-col items-center justify-between", s.band))}>
        <span aria-hidden className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/10" />
        <span aria-hidden className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative">{logo}</div>
        <div className="relative">
          <CertificateSeal accent={accent} s={s} inverted />
        </div>
        {!portrait && template.showQr ? (
          <div className="relative">
            <CertificateQr code={data.certificateId} s={s} light />
          </div>
        ) : (
          !portrait && <span />
        )}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col justify-between text-left", s.pad)}>
        <div className={cn("flex flex-col", s.gap)}>
          <p className={cn("uppercase tracking-widest", s.eyebrow, accent.text)}>Official certificate</p>
          <p className={cn("text-primary-500", s.heading)}>{template.heading}</p>
        </div>

        <div className={cn("flex min-w-0 flex-col items-start", s.gap)}>
          <p className={cn("text-primary-300", s.eyebrow)}>Presented to</p>
          <p className={cn("max-w-full truncate text-primary-500", s.name)} title={data.studentName}>
            {data.studentName}
          </p>
          <span className={cn("h-1 rounded-full", s.rule, accent.solid)} aria-hidden />
          <p className={cn("text-primary-400", s.body)}>{body}</p>
          {template.showGrade && <GradePill grade={data.grade} accent={accent} s={s} />}
        </div>

        <div className="flex w-full items-end justify-between gap-3">
          <div className="flex min-w-0 gap-4 overflow-hidden">
            {template.signers.map((signer) => (
              <SignerBlock key={signer.id} signer={signer} s={s} align="left" />
            ))}
          </div>
          <div className="flex shrink-0 items-end gap-3">
            <div className={cn("flex-col items-end text-right", s.meta === "hidden" ? "hidden" : "flex")}>
              <span className={cn("text-primary-300", s.meta)}>Completed</span>
              <span className={cn("whitespace-nowrap font-semibold! text-primary-500", s.meta)}>{data.completionDate}</span>
            </div>
            {portrait && template.showQr && <CertificateQr code={data.certificateId} s={s} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernCertificate;
