"use client";

import { useCallback, useEffect, useState } from "react";
import { CERTIFICATES_UPDATED_EVENT, fetchCertificates, type CertificateData } from "@/lib/certificateStorage";
import { apiErrorMessage } from "@/lib/apiError";

/** Loads templates, certificates, recent activity and the eligible queue from the API; re-reads on every CERTIFICATES_UPDATED_EVENT. */
export function useCertificatesData() {
  const [data, setData] = useState<CertificateData | null>(null);
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
        (err) => {
          if (!alive) return;
          setLoadError(apiErrorMessage(err, "We couldn't load the certificates. Please try again."));
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
