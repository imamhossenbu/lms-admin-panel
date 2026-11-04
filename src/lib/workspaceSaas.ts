import type { Institution, Plan, SaasEvent, SaasInvoice, SaasStore } from "@/types/saas";
import { apiClient } from "@/lib/api";

/**
 * The signed-in workspace's subscription, from `GET /saas/me` ({ institution, invoices, events, plans }).
 * It's cached in memory and exposed in the `SaasStore` shape (one institution = the current one), so the
 * plan-gating hooks in `lib/planAccess` (useCurrentPlan, useLimitStatus, LimitGuard, FeatureGate …) work unchanged.
 * Call `refreshWorkspaceSaas()` after anything that changes plan or usage.
 */

export const WORKSPACE_SAAS_UPDATED_EVENT = "edupro_workspace_saas_updated";

interface SaasMeResponse {
  institution: Institution;
  invoices: SaasInvoice[];
  events: SaasEvent[];
  plans: Plan[];
  impersonatedBy: string | null;
}

const EMPTY: SaasStore = { plans: [], institutions: [], invoices: [], events: [], currentInstitutionId: "" };
let store: SaasStore = EMPTY;
let impersonatedBy: string | null = null;
let settled = false;
let inflight: Promise<SaasStore> | null = null;

export const getWorkspaceSaasSnapshot = () => store;
export const isWorkspaceSaasSettled = () => settled;
/** Platform-owner user id when this session was opened from the Owner Console. */
export const getImpersonatedBy = () => impersonatedBy;

export function subscribeWorkspaceSaas(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => queueMicrotask(onChange);
  window.addEventListener(WORKSPACE_SAAS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(WORKSPACE_SAAS_UPDATED_EVENT, handler);
}

/** Loads (or refreshes) the workspace subscription. Concurrent calls share one request. */
export function refreshWorkspaceSaas(): Promise<SaasStore> {
  inflight ??= apiClient
    .get<SaasMeResponse>("/saas/me")
    .then(({ data }) => {
      store = { plans: data.plans, institutions: [data.institution], invoices: data.invoices, events: data.events, currentInstitutionId: data.institution.id };
      impersonatedBy = data.impersonatedBy;
      return store;
    })
    .finally(() => {
      inflight = null;
      settled = true;
      if (typeof window !== "undefined") window.dispatchEvent(new Event(WORKSPACE_SAAS_UPDATED_EVENT));
    });
  return inflight;
}

/** Signed out: forget the previous workspace. */
export function clearWorkspaceSaas() {
  store = EMPTY;
  impersonatedBy = null;
  settled = false;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(WORKSPACE_SAAS_UPDATED_EVENT));
}
