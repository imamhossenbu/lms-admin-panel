"use client";

import { useCallback } from "react";
import type { CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { downloadCertificatePdf } from "../shared/downloadCertificate";

/** Returns the "Download PDF" action (print-ready window + download count). Throws friendly errors. */
export function useCertificateDownload(certificate: IssuedCertificate, template: CertificateTemplate | null, courseTitle: string) {
  return useCallback(async () => {
    if (!template) throw new Error("The template used for this certificate was deleted, so it can't be rendered.");
    await downloadCertificatePdf({ certificate, template, courseTitle });
  }, [certificate, template, courseTitle]);
}

export default useCertificateDownload;
