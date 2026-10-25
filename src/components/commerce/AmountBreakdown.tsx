import React from "react";
import { OrderItem } from "@/types/order";
import { formatCurrency } from "@/components/orders/orderFormat";

/** Subtotal → discount → tax → total block (Order Summary / Payment Details). */
export function AmountBreakdown({ order, footer }: { order: OrderItem; footer?: React.ReactNode }) {
  const taxRate = order.subtotal ? Math.round((order.tax / order.subtotal) * 100) : 0;
  return (
    <div className="space-y-2.5">
      <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
      <Row
        label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
        value={order.discount ? `-${formatCurrency(order.discount)}` : formatCurrency(0)}
        valueClassName={order.discount ? "text-green" : undefined}
      />
      <Row label={`Tax (${taxRate}%)`} value={formatCurrency(order.tax)} />
      <div className="border-t border-dashed border-dash pt-3 flex items-center justify-between gap-4">
        <span className="body-medium font-semibold text-primary-500">Total Amount</span>
        <span className="heading-h5 font-bold text-blue">
          {formatCurrency(order.amount)} <span className="body-sm-medium">{order.currency}</span>
        </span>
      </div>
      {footer}
    </div>
  );
}

function Row({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-sm-regular text-primary-400">{label}</span>
      <span className={`body-sm-regular text-primary-500 ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}

export default AmountBreakdown;
