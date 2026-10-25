import React from "react";
import { CalendarDays, CreditCard } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { OrderItem } from "@/types/order";
import { PaymentMethodLogo, PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { OutlineLinkButton } from "@/components/commerce/StudentInfoCard";
import { formatCurrency, formatOrderDate, formatOrderTime } from "../orderFormat";

function Block({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      {icon && <span className="text-primary-300 shrink-0 mt-0.5 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
      <div className="min-w-0">
        <p className="body-sm-regular text-primary-400">{label}</p>
        {children}
      </div>
    </div>
  );
}

export function OrderPaymentInfoCard({ order }: { order: OrderItem }) {
  return (
    <DetailCard
      title="Payment Information"
      action={<OutlineLinkButton href={`/payments/${order.id}`}>View Transaction</OutlineLinkButton>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:divide-x md:divide-dash">
        <div className="flex items-center gap-3 min-w-0">
          <PaymentMethodLogo method={order.paymentMethod} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="title-medium font-bold text-primary-500">{order.paymentMethod}</p>
              <PaymentStatusBadge status={order.status} size="sm" />
            </div>
            <p className="body-sm-regular text-primary-300 truncate">{order.transactionId || "Not paid yet"}</p>
          </div>
        </div>
        <div className="md:pl-5">
          <Block icon={<CalendarDays />} label="Payment Date">
            {order.paidAt ? (
              <>
                <p className="body-sm-medium text-primary-500">{formatOrderDate(order.paidAt)}</p>
                <p className="body-xsm-regular text-primary-300">{formatOrderTime(order.paidAt)}</p>
              </>
            ) : (
              <p className="body-sm-medium text-primary-300">—</p>
            )}
          </Block>
        </div>
        <div className="md:pl-5">
          <Block icon={<CreditCard />} label="Payment Method">
            <p className="body-sm-medium text-primary-500 break-words">{order.paymentAccount}</p>
          </Block>
        </div>
        <div className="md:pl-5">
          <Block label="Amount">
            <p className="heading-h5 font-bold text-primary-500">{formatCurrency(order.amount)}</p>
            <p className="body-xsm-regular text-primary-300">{order.currency}</p>
          </Block>
        </div>
      </div>
    </DetailCard>
  );
}

export default OrderPaymentInfoCard;
