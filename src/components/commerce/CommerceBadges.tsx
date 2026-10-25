import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { OrderStatus, PaymentMethod } from "@/types/order";
import { orderStatusView, paymentStatusView } from "@/lib/orderView";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

/** Order Status column: Completed / Processing / Cancelled / Refunded. */
export function OrderStatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const view = orderStatusView(status);
  return (
    <ToneBadge tone={view.tone} size={size}>
      {view.label}
    </ToneBadge>
  );
}

/** Payment Status column: Paid / Pending / Failed / Cancelled / Refunded. */
export function PaymentStatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const view = paymentStatusView(status);
  return (
    <ToneBadge tone={view.tone} size={size}>
      {view.label}
    </ToneBadge>
  );
}

const METHOD_STYLE: Record<PaymentMethod, { glyph: string; className: string }> = {
  Stripe: { glyph: "S", className: "bg-green text-white" },
  PayPal: { glyph: "P", className: "bg-blue text-white" },
  SSLCommerz: { glyph: "≋", className: "bg-blue-14 text-blue" },
  bKash: { glyph: "b", className: "bg-red text-white" },
  Nagad: { glyph: "N", className: "bg-brand-orange text-white" },
};

const LOGO_SIZE = {
  sm: "w-6 h-6 rounded-md body-xsm-medium",
  md: "w-7 h-7 rounded-md body-sm-medium",
  lg: "w-16 h-16 rounded-2xl heading-h3",
};

/** Square gateway mark (brand glyph on a token colour). */
export function PaymentMethodLogo({ method, size = "sm" }: { method: PaymentMethod; size?: keyof typeof LOGO_SIZE }) {
  const style = METHOD_STYLE[method];
  return (
    <span aria-hidden className={cn("flex items-center justify-center font-bold shrink-0", LOGO_SIZE[size], style.className)}>
      {style.glyph}
    </span>
  );
}

/** Gateway logo + name, used in tables. */
export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
      <PaymentMethodLogo method={method} />
      <span className="body-sm-regular text-primary-500">{method}</span>
    </span>
  );
}
