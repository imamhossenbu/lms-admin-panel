import React from "react";
import Link from "next/link";
import { DetailCard } from "@/components/ui/DetailCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { OrderItem } from "@/types/order";
import { OrderStatusBadge } from "@/components/commerce/CommerceBadges";
import { OutlineLinkButton } from "@/components/commerce/StudentInfoCard";
import { formatOrderDateTime } from "@/components/orders/orderFormat";

export function PaymentOrderInfoCard({ order }: { order: OrderItem }) {
  return (
    <DetailCard title="Order Information" action={<OutlineLinkButton href={`/orders/${order.id}`}>View Order</OutlineLinkButton>}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:divide-x sm:divide-dash">
        <div>
          <p className="body-sm-regular text-primary-400 mb-1.5">Order ID</p>
          <div className="flex items-center gap-1">
            <Link href={`/orders/${order.id}`} className="body-l-medium text-blue hover:underline">
              {order.orderNumber}
            </Link>
            <CopyButton value={order.orderNumber} label="Order ID copied" />
          </div>
        </div>
        <div className="sm:pl-5">
          <p className="body-sm-regular text-primary-400 mb-1.5">Order Date</p>
          <p className="body-medium text-primary-500">{formatOrderDateTime(order.createdAt)}</p>
        </div>
        <div className="sm:pl-5">
          <p className="body-sm-regular text-primary-400 mb-1.5">Order Status</p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </DetailCard>
  );
}

export default PaymentOrderInfoCard;
