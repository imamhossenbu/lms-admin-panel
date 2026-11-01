import type { Tone } from "@/components/ui/ToneBadge";
import type { BillingCycle, InvoiceStatus, Plan, PlanId, SubscriptionStatus } from "@/types/saas";

/** "$49" / "$1,234.50" (USD; cents only when present). */
export function formatUsd(amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** "Mar 4, 2026". */
export function formatBillingDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "Mar 4 – Apr 3, 2026". */
export function formatPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";
  const sameYear = s.getFullYear() === e.getFullYear();
  const left = s.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) });
  const right = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${left} – ${right}`;
}

export const isCustomPriced = (plan: Plan) => plan.priceMonthly === 0 && plan.priceYearly === 0;

/** Price for the chosen cycle. */
export const planPrice = (plan: Plan, cycle: BillingCycle) => (cycle === "YEARLY" ? plan.priceYearly : plan.priceMonthly);

/** Effective monthly price (yearly ÷ 12). */
export const monthlyEquivalent = (plan: Plan, cycle: BillingCycle) =>
  cycle === "YEARLY" ? Math.round((plan.priceYearly / 12) * 100) / 100 : plan.priceMonthly;

export const cycleSuffix = (cycle: BillingCycle) => (cycle === "YEARLY" ? "/yr" : "/mo");
export const cycleLabel = (cycle: BillingCycle) => (cycle === "YEARLY" ? "Yearly" : "Monthly");

/** Rounded % saved by paying yearly vs 12 × monthly (17 for 10× pricing). */
export function yearlySavingsPct(plans: Plan[]): number {
  const paid = plans.filter((p) => p.priceMonthly > 0 && p.priceYearly > 0);
  if (!paid.length) return 0;
  const best = Math.max(...paid.map((p) => 1 - p.priceYearly / (p.priceMonthly * 12)));
  return Math.round(best * 100);
}

export const SUBSCRIPTION_STATUS_META: Record<SubscriptionStatus, { label: string; tone: Tone }> = {
  TRIALING: { label: "Trial", tone: "blue" },
  ACTIVE: { label: "Active", tone: "green" },
  PAST_DUE: { label: "Past due", tone: "red" },
  CANCELLED: { label: "Cancelled", tone: "gray" },
  SUSPENDED: { label: "Suspended", tone: "red" },
};

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  PAID: { label: "Paid", tone: "green" },
  OPEN: { label: "Open", tone: "yellow" },
  FAILED: { label: "Failed", tone: "red" },
  REFUNDED: { label: "Refunded", tone: "purple" },
  VOID: { label: "Void", tone: "gray" },
};

export const PLAN_TONE: Record<PlanId, Tone> = {
  starter: "gray",
  growth: "blue",
  pro: "orange",
  enterprise: "purple",
};

/** Small artificial delay so mock actions show their loading state. */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Error → friendly sentence for toasts. */
export const errorMessage = (err: unknown, fallback = "Please try again in a moment.") =>
  err instanceof Error && err.message ? err.message : fallback;
