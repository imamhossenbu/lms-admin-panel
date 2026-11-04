/**
 * Analytics — import everything from "@/lib/analytics".
 *
 *   analyticsTypes      report shapes of GET /admin/analytics/* + ResolvedRange / Granularity / Kpi …
 *   useAnalyticsReport  loads one report for a period (lib/api/analytics)
 *   analyticsRange      date-key helpers for the shared period picker
 *   analyticsFormat     formatCurrency, formatCompactCurrency, formatNumber, formatPercent, formatChange, rangeLabel
 *   useAnalyticsRange   shared reporting period (navbar session range ⇄ URL ?from=&to=)
 */

export * from "./analyticsTypes";
export * from "./analyticsRange";
export * from "./analyticsFormat";
export * from "./useAnalyticsRange";
export * from "./useAnalyticsReport";
