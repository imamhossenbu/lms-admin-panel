import React from "react";
import { FileText, CalendarDays } from "lucide-react";
import { SummaryStrip } from "@/components/ui/SummaryStrip";
import { CopyButton } from "@/components/ui/CopyButton";
import { OrderItem } from "@/types/order";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { formatCurrency, formatOrderDate, formatOrderTime } from "../orderFormat";

export function OrderSummaryStrip({ order }: { order: OrderItem }) {
  return (
    <SummaryStrip
      leading={
        <span className="w-20 h-20 rounded-2xl bg-blue-14 text-blue flex items-center justify-center">
          <FileText className="w-10 h-10" />
        </span>
      }
      items={[
        {
          key: "id",
          label: "Order ID",
          content: (
            <>
              <div className="flex items-center gap-1.5">
                <p className="heading-h4 font-bold text-primary-500">{order.orderNumber}</p>
                <CopyButton value={order.orderNumber} label="Order ID copied" />
              </div>
              <p className="body-sm-regular text-primary-300">{order.reference}</p>
            </>
          ),
        },
        {
          key: "date",
          label: "Order Date",
          icon: <CalendarDays />,
          content: (
            <>
              <p className="body-l-medium text-primary-500">{formatOrderDate(order.createdAt)}</p>
              <p className="body-sm-regular text-primary-400">{formatOrderTime(order.createdAt)}</p>
            </>
          ),
        },
        { key: "status", label: "Order Status", content: <OrderStatusBadge status={order.status} size="lg" /> },
        { key: "payment", label: "Payment Status", content: <PaymentStatusBadge status={order.status} size="lg" /> },
        {
          key: "amount",
          label: "Total Amount",
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

export default OrderSummaryStrip;
