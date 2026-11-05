"use client";

import { useEffect, useState } from "react";
import type { IssuedCertificate } from "@/types/certificate";
import { CERTIFICATES_UPDATED_EVENT, fetchIssuedPage, type IssuedQuery } from "@/lib/certificateStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { toast } from "sonner";

/** One page of the Issued table from the API; re-read when the query changes or certificates change. */
export function useIssuedPage(query: IssuedQuery) {
  const [state, setState] = useState<{ rows: IssuedCertificate[]; total: number; loaded: boolean }>({ rows: [], total: 0, loaded: false });
  const [isFetching, setIsFetching] = useState(true);
  const key = JSON.stringify(query);

  useEffect(() => {
    let alive = true;
    const q = JSON.parse(key) as IssuedQuery;
    const load = () => {
      setIsFetching(true);
      fetchIssuedPage(q).then(
        (res) => {
          if (!alive) return;
          setState({ ...res, loaded: true });
          setIsFetching(false);
        },
        (err) => {
          if (!alive) return;
          setState((s) => ({ ...s, loaded: true }));
          setIsFetching(false);
          toast.error("Couldn't load certificates", { description: apiErrorMessage(err, "Please try again.") });
        }
      );
    };
    load();
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(CERTIFICATES_UPDATED_EVENT, load);
    };
  }, [key]);

  return { ...state, isFetching };
}

export default useIssuedPage;
