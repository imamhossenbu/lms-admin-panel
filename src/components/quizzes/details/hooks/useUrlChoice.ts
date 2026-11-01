"use client";

import { useCallback } from "react";
import { useUrlParams } from "@/lib/useUrlParams";

/** A select value persisted in `?key=` (the fallback is dropped from the URL; unknown values fall back). */
export function useUrlChoice<T extends string>(key: string, options: readonly { value: T }[], fallback: T) {
  const { get, set } = useUrlParams();
  const raw = get(key, fallback);
  const value = (options.some((o) => o.value === raw) ? raw : fallback) as T;
  const setValue = useCallback((next: string) => set({ [key]: next === fallback ? null : next }), [set, key, fallback]);
  return [value, setValue] as const;
}

/** Positive integer page in `?key=` (1 is dropped from the URL). */
export function useUrlPage(key: string) {
  const { get, set } = useUrlParams();
  const raw = Number(get(key, "1"));
  const page = Number.isInteger(raw) && raw > 0 ? raw : 1;
  const setPage = useCallback((p: number) => set({ [key]: p === 1 ? null : p }), [set, key]);
  return [page, setPage] as const;
}

export const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
] as const;

export const INSIGHT_RANGE_OPTIONS = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
] as const;
