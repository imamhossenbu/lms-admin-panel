"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardOrder, OrderStatus } from "@/types/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboardData";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";

interface RecentOrdersTableProps {
  orders?: DashboardOrder[];
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xsm-medium bg-green-bg text-green font-semibold">
        Completed
      </span>
    );
  }
  if (status === "Pending") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xsm-medium bg-[#FFF4ED] text-[#FF5B00] font-semibold">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xsm-medium bg-red-14 text-red-dark font-semibold">
      Failed
    </span>
  );
}

const columns: ColumnDef<DashboardOrder>[] = [
  {
    key: "orderNumber",
    header: "Order ID",
    render: (row) => (
      <span className="body-sm-medium text-primary-500 font-medium">
        {row.orderNumber}
      </span>
    ),
  },
  {
    key: "student",
    header: "Student",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={row.student.avatarUrl}
            alt={row.student.name}
            fill
            sizes="28px"
            className="object-cover"
            unoptimized
          />
        </div>
        <span className="body-sm-medium text-primary-500 font-medium truncate max-w-[120px]">
          {row.student.name}
        </span>
      </div>
    ),
  },
  {
    key: "course",
    header: "Course",
    render: (row) => (
      <span className="body-sm-regular text-primary-400">
        {row.course}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (row) => (
      <span className="body-sm-medium font-semibold text-primary-500">
        ${row.amount.toFixed(2)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "date",
    header: "Date",
    render: (row) => (
      <span className="body-sm-regular text-primary-300 whitespace-nowrap">
        {row.date}
      </span>
    ),
  },
];

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const displayOrders =
    orders && orders.length > 0 ? orders : MOCK_DASHBOARD_DATA.recentOrders;

  return (
    <div className="bg-white rounded-2xl border border-dash shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="heading-h5 font-bold text-primary-500">
          Recent Orders
        </h3>
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
          data={displayOrders}
          verticalBorders={false}
          containerClassName="border-0 rounded-none w-full"
          tableClassName="w-full"
          headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
          thClassName="px-5 py-3 border-none"
          cellClassName="px-5 py-3.5 border-none"
        />
      </div>
    </div>
  );
}
