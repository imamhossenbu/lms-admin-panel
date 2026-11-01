"use client";

import React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CertificateLayoutProps } from "./certificateRenderTypes";
import { CertificateLogo, CertificateQr, CertificateSeal, GradePill, SignerBlock } from "./CertificateParts";

const CORNERS = ["left-1 top-1", "right-1 top-1", "bottom-1 left-1", "bottom-1 right-1"];

/** Line – diamond – line ornament. */
function Flourish({ solid, rule }: { solid: string; rule: string }) {
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      <span className={cn("h-px", rule, solid)} />
      <span className={cn("h-1.5 w-1.5 rotate-45", solid)} />
      <span className={cn("h-px", rule, solid)} />
    </span>
  );
}

/** CLASSIC: ornamental double frame, everything centred, seal between the signers. */
export function ClassicCertificate({ template, data, body, accent, s }: CertificateLayoutProps) {
  const left = template.signers.filter((_, i) => i % 2 === 0);
  const right = template.signers.filter((_, i) => i % 2 === 1);
  return (
    <div className={cn("h-full w-full border-4 border-double bg-white", accent.border, s.frame)}>
      <div className={cn("relative flex h-full w-full flex-col items-center justify-between overflow-hidden border text-center", accent.borderSoft, s.pad)}>
        {CORNERS.map((pos) => (
          <span key={pos} aria-hidden className={cn("absolute h-2 w-2 rotate-45", pos, accent.solid)} />
        ))}
        <Award aria-hidden className={cn("pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5", accent.text)} />
        {template.showQr && (
          <div className="absolute right-3 top-3">
            <CertificateQr code={data.certificateId} s={s} />
          </div>
        )}

        <div className={cn("relative flex flex-col items-center", s.gap)}>
          {template.showLogo && <CertificateLogo s={s} center />}
          <p className={cn("uppercase tracking-wider", s.heading, accent.text)}>{template.heading}</p>
          {!s.compact && <Flourish solid={accent.solid} rule={s.rule} />}
        </div>

        <div className={cn("relative flex min-w-0 max-w-full flex-col items-center", s.gap)}>
          <p className={cn("uppercase tracking-widest text-primary-300", s.eyebrow)}>Proudly presented to</p>
          <p className={cn("max-w-full truncate text-primary-500", s.name)} title={data.studentName}>
            {data.studentName}
          </p>
          <span className={cn("h-px", s.rule, accent.solid)} aria-hidden />
          <p className={cn("max-w-prose text-primary-400", s.body)}>{body}</p>
          {template.showGrade && <GradePill grade={data.grade} accent={accent} s={s} />}
        </div>

        <div className="relative grid w-full grid-cols-3 items-end gap-2">
          <div className="flex min-w-0 justify-start gap-3 overflow-hidden">
            {left.map((signer) => (
              <SignerBlock key={signer.id} signer={signer} s={s} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <CertificateSeal accent={accent} s={s} />
            <span className={cn("whitespace-nowrap text-primary-300", s.meta)}>{data.completionDate}</span>
          </div>
          <div className="flex min-w-0 justify-end gap-3 overflow-hidden">
            {right.map((signer) => (
              <SignerBlock key={signer.id} signer={signer} s={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassicCertificate;
