export type BillingTab = "overview" | "plans" | "invoices";

export const BILLING_TABS: { id: BillingTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "plans", label: "Plans" },
  { id: "invoices", label: "Invoices" },
];

/** `?tab=` → a known tab ("overview" by default). */
export const parseBillingTab = (v: string | null | undefined): BillingTab =>
  v === "plans" || v === "invoices" ? v : "overview";
