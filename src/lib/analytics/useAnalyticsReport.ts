"use client";

import { useEffect, useState } from "react";
import { analyticsApi, toResolvedRange, type AnalyticsEndpoint, type AnalyticsParams, type AnalyticsReports } from "@/lib/api/analytics";
import { parseApiError, type ApiErrorInfo } from "@/lib/apiError";
import type { ResolvedRange } from "./analyticsTypes";

export interface AnalyticsReportState<E extends AnalyticsEndpoint> {
  /** Latest report for exactly these params (null while loading them). */
  report: AnalyticsReports[E] | null;
  range: ResolvedRange | null;
  error: ApiErrorInfo | null;
  isLoading: boolean;
}

/**
 * Loads one analytics report for the given period / options. Pass `enabled = false` to skip the request
 * (e.g. a plan-gated tab). Results are keyed by the params, so a period change shows the loading state.
 */
export function useAnalyticsReport<E extends AnalyticsEndpoint>(endpoint: E, params: AnalyticsParams, enabled = true): AnalyticsReportState<E> {
  const key = `${endpoint}:${JSON.stringify(params)}`;
  const [state, setState] = useState<{ key: string; report: AnalyticsReports[E] | null; error: ApiErrorInfo | null } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const requestKey = `${endpoint}:${JSON.stringify(params)}`;
    analyticsApi
      .get(endpoint, params)
      .then((report) => alive && setState({ key: requestKey, report, error: null }))
      .catch((err) => alive && setState({ key: requestKey, report: null, error: parseApiError(err, "We couldn't load this report.") }));
    return () => {
      alive = false;
    };
    // params is serialized into `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const current = state?.key === key ? state : null;
  return {
    report: current?.report ?? null,
    range: current?.report ? toResolvedRange(current.report.range) : null,
    error: current?.error ?? null,
    isLoading: enabled && !current,
  };
}
