"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getInstitution, setCurrentInstitution } from "@/lib/saasStorage";

/**
 * "Open as owner" from the Owner Console (separate app) lands here as `/?impersonate=<institutionId>`.
 * Mock: switches this browser's current institution, then strips the param. With a backend this becomes
 * a short-lived signed token exchanged for an owner-impersonation session.
 */
export function ImpersonationHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);
  const id = params.get("impersonate");

  useEffect(() => {
    if (!id || handled.current === id) return;
    handled.current = id;
    const next = new URLSearchParams(params.toString());
    next.delete("impersonate");
    const clean = `${pathname}${next.size ? `?${next}` : ""}`;
    if (!getInstitution(id)) {
      toast.error("Institution not found", { description: "The link from the Owner Console is no longer valid." });
      router.replace(clean);
      return;
    }
    const toastId = toast.loading("Opening institution panel...");
    setCurrentInstitution(id)
      .then((inst) => toast.success(`Viewing ${inst.name}`, { id: toastId, description: "Opened from the Owner Console as the platform owner." }))
      .catch((err: unknown) => toast.error("Couldn't open the institution", { id: toastId, description: err instanceof Error ? err.message : "Please try again." }))
      .finally(() => router.replace(clean));
  }, [id, params, pathname, router]);

  return null;
}
