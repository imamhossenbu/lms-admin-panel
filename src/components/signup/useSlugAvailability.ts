"use client";

import { useEffect, useState } from "react";
import { checkSlugAvailability } from "@/lib/saasStorage";
import { slugSchema } from "@/validations/saasSchema";

export type SlugCheckState = "idle" | "invalid" | "checking" | "available" | "taken";

export interface SlugCheck {
  state: SlugCheckState;
  /** Slug the state refers to. */
  slug: string;
  /** Why it's unavailable (state "taken"). */
  reason?: string;
}

/** Debounced live availability check for a subdomain (format errors come from the zod schema). */
export function useSlugAvailability(slug: string, delayMs = 400): SlugCheck {
  const [result, setResult] = useState<SlugCheck>({ state: "idle", slug: "" });
  const trimmed = slug.trim();
  const valid = trimmed.length > 0 && slugSchema.safeParse(trimmed).success;

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setResult({ state: "checking", slug: trimmed });
      try {
        const res = await checkSlugAvailability(trimmed);
        if (!cancelled) setResult(res.available ? { state: "available", slug: trimmed } : { state: "taken", slug: trimmed, reason: res.reason });
      } catch {
        if (!cancelled) setResult({ state: "idle", slug: trimmed });
      }
    }, delayMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [trimmed, valid, delayMs]);

  if (!trimmed) return { state: "idle", slug: "" };
  if (!valid) return { state: "invalid", slug: trimmed };
  // A stale result for a different slug means a check is pending.
  if (result.slug !== trimmed) return { state: "checking", slug: trimmed };
  return result;
}
