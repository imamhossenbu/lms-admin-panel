import { formatMoney, WORKSPACE_CURRENCY } from "@/lib/money";

/** "৳1,250.00" — orders are in the workspace currency (BDT) unless the API says otherwise. */
export const formatCurrency = (value: number, currency = WORKSPACE_CURRENCY) => formatMoney(value, { currency, fixed: true });

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const formatOrderTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const formatOrderDateTime = (iso: string) => `${formatOrderDate(iso)} ${formatOrderTime(iso)}`;
