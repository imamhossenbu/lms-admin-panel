import React from "react";
import { Wallet, CircleDollarSign, CircleCheck, Clock, CircleX } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { OrderItem } from "@/types/order";
import { formatCurrency } from "@/components/orders/orderFormat";

export function PaymentStatsRow({ orders }: { orders: OrderItem[] }) {
  const count = (...statuses: OrderItem["status"][]) => orders.filter((o) => statuses.includes(o.status)).length;
  const revenue = orders.filter((o) => o.status === "Paid").reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <TrendStatCard
        icon={<Wallet />}
        iconClassName="bg-blue-14 text-blue"
        label="Total Payments"
        value={orders.length.toLocaleString()}
        trend={{ direction: "up", value: "12%", caption: "vs last month" }}
      />
      <TrendStatCard
        icon={<CircleDollarSign />}
        iconClassName="bg-green-bg text-green"
        label="Total Revenue"
        value={formatCurrency(revenue).replace(/\.00$/, "")}
        trend={{ direction: "up", value: "15%", caption: "vs last month" }}
      />
      <TrendStatCard
        icon={<CircleCheck />}
        iconClassName="bg-purple-14 text-purple"
        label="Successful Payments"
        value={count("Paid").toLocaleString()}
        trend={{ direction: "up", value: "16%", caption: "vs last month" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        label="Pending Payments"
        value={count("Pending").toLocaleString()}
        trend={{ direction: "up", value: "8%", caption: "vs last month" }}
      />
      <TrendStatCard
        icon={<CircleX />}
        iconClassName="bg-red-14 text-red"
        label="Failed / Refunded"
        value={count("Failed", "Cancelled", "Refunded").toLocaleString()}
        trend={{ direction: "down", value: "22%", caption: "vs last month" }}
      />
    </div>
  );
}

export default PaymentStatsRow;
