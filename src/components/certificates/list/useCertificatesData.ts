"use client";

import { useCallback, useEffect, useState } from "react";
import type { CertificateSeed } from "@/data/mockCertificateData";
import { CERTIFICATES_UPDATED_EVENT, fetchCertificates } from "@/lib/certificateStorage";

/** Loads templates, certificates, events and the eligible queue; re-reads on every CERTIFICATES_UPDATED_EVENT. */
export function useCertificatesData() {
  const [data, setData] = useState<CertificateSeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const sync = () =>
      fetchCertificates().then(
        (next) => {
          if (!alive) return;
          setData(next);
          setLoadError(null);
          setIsLoading(false);
        },
        () => {
          if (!alive) return;
          setLoadError("We couldn't read the certificates. Please try again.");
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(CERTIFICATES_UPDATED_EVENT, onUpdate);
    };
  }, [attempt]);

  return { data, isLoading, loadError, retry };
}

export default useCertificatesData;
