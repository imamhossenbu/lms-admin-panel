"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isPreviewTab, type PreviewTab } from "../createCourseOptions";

/** Preview tab kept in `?tab=` so a reload stays on the same tab. Needs a <Suspense> parent. */
export function usePreviewTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");
  const tab: PreviewTab = isPreviewTab(raw) ? raw : "overview";

  const setTab = useCallback(
    (next: PreviewTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "overview") params.delete("tab");
      else params.set("tab", next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return [tab, setTab] as const;
}
