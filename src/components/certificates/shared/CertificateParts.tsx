"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { CertificateSigner } from "@/types/certificate";
import { EduProCapIcon, EduProLogo } from "@/components/ui/EduProLogo";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { AccentClasses } from "./certificateAccent";
import type { CertScaleClasses } from "./certificateScale";
import { qrMatrix } from "./certificateQr";

/** QR-style verification block (deterministic from the certificate id) + optional code caption. */
export function CertificateQr({ code, s, light = false, showCode = true }: { code: string; s: CertScaleClasses; light?: boolean; showCode?: boolean }) {
  const cells = useMemo(() => qrMatrix(code || "certificate"), [code]);
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <div className={cn("grid grid-cols-11 gap-px rounded-xs bg-white p-0.5 ring-1 ring-slate-200", s.qr)} role="img" aria-label={`Verification code ${code}`}>
        {cells.map((on, i) => (
          <span key={i} className={cn("aspect-square", on ? "bg-primary-500" : "bg-white")} />
        ))}
      </div>
      {showCode && (
        <span className={cn("whitespace-nowrap tabular-nums", s.meta, light ? "text-white" : "text-primary-300")} title={code}>
          {code}
        </span>
      )}
    </div>
  );
}

/** Round award seal in the accent colour. */
export function CertificateSeal({ accent, s, inverted = false }: { accent: AccentClasses; s: CertScaleClasses; inverted?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.85, rotate: -12, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className={cn("flex shrink-0 items-center justify-center rounded-full border-2 border-dashed p-0.5", inverted ? "border-white" : accent.border, s.seal)}
    >
      <span className={cn("flex h-full w-full items-center justify-center rounded-full", inverted ? "bg-white" : accent.solid)}>
        <Award className={cn(s.sealIcon, inverted ? accent.text : "text-white")} />
      </span>
    </motion.div>
  );
}

/** Signature (image or typed script-style name) over a rule, then name + title. */
export function SignerBlock({ signer, s, align = "center", light = false }: { signer: CertificateSigner; s: CertScaleClasses; align?: "center" | "left"; light?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col", s.signerWidth, align === "center" ? "items-center text-center" : "items-start text-left")}>
      {signer.signatureUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={signer.signatureUrl} alt={`${signer.name} signature`} className="h-8 max-w-full object-contain" />
      ) : (
        <span className={cn("max-w-full truncate font-serif italic", s.signature, light ? "text-white" : "text-primary-500")}>{signer.name}</span>
      )}
      <span className={cn("mt-0.5 w-full border-t", light ? "border-white/60" : "border-primary-300")} />
      <span className={cn("mt-1 max-w-full truncate font-semibold!", s.signerName, light ? "text-white" : "text-primary-500")}>{signer.name}</span>
      <span className={cn("max-w-full truncate", s.signerTitle, light ? "text-white" : "text-primary-300")}>{signer.title}</span>
    </div>
  );
}

/** "Grade 92%" pill in the accent tone. */
export function GradePill({ grade, accent, s }: { grade: number | null; accent: AccentClasses; s: CertScaleClasses }) {
  return (
    <ToneBadge tone={accent.tone} size={s.badge} variant="pill">
      Grade {grade === null ? "—" : `${grade}%`}
    </ToneBadge>
  );
}

/** EduPro logo sized for the scale (icon only on thumbnails, or when `iconOnly`, e.g. inside the MODERN band chip). */
export function CertificateLogo({ s, center = false, iconOnly = false }: { s: CertScaleClasses; center?: boolean; iconOnly?: boolean }) {
  if (!s.logoText || iconOnly) {
    const size = s.compact ? "h-4 w-4" : s.logo === "md" ? "h-9 w-9" : "h-7 w-7";
    return <EduProCapIcon className={cn(size, "shrink-0", center && "mx-auto")} />;
  }
  return <EduProLogo size={s.logo} subtitle="" className={cn(center && "justify-center")} />;
}

export default CertificateQr;
