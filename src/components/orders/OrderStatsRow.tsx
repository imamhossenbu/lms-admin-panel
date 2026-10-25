import React from "react";
import { ShoppingBag, CircleDollarSign, Users, Clock, CircleX } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { OrderItem } from "@/types/order";
import { formatCurrency } from "./orderFormat";

const pct = (part: number, total: number) => `${total ? Math.round((part / total) * 100) : 0}%`;

export function OrderStatsRow({ orders }: { orders: OrderItem[] }) {
  const paid = orders.filter((o) => o.status === "Paid");
  const pending = orders.filter((o) => o.status === "Pending").length;
  const failed = orders.filter((o) => o.status === "Failed" || o.status === "Cancelled").length;
  const revenue = paid.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <TrendStatCard
        icon={<ShoppingBag />}
        iconClassName="bg-blue-14 text-blue"
        label="Total Orders"
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
        icon={<Users />}
        iconClassName="bg-purple-14 text-purple"
        label="Paid Orders"
        value={paid.length.toLocaleString()}
        trend={{ direction: "up", value: pct(paid.length, orders.length), caption: "of total orders" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        label="Pending Orders"
        value={pending.toLocaleString()}
        trend={{ direction: "up", value: pct(pending, orders.length), caption: "of total orders" }}
      />
      <TrendStatCard
        icon={<CircleX />}
        iconClassName="bg-red-14 text-red"
        label="Failed Orders"
        value={failed.toLocaleString()}
        trend={{ direction: "down", value: pct(failed, orders.length), caption: "of total orders" }}
      />
    </div>
  );
}

export default OrderStatsRow;
