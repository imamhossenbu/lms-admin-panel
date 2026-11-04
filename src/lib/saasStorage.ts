import type { BillingCycle, Institution, PaymentMethod, Plan, PlanId, SaasInvoice } from "@/types/saas";
import type { SignupFormValues } from "@/validations/saasSchema";
import { apiClient } from "@/lib/api";
import { refreshWorkspaceSaas } from "@/lib/workspaceSaas";

/**
 * Billing actions for the signed-in workspace (`/saas/me/*`) and the public signup (`/saas/public/*`).
 * Every workspace action refreshes `lib/workspaceSaas` afterwards (also after a failure: a declined payment
 * still marks the invoice FAILED), so plan gates, usage meters and the billing banner update. Errors are
 * Axios errors; callers show them with `apiErrorMessage` / `errorMessage`.
 *
 * The `institutionId` parameters are kept for call-site compatibility: the API always acts on the
 * workspace in the session token.
 */

async function act<T>(call: () => Promise<{ data: T }>): Promise<T> {
  try {
    return (await call()).data;
  } finally {
    await refreshWorkspaceSaas().catch(() => undefined);
  }
}

// ---------------------------------------------------------------- subscription

export interface ChangePlanResult {
  institution: Institution;
  invoice: SaasInvoice | null;
  kind: "UPGRADE" | "DOWNGRADE" | "CYCLE";
}

/** Immediate plan / cycle change (prorated invoice on upgrades; rejected when usage exceeds the target limits). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const changePlan = (_institutionId: string, planId: PlanId, cycle: BillingCycle) =>
  act(() => apiClient.post<ChangePlanResult>("/saas/me/change-plan", { planId, cycle }));

/** `atPeriodEnd` keeps access until the period ends; otherwise cancels now. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cancelSubscription = (_institutionId: string, atPeriodEnd: boolean) => act(() => apiClient.post<Institution>("/saas/me/cancel", { atPeriodEnd }));

/** Undoes a scheduled cancellation, or restarts a cancelled subscription. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const reactivateSubscription = (_institutionId: string) => act(() => apiClient.post<Institution>("/saas/me/reactivate"));

/** Trial → paid: charges the first period now on the given payment method. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convertTrial = (_institutionId: string, planId: PlanId, cycle: BillingCycle, paymentMethod: PaymentMethod) =>
  act(() => apiClient.post<Institution>("/saas/me/convert-trial", { planId, cycle, paymentMethod }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updatePaymentMethod = (_institutionId: string, paymentMethod: PaymentMethod) => act(() => apiClient.patch<Institution>("/saas/me/payment-method", paymentMethod));

// ---------------------------------------------------------------- invoices

/** Pays an open / failed invoice with the card on file (a decline keeps it FAILED and throws). */
export const retryInvoice = (invoiceId: string) => act(() => apiClient.post<SaasInvoice>(`/saas/me/invoices/${encodeURIComponent(invoiceId)}/pay`));

// ---------------------------------------------------------------- custom domain

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addCustomDomain = (_institutionId: string, domain: string) => act(() => apiClient.post<Institution>("/saas/me/domain", { domain }));
/** Checks the CNAME / TXT records; throws a friendly message when they aren't found yet. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyCustomDomain = (_institutionId: string) => act(() => apiClient.post<Institution>("/saas/me/domain/verify"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeCustomDomain = (_institutionId: string) => act(() => apiClient.delete<Institution>("/saas/me/domain"));

// ---------------------------------------------------------------- public signup

/** Public, non-archived plans for the signup page. */
export const fetchPublicPlans = async () => (await apiClient.get<Plan[]>("/saas/public/plans")).data;

export type SlugCheck = { available: true } | { available: false; reason: string };

/** Subdomain availability with a reason (format, reserved, taken). Debounce in the UI. */
export const checkSlugAvailability = async (slug: string) =>
  (await apiClient.get<SlugCheck>("/saas/public/slug-availability", { params: { slug: slug.trim().toLowerCase() } })).data;

export interface SignupResponse {
  institution: Institution;
  email: string;
  message: string;
}

/** Creates the academy on a free trial + its admin account (PENDING until the emailed 6-digit code is entered). */
export const signupInstitution = async (values: SignupFormValues) => (await apiClient.post<SignupResponse>("/saas/public/signup", values)).data;
