"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Guards a dirty form: warns before closing/reloading the tab and intercepts in-app link clicks
 * (breadcrumb, sidebar …) so the page can show a "Discard changes?" confirm. `leave(href)` asks too.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const dirtyRef = useRef(isDirty);
  const bypassRef = useRef(false);

  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current || bypassRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current || bypassRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(url.pathname + url.search + url.hash);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  /** Navigate without asking (after a successful save or a confirmed discard). */
  const navigate = useCallback(
    (href: string) => {
      bypassRef.current = true;
      setPendingHref(null);
      router.push(href);
    },
    [router]
  );

  /** Navigate, asking first when there are unsaved changes. */
  const leave = useCallback((href: string) => (dirtyRef.current ? setPendingHref(href) : navigate(href)), [navigate]);

  return {
    pendingHref,
    leave,
    navigate,
    confirmLeave: () => pendingHref && navigate(pendingHref),
    cancelLeave: () => setPendingHref(null),
  };
}

export default useUnsavedChangesGuard;
