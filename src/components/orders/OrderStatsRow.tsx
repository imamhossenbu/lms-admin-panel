import React from "react";
import { ShoppingBag, CircleDollarSign, Users, Clock, CircleX } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import type { OrderStats } from "@/types/order";
import { formatCurrency } from "./orderFormat";

const pct = (part: number, total: number) => `${total ? Math.round((part / total) * 100) : 0}%`;

/** Orders KPI cards from GET /admin/orders/stats (same search / course / date filters as the table). */
export function OrderStatsRow({ stats }: { stats: OrderStats }) {
  const failed = stats.failed + stats.cancelled;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <TrendStatCard icon={<ShoppingBag />} iconClassName="bg-blue-14 text-blue" label="Total Orders" value={stats.total.toLocaleString()} />
      <TrendStatCard
        icon={<CircleDollarSign />}
        iconClassName="bg-green-bg text-green"
        label="Total Revenue"
        value={formatCurrency(stats.revenue, stats.currency).replace(/\.00$/, "")}
        trend={{ direction: "up", value: pct(stats.paid, stats.total), caption: "of orders paid" }}
      />
      <TrendStatCard
        icon={<Users />}
        iconClassName="bg-purple-14 text-purple"
        label="Paid Orders"
        value={stats.paid.toLocaleString()}
        trend={{ direction: "up", value: pct(stats.paid, stats.total), caption: "of total orders" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        label="Pending Orders"
        value={stats.pending.toLocaleString()}
        trend={{ direction: "up", value: pct(stats.pending, stats.total), caption: "of total orders" }}
      />
      <TrendStatCard
        icon={<CircleX />}
        iconClassName="bg-red-14 text-red"
        label="Failed Orders"
        value={failed.toLocaleString()}
        trend={{ direction: "down", value: pct(failed, stats.total), caption: "of total orders" }}
      />
    </div>
  );
}

export default OrderStatsRow;
