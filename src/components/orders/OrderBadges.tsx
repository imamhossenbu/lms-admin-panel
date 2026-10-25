import React from "react";
import { ToneBadge, Tone } from "@/components/ui/ToneBadge";
import { OrderStatus, PaymentMethod } from "@/types/order";
import { cn } from "@/lib/cn";

const STATUS_TONE: Record<OrderStatus, Tone> = {
  Paid: "green",
  Pending: "orange",
  Failed: "red",
  Cancelled: "gray",
  Refunded: "purple",
};

export function OrderStatusBadge({ status, size = "md" }: { status: OrderStatus; size?: "sm" | "md" | "lg" }) {
  return (
    <ToneBadge tone={STATUS_TONE[status]} size={size}>
      {status}
    </ToneBadge>
  );
}

const METHOD_STYLE: Record<PaymentMethod, { glyph: string; className: string }> = {
  Stripe: { glyph: "S", className: "bg-purple text-white" },
  PayPal: { glyph: "P", className: "bg-blue-14 text-blue" },
  SSLCommerz: { glyph: "≋", className: "bg-blue text-white" },
  bKash: { glyph: "b", className: "bg-red text-white" },
  Nagad: { glyph: "N", className: "bg-brand-orange text-white" },
};

/** Coloured payment-gateway glyph + name. */
export function PaymentMethodBadge({ method, size = "md" }: { method: PaymentMethod; size?: "md" | "lg" }) {
  const style = METHOD_STYLE[method];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
      <span
        aria-hidden
        className={cn(
          "rounded-md flex items-center justify-center font-bold shrink-0",
          size === "lg" ? "w-7 h-7 body-sm-medium" : "w-6 h-6 body-xsm-medium",
          style.className
        )}
      >
        {style.glyph}
      </span>
      <span className={size === "lg" ? "body-medium text-primary-500" : "body-sm-regular text-primary-400"}>
        {method}
      </span>
    </span>
  );
}
