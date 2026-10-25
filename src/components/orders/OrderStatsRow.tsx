import React from "react";
import { ShoppingCart, DollarSign, CircleCheck, Clock } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { OrderItem } from "@/types/order";
import { formatCurrency } from "./orderFormat";

export function OrderStatsRow({ orders }: { orders: OrderItem[] }) {
  const paid = orders.filter((o) => o.status === "Paid");
  const pending = orders.filter((o) => o.status === "Pending").length;
  const revenue = paid.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <TrendStatCard
        icon={<ShoppingCart />}
        iconClassName="bg-brand-orange-light text-brand-orange"
        value={orders.length.toLocaleString()}
        label="Total Orders"
        trend={{ direction: "up", value: "12%" }}
      />
      <TrendStatCard
        icon={<DollarSign />}
        iconClassName="bg-green-bg text-green"
        value={formatCurrency(revenue).replace(/\.00$/, "")}
        label="Total Revenue"
        trend={{ direction: "up", value: "18%" }}
      />
      <TrendStatCard
        icon={<CircleCheck />}
        iconClassName="bg-green-bg text-green"
        value={paid.length.toLocaleString()}
        label="Paid Orders"
        trend={{ direction: "up", value: "15%" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        value={pending.toLocaleString()}
        label="Pending Orders"
        trend={{ direction: "down", value: "5%" }}
      />
    </div>
  );
}

export default OrderStatsRow;
