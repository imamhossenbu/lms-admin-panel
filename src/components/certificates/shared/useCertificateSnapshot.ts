"use client";

import { useEffect, useState } from "react";
import { CERTIFICATES_UPDATED_EVENT, getCertificatesSnapshot } from "@/lib/certificateStorage";

type Snapshot = ReturnType<typeof getCertificatesSnapshot>;

/** Synchronous storage snapshot (templates, certificates…) while `enabled`, refreshed on every update event. */
export function useCertificateSnapshot(enabled: boolean): Snapshot | null {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const sync = () => setSnapshot(getCertificatesSnapshot());
    sync();
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CERTIFICATES_UPDATED_EVENT, sync);
  }, [enabled]);
  return snapshot;
}

export default useCertificateSnapshot;
