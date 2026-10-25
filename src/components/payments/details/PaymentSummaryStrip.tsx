import React from "react";
import { CalendarDays, CreditCard } from "lucide-react";
import { SummaryStrip } from "@/components/ui/SummaryStrip";
import { CopyButton } from "@/components/ui/CopyButton";
import { OrderItem } from "@/types/order";
import { transactionCode, transactionHash } from "@/lib/orderView";
import { PaymentMethodLogo, PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { formatCurrency, formatOrderDate, formatOrderTime } from "@/components/orders/orderFormat";

export function PaymentSummaryStrip({ order }: { order: OrderItem }) {
  const date = order.paidAt ?? order.createdAt;
  return (
    <SummaryStrip
      leading={<PaymentMethodLogo method={order.paymentMethod} size="lg" />}
      items={[
        {
          key: "txn",
          label: "Transaction ID",
          content: (
            <>
              <p className="heading-h4 font-bold text-primary-500">{transactionCode(order)}</p>
              <div className="flex items-center gap-1">
                <p className="body-sm-regular text-primary-300 truncate">{order.transactionId || transactionHash(order)}</p>
                <CopyButton value={order.transactionId || transactionHash(order)} label="Gateway reference copied" />
              </div>
            </>
          ),
        },
        { key: "status", label: "Payment Status", content: <PaymentStatusBadge status={order.status} size="lg" /> },
        {
          key: "date",
          label: order.paidAt ? "Payment Date" : "Initiated On",
          icon: <CalendarDays />,
          content: (
            <>
              <p className="body-l-medium text-primary-500">{formatOrderDate(date)}</p>
              <p className="body-sm-regular text-primary-400">{formatOrderTime(date)}</p>
            </>
          ),
        },
        {
          key: "method",
          label: "Payment Method",
          icon: <CreditCard />,
          content: (
            <>
              <p className="body-l-medium text-blue">{order.paymentMethod}</p>
              <p className="body-sm-regular text-primary-400 truncate">{order.paymentAccount}</p>
            </>
          ),
        },
        {
          key: "amount",
          label: "Amount",
          content: (
            <>
              <p className="heading-h4 font-bold text-primary-500">{formatCurrency(order.amount)}</p>
              <p className="body-sm-regular text-primary-300">{order.currency}</p>
            </>
          ),
        },
      ]}
    />
  );
}

export default PaymentSummaryStrip;
