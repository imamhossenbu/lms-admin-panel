import React from "react";
import { DetailCard } from "@/components/ui/DetailCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { OrderItem } from "@/types/order";
import { transactionCode } from "@/lib/orderView";
import { AmountBreakdown } from "@/components/commerce/AmountBreakdown";
import { PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { formatOrderDateTime } from "@/components/orders/orderFormat";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="body-sm-regular text-primary-400 w-36 shrink-0">{label}</span>
      <div className="body-sm-regular text-primary-500 min-w-0 flex-1 break-words">{children}</div>
    </div>
  );
}

export function PaymentDetailsCard({ order }: { order: OrderItem }) {
  return (
    <DetailCard title="Payment Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-dash">
        <div className="space-y-3">
          <Row label="Payment Method">
            <span className="inline-flex items-center gap-2">
              {order.paymentMethod}
              {order.manuallyPaid && (
                <ToneBadge tone="yellow" size="sm">
                  Manual
                </ToneBadge>
              )}
            </span>
          </Row>
          <Row label="Card / Account">{order.paymentAccount}</Row>
          <Row label="Transaction ID">
            <span className="inline-flex items-center gap-1">
              <span className="text-blue">{transactionCode(order)}</span>
              <CopyButton value={transactionCode(order)} label="Transaction ID copied" />
            </span>
          </Row>
          <Row label="Gateway Reference">{order.transactionId || "Not paid yet"}</Row>
          <Row label="Payment Date">{order.paidAt ? formatOrderDateTime(order.paidAt) : "—"}</Row>
          <Row label="Payment Currency">{order.currency}</Row>
          {order.refundReason && <Row label="Refund Reason">{order.refundReason}</Row>}
          {order.cancelReason && <Row label="Cancel Reason">{order.cancelReason}</Row>}
        </div>
        <div className="md:pl-6">
          <AmountBreakdown
            order={order}
            footer={
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="body-sm-regular text-primary-400">Payment Status</span>
                <PaymentStatusBadge status={order.status} />
              </div>
            }
          />
        </div>
      </div>
    </DetailCard>
  );
}

export default PaymentDetailsCard;
