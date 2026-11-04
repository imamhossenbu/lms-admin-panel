/**
 * Money in the workspace currency. Course prices, orders and revenue are in Bangladeshi taka (BDT, "৳"),
 * the API's default order currency. (Billing & Plan shows the platform's own USD prices separately.)
 */
export const WORKSPACE_CURRENCY = "BDT";

const SYMBOL: Record<string, string> = { BDT: "৳", USD: "$" };

export const currencySymbol = (currency: string = WORKSPACE_CURRENCY) => SYMBOL[currency] ?? `${currency} `;

/** "৳1,250" / "৳19.99" (up to `maxDecimals`, no trailing zeros unless `fixed`). */
export function formatMoney(value: number | string, opts: { currency?: string; fixed?: boolean; maxDecimals?: number } = {}) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  const digits = opts.maxDecimals ?? 2;
  return `${currencySymbol(opts.currency)}${safe.toLocaleString("en-US", { minimumFractionDigits: opts.fixed ? digits : 0, maximumFractionDigits: digits })}`;
}

/** Course price label: "Free" or "৳1,250". */
export const coursePrice = (price: number | string | null | undefined, isFree?: boolean) => (isFree || !Number(price) ? "Free" : formatMoney(price ?? 0));
