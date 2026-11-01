"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Navigation guard for unsaved changes: `navigate(href)` goes straight there when the form is
 * clean, otherwise stores the target so a ConfirmModal can ask first.
 */
export function useLeaveGuard(isDirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (isDirty) setPendingHref(href);
      else router.push(href);
    },
    [isDirty, router]
  );

  const confirmLeave = useCallback(async () => {
    if (pendingHref) router.push(pendingHref);
  }, [pendingHref, router]);

  const cancelLeave = useCallback(() => setPendingHref(null), []);

  return { navigate, isConfirmOpen: pendingHref !== null, confirmLeave, cancelLeave };
}
