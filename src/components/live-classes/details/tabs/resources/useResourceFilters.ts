"use client";

import { useUrlParams } from "@/lib/useUrlParams";
import type { LiveResourceType } from "@/types/liveClass";
import { RESOURCE_TYPES } from "./resourceMeta";

export const RESOURCE_PAGE_SIZE = 10;
export type ResourceFilter = "ALL" | LiveResourceType;

/** Resources tab state in the URL: ?rtype (type pill) and ?rpage. */
export function useResourceFilters() {
  const { get, set } = useUrlParams();
  const raw = get("rtype", "ALL");
  const type: ResourceFilter = (RESOURCE_TYPES as string[]).includes(raw) ? (raw as LiveResourceType) : "ALL";
  const rawPage = Number(get("rpage", "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  return {
    type,
    page,
    setType: (t: ResourceFilter) => set({ rtype: t === "ALL" ? null : t, rpage: null }),
    setPage: (p: number) => set({ rpage: p === 1 ? null : p }),
  };
}
