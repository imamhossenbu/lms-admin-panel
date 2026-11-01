"use client";

import React from "react";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { formatNumber, formatPercent, type Kpi } from "@/lib/analytics";
import type { OrderStatus } from "@/types/order";
import { ChartCard } from "../shared/ChartCard";
import { ChangeBadge } from "../shared/ChangeBadge";
import { ShareBar } from "../shared/ShareBar";
import { CardLinkButton } from "../shared/CardLinkButton";

const STATUS: Record<OrderStatus, { tone: Tone; bar: string }> = {
  Paid: { tone: "green", bar: "bg-green" },
  Pending: { tone: "yellow", bar: "bg-yellow" },
  Failed: { tone: "red", bar: "bg-red" },
  Cancelled: { tone: "gray", bar: "bg-primary-300" },
  Refunded: { tone: "purple", bar: "bg-purple" },
};

interface OrderStatusCardProps {
  byStatus: Record<OrderStatus, number>;
  placed: Kpi;
  conversion: Kpi;
  index?: number;
}

/** Orders placed in the range by current status, with conversion. */
export function OrderStatusCard({ byStatus, placed, conversion, index }: OrderStatusCardProps) {
  const total = placed.value;
  const rows = (Object.keys(STATUS) as OrderStatus[]).map((status) => ({ status, count: byStatus[status] ?? 0 }));

  return (
    <ChartCard
      title="Order status"
      subtitle="Orders placed in this period by status"
      index={index}
      action={<CardLinkButton href="/orders">View orders</CardLinkButton>}
    >
      {total === 0 ? (
        <ChartEmpty title="No orders in this period" message="Orders placed in the selected range will appear here." />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-dash bg-gray-bg px-3.5 py-3">
              <p className="body-2xsm-regular text-primary-300">Orders placed</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h4-semibold text-primary-500">{formatNumber(total)}</span>
                <ChangeBadge changePct={placed.changePct} />
              </div>
            </div>
            <div className="rounded-xl border border-dash bg-gray-bg px-3.5 py-3">
              <p className="body-2xsm-regular text-primary-300">Conversion</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h4-semibold text-primary-500">{formatPercent(conversion.value)}</span>
                <ChangeBadge changePct={conversion.changePct} />
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.status} className="grid grid-cols-3 items-center gap-3">
                <div className="flex items-center justify-between gap-2">
                  <ToneBadge tone={STATUS[row.status].tone} size="sm" dot>
                    {row.status}
                  </ToneBadge>
                  <span className="body-sm-medium font-semibold! text-primary-500">{formatNumber(row.count)}</span>
                </div>
                <div className="col-span-2">
                  <ShareBar value={(row.count / total) * 100} label={formatPercent((row.count / total) * 100)} barClassName={STATUS[row.status].bar} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}

export default OrderStatusCard;
