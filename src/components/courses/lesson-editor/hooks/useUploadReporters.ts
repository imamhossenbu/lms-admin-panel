"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Merges several uploaders inside one tab into the tab's single `onUploadingChange`:
 * the tab reports "uploading" while ANY of its uploaders is busy.
 */
export function useUploadReporters(onUploadingChange?: (uploading: boolean) => void) {
  const active = useRef(new Set<string>());
  const parentRef = useRef(onUploadingChange);
  const cache = useRef(new Map<string, (uploading: boolean) => void>());

  useEffect(() => {
    parentRef.current = onUploadingChange;
  });

  return useCallback((key: string) => {
    let reporter = cache.current.get(key);
    if (!reporter) {
      reporter = (uploading: boolean) => {
        if (uploading) active.current.add(key);
        else active.current.delete(key);
        parentRef.current?.(active.current.size > 0);
      };
      cache.current.set(key, reporter);
    }
    return reporter;
  }, []);
}
