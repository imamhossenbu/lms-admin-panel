"use client";

import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage } from "@/lib/apiError";
import { websiteApi } from "@/lib/api/website";
import type { WebsiteResponse } from "@/types/website";

/** Loads /admin/website once (content, site URL, last saved); `setData` after a save. */
export function useWebsite() {
  const [data, setData] = useState<WebsiteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    websiteApi
      .get()
      .then((d) => alive && (setData(d), setError(null)))
      .catch((e) => alive && setError(apiErrorMessage(e, "Couldn't load your website content.")));
    return () => {
      alive = false;
    };
  }, [nonce]);

  const retry = useCallback(() => {
    setError(null);
    setNonce((n) => n + 1);
  }, []);
  return { data, error, retry, setData };
}
