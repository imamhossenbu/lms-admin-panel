"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CertificateEvent, CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { CERTIFICATES_UPDATED_EVENT, fetchCertificate } from "@/lib/certificateStorage";

export type CertificateDetailState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; certificate: IssuedCertificate; template: CertificateTemplate | null; events: CertificateEvent[] };

/** Loads a certificate + its template + event log, and reloads whenever certificate storage changes. */
export function useCertificateDetail(id: string) {
  const [state, setState] = useState<CertificateDetailState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchCertificate(id)
      .then((res) => {
        if (!cancelled) setState(res ? { status: "ready", ...res } : { status: "notFound" });
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Couldn't load certificate", { description: "Please refresh the page and try again." });
        setState({ status: "notFound" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // Live refresh (this tab's writes + other tabs). Errors keep the last data on screen.
    const refresh = () => {
      fetchCertificate(id)
        .then((res) => res && setState({ status: "ready", ...res }))
        .catch(() => {});
    };
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CERTIFICATES_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);

  return state;
}

export default useCertificateDetail;
