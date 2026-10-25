import React from "react";
import { DollarSign, CreditCard, CircleCheck, Clock, CircleX, RotateCcw } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { PaymentRecord } from "@/lib/paymentData";
import { formatCurrency } from "@/components/orders/orderFormat";

export function PaymentStatsRow({ payments }: { payments: PaymentRecord[] }) {
  const count = (status: PaymentRecord["status"]) => payments.filter((p) => p.status === status).length;
  const revenue = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.order.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      <TrendStatCard
        icon={<DollarSign />}
        iconClassName="bg-green-bg text-green"
        value={formatCurrency(revenue).replace(/\.00$/, "")}
        label="Total Revenue"
        trend={{ direction: "up", value: "18%" }}
      />
      <TrendStatCard
        icon={<CreditCard />}
        iconClassName="bg-blue-14 text-blue"
        value={payments.length.toLocaleString()}
        label="Total Payments"
        trend={{ direction: "up", value: "12%" }}
      />
      <TrendStatCard
        icon={<CircleCheck />}
        iconClassName="bg-green-bg text-green"
        value={count("Completed").toLocaleString()}
        label="Successful"
        trend={{ direction: "up", value: "15%" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        value={count("Pending").toLocaleString()}
        label="Pending"
        trend={{ direction: "down", value: "5%" }}
      />
      <TrendStatCard
        icon={<CircleX />}
        iconClassName="bg-red-14 text-red"
        value={count("Failed").toLocaleString()}
        label="Failed"
        trend={{ direction: "down", value: "2%" }}
      />
      <TrendStatCard
        icon={<RotateCcw />}
        iconClassName="bg-purple-14 text-purple"
        value={count("Refunded").toLocaleString()}
        label="Refunded"
        trend={{ direction: "down", value: "1%" }}
      />
    </div>
  );
}

export default PaymentStatsRow;
