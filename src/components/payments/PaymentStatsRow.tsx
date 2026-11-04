import React from "react";
import { Wallet, CircleDollarSign, CircleCheck, Clock, CircleX } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import type { OrderStats } from "@/types/order";
import { formatCurrency } from "@/components/orders/orderFormat";

const pct = (part: number, total: number) => `${total ? Math.round((part / total) * 100) : 0}%`;

/** Payments KPI cards from GET /admin/payments/stats (same search / method / date filters as the table). */
export function PaymentStatsRow({ stats }: { stats: OrderStats }) {
  const unsuccessful = stats.failed + stats.cancelled + stats.refunded;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <TrendStatCard icon={<Wallet />} iconClassName="bg-blue-14 text-blue" label="Total Payments" value={stats.total.toLocaleString()} />
      <TrendStatCard
        icon={<CircleDollarSign />}
        iconClassName="bg-green-bg text-green"
        label="Total Revenue"
        value={formatCurrency(stats.revenue, stats.currency).replace(/\.00$/, "")}
        trend={{ direction: "up", value: pct(stats.paid, stats.total), caption: "of payments received" }}
      />
      <TrendStatCard
        icon={<CircleCheck />}
        iconClassName="bg-purple-14 text-purple"
        label="Successful Payments"
        value={stats.paid.toLocaleString()}
        trend={{ direction: "up", value: pct(stats.paid, stats.total), caption: "of total payments" }}
      />
      <TrendStatCard
        icon={<Clock />}
        iconClassName="bg-yellow-bg text-yellow"
        label="Pending Payments"
        value={stats.pending.toLocaleString()}
        trend={{ direction: "up", value: pct(stats.pending, stats.total), caption: "of total payments" }}
      />
      <TrendStatCard
        icon={<CircleX />}
        iconClassName="bg-red-14 text-red"
        label="Failed / Refunded"
        value={unsuccessful.toLocaleString()}
        trend={{ direction: "down", value: pct(unsuccessful, stats.total), caption: "of total payments" }}
      />
    </div>
  );
}

export default PaymentStatsRow;
