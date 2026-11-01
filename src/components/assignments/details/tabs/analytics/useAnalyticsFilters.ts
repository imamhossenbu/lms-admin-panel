"use client";

import { useUrlParams } from "@/lib/useUrlParams";

export type ScoreScope = "all" | "ontime" | "late";
export type TrendRange = 7 | 14 | 30;
export type CriteriaFilter = "all" | "below" | "above";

const SCOPES: ScoreScope[] = ["all", "ontime", "late"];
const RANGES: TrendRange[] = [7, 14, 30];
const CRITERIA: CriteriaFilter[] = ["all", "below", "above"];

/** Analytics chart filters kept in the URL (?dist=, ?range=, ?crit=) so a reload keeps them. */
export function useAnalyticsFilters() {
  const { get, set } = useUrlParams();
  const scopeRaw = get("dist", "all") as ScoreScope;
  const rangeRaw = Number(get("range", "7")) as TrendRange;
  const critRaw = get("crit", "all") as CriteriaFilter;

  return {
    scope: SCOPES.includes(scopeRaw) ? scopeRaw : "all",
    range: RANGES.includes(rangeRaw) ? rangeRaw : 7,
    criteria: CRITERIA.includes(critRaw) ? critRaw : "all",
    setScope: (v: ScoreScope) => set({ dist: v === "all" ? null : v }),
    setRange: (v: TrendRange) => set({ range: v === 7 ? null : v }),
    setCriteria: (v: CriteriaFilter) => set({ crit: v === "all" ? null : v }),
  };
}
