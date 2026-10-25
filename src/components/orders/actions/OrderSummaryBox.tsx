import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { OrderItem } from "@/types/order";
import { PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { courseTitle } from "@/lib/orderView";
import { formatCurrency } from "../orderFormat";

/** Compact "which order am I acting on" card shown at the top of action modals. */
export function OrderSummaryBox({ order }: { order: OrderItem }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-dash bg-slate-50">
      <Avatar src={order.student.avatarUrl} name={order.student.name} size={40} />
      <div className="flex-1 min-w-0">
        <p className="body-sm-medium text-primary-500 truncate">
          {order.orderNumber} · {order.student.name}
        </p>
        <p className="body-xsm-regular text-primary-300 truncate">{courseTitle(order)}</p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="body-sm-medium text-primary-500">{formatCurrency(order.amount)}</p>
        <PaymentStatusBadge status={order.status} size="sm" />
      </div>
    </div>
  );
}

export default OrderSummaryBox;
