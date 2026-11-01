"use client";

import React from "react";
import { CertificateRender } from "@/components/certificates/shared/CertificateRender";
import type { CertificateRenderTemplate } from "@/components/certificates/shared/certificateRenderTypes";
import type { CertificateLayout } from "@/types/certificate";
import { cn } from "@/lib/cn";
import { previewData, SAMPLE_LEARNERS } from "./designerUtils";

export interface LayoutThumbnailProps {
  layout: CertificateLayout;
  template: CertificateRenderTemplate;
}

/** Tiny (scale "sm") certificate preview used inside the layout picker cards. */
export function LayoutThumbnail({ layout, template }: LayoutThumbnailProps) {
  const portrait = template.orientation === "PORTRAIT";
  return (
    <div className="pointer-events-none flex h-28 w-36 items-center justify-center" aria-hidden>
      <div className={cn(portrait ? "w-18" : "w-36")}>
        <CertificateRender template={{ ...template, layout }} data={previewData(SAMPLE_LEARNERS[0], {})} scale="sm" />
      </div>
    </div>
  );
}

export default LayoutThumbnail;
