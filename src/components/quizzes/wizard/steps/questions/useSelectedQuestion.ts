"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/useUrlParams";

/**
 * Which question the editor shows. Tracked by question id (survives reorder / delete) and mirrored to
 * `?question=N` (1-based) so a reload reopens the same question. Must render inside <Suspense>.
 */
export function useSelectedQuestion(ids: string[]) {
  const url = useUrlParams();
  const urlIndex = Math.max(0, Number(url.get("question", "1")) - 1 || 0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const found = selectedId ? ids.indexOf(selectedId) : -1;
  const index = ids.length === 0 ? -1 : found >= 0 ? found : Math.min(urlIndex, ids.length - 1);

  const urlValue = index >= 0 ? String(index + 1) : "";
  const current = url.get("question");
  useEffect(() => {
    // Wait for the questions to load (edit mode resets the form after mount) before touching the URL.
    if (ids.length === 0) return;
    if (current !== urlValue && !(urlValue === "1" && current === "")) url.set({ question: urlValue === "1" ? null : urlValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlValue, current, ids.length]);

  return {
    index,
    select: (id: string) => setSelectedId(id),
    selectIndex: (i: number) => {
      if (ids[i]) setSelectedId(ids[i]);
    },
  };
}
