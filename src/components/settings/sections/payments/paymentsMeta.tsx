import React from "react";
import { CreditCard, Globe2, Smartphone } from "lucide-react";
import type { GeneralSettings } from "@/validations/platformSettingsSchema";

export type GatewayKey = "sslcommerz" | "stripe" | "bkash";
export type GatewayTone = "blue" | "purple" | "red";

export interface GatewayMeta {
  key: GatewayKey;
  name: string;
  description: string;
  /** Short tag shown beside the name (region / currency). */
  tag: string;
  /** Checkout option label in the preview. */
  checkoutLabel: string;
  checkoutHint: string;
  icon: React.ReactNode;
  /** Token colour of the logo tile. */
  tone: GatewayTone;
  publicKeyLabel: string;
  publicKeyPlaceholder: string;
  secretLabel: string;
}

export const GATEWAYS: GatewayMeta[] = [
  {
    key: "sslcommerz",
    name: "SSLCommerz",
    description: "Cards, mobile banking and net banking for students in Bangladesh.",
    tag: "BDT",
    checkoutLabel: "Card / Mobile banking",
    checkoutHint: "Visa, Mastercard, Nagad, Rocket",
    icon: <CreditCard className="h-5 w-5" />,
    tone: "blue",
    publicKeyLabel: "Store ID",
    publicKeyPlaceholder: "e.g. edupro_live_store",
    secretLabel: "Store password",
  },
  {
    key: "stripe",
    name: "Stripe",
    description: "International credit and debit cards, Apple Pay and Google Pay.",
    tag: "International",
    checkoutLabel: "Credit or debit card",
    checkoutHint: "Visa, Mastercard, Amex",
    icon: <Globe2 className="h-5 w-5" />,
    tone: "purple",
    publicKeyLabel: "Publishable key",
    publicKeyPlaceholder: "pk_live_…",
    secretLabel: "Secret key",
  },
  {
    key: "bkash",
    name: "bKash",
    description: "Pay instantly from a bKash mobile wallet.",
    tag: "Mobile wallet",
    checkoutLabel: "bKash wallet",
    checkoutHint: "Pay with your bKash number",
    icon: <Smartphone className="h-5 w-5" />,
    tone: "red",
    publicKeyLabel: "App key",
    publicKeyPlaceholder: "e.g. 4f6o0cjiki2rfm34kfdadl1eqq",
    secretLabel: "App secret",
  },
];

/** Logo tile colours (same tokens IconSectionCard uses). */
export const GATEWAY_TILE: Record<GatewayTone, string> = {
  blue: "bg-blue-14 text-blue",
  purple: "bg-purple-14 text-purple",
  red: "bg-red-14 text-red",
};

/** Friendly names for the audit log ("stripe.mode" → "Stripe mode"). */
export const PAYMENT_LABELS: Record<string, string> = {
  ...Object.fromEntries(
    GATEWAYS.flatMap((g) => [
      [`${g.key}.enabled`, `${g.name} enabled`],
      [`${g.key}.mode`, `${g.name} mode`],
      [`${g.key}.publicKey`, `${g.name} ${g.publicKeyLabel.toLowerCase()}`],
      [`${g.key}.secretKey`, `${g.name} ${g.secretLabel.toLowerCase()}`],
    ])
  ),
  taxRate: "Tax rate",
  taxInclusive: "Prices include tax",
  refundWindowDays: "Refund window",
  invoicePrefix: "Invoice prefix",
  invoiceFooter: "Invoice footer",
};

export type Currency = GeneralSettings["currency"];

/** Sample course price per currency (keeps the tax example realistic). */
export const SAMPLE_PRICE: Record<Currency, number> = { USD: 49, EUR: 49, GBP: 39, BDT: 4900, INR: 3999 };

export function formatMoney(amount: number, currency: Currency) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Live tax breakdown for the sample course. */
export function taxExample(rate: number, inclusive: boolean, currency: Currency) {
  const price = SAMPLE_PRICE[currency];
  const r = Number.isFinite(rate) && rate > 0 ? rate : 0;
  if (inclusive) {
    const net = price / (1 + r / 100);
    return { price, net, tax: price - net, total: price };
  }
  const tax = (price * r) / 100;
  return { price, net: price, tax, total: price + tax };
}

/** "INV-2026-00042" style sample number. */
export function invoiceSample(prefix: string) {
  const clean = (prefix || "").trim().toUpperCase() || "INV";
  return `${clean}-${new Date().getFullYear()}-00042`;
}

/** Toast text for a failed setup check, e.g. "Save the public key and secret key first." */
export function missingGatewayText(missing: string[], secretLabel: string) {
  const parts = [missing.includes("publicKey") && "public key", missing.includes("secretKey") && secretLabel.toLowerCase()].filter(Boolean) as string[];
  if (parts.length) return `Save the ${parts.join(" and ")} first, then test again.`;
  if (missing.includes("enabled")) return "Turn the gateway on and save, then test again.";
  return "Check the keys and try again.";
}
