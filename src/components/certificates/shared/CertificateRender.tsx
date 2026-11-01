"use client";

import React from "react";
import { motion } from "framer-motion";
import { renderCertificateText } from "@/lib/certificateStats";
import { cn } from "@/lib/cn";
import { CERT_ACCENT } from "./certificateAccent";
import { CERT_SCALE, type CertificateScale } from "./certificateScale";
import type { CertificateRenderData, CertificateRenderTemplate } from "./certificateRenderTypes";
import { ClassicCertificate } from "./ClassicCertificate";
import { ModernCertificate } from "./ModernCertificate";
import { MinimalCertificate } from "./MinimalCertificate";

export type { CertificateRenderData, CertificateRenderTemplate } from "./certificateRenderTypes";
export type { CertificateScale } from "./certificateScale";

export interface CertificateRenderProps {
  template: CertificateRenderTemplate;
  data: CertificateRenderData;
  /** sm = thumbnails, md = previews (modals, designer), lg = detail page. */
  scale?: CertificateScale;
  /** Extra classes on the sheet, e.g. "h-full w-auto" to fit a portrait sheet by height. */
  className?: string;
}

const LAYOUTS = { CLASSIC: ClassicCertificate, MODERN: ModernCertificate, MINIMAL: MinimalCertificate } as const;

/**
 * Real-looking certificate built only from globals.css tokens + lucide icons. Fixed paper ratio
 * (≈ A4: 10:7 landscape, 7:10 portrait); three layouts (CLASSIC / MODERN / MINIMAL) and five accents.
 */
export function CertificateRender({ template, data, scale = "md", className }: CertificateRenderProps) {
  const portrait = template.orientation === "PORTRAIT";
  const Layout = LAYOUTS[template.layout] ?? ClassicCertificate;
  const body = renderCertificateText(template.bodyText, data);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("relative w-full select-none overflow-hidden rounded-sm shadow-sm", portrait ? "aspect-7/10" : "aspect-10/7", className)}
      role="img"
      aria-label={`${template.heading} for ${data.studentName}`}
    >
      <Layout template={template} data={data} body={body} accent={CERT_ACCENT[template.accent] ?? CERT_ACCENT.orange} s={CERT_SCALE[scale]} portrait={portrait} />
    </motion.div>
  );
}

export default CertificateRender;
