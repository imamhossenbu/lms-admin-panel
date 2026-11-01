"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { paymentStatusView } from "@/lib/orderView";
import { formatCurrency, formatShortDate, type RecentOrderRow } from "@/lib/analytics";

interface RecentOrdersTableProps {
  /** Newest orders placed in the range (recentOrders). */
  orders: RecentOrderRow[];
  currency: string;
}

export function RecentOrdersTable({ orders, currency }: RecentOrdersTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<RecentOrderRow>[]>(
    () => [
      {
        key: "orderNumber",
        header: "Order ID",
        render: (row) => <span className="body-sm-medium text-primary-500 font-medium whitespace-nowrap">{row.orderNumber}</span>,
      },
      {
        key: "student",
        header: "Student",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.avatarUrl} name={row.studentName} size={24} />
            <span className="body-sm-medium text-primary-500 font-medium truncate max-w-26.25">{row.studentName}</span>
          </div>
        ),
      },
      {
        key: "course",
        header: "Course",
        render: (row) => <span className="body-sm-regular text-primary-400 truncate max-w-30 block">{row.course}</span>,
      },
      {
        key: "amount",
        header: "Amount",
        render: (row) => (
          <span className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap">{formatCurrency(row.amount, currency)}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => {
          const view = paymentStatusView(row.status);
          return (
            <ToneBadge tone={view.tone} size="sm">
              {view.label}
            </ToneBadge>
          );
        },
      },
      {
        key: "date",
        header: "Date",
        render: (row) => <span className="body-sm-regular text-primary-300 whitespace-nowrap">{formatShortDate(row.date)}</span>,
      },
    ],
    [currency]
  );

  return (
    <div className="bg-white rounded-xl border border-dash shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="heading-h6 font-bold text-primary-500">Recent Orders</h3>
        <Link
          href="/orders"
          className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Edge-to-Edge DataTable */}
      <div className="w-full border-t border-dash overflow-x-auto">
        <DataTable
          columns={columns}
          data={orders}
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          emptyMessage="No orders in this period"
          containerClassName="border-0 rounded-none w-full"
          tableClassName="w-full"
          headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
          thClassName="px-3.5 py-2.5 border-none"
          cellClassName="px-3.5 py-2.5 border-none"
        />
      </div>
    </div>
  );
}
