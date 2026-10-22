"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardOrder, OrderStatus } from "@/types/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboardData";

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

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const displayOrders = orders && orders.length > 0 ? orders : MOCK_DASHBOARD_DATA.recentOrders;

  return (
    <div className="bg-white rounded-2xl border border-dash p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Order ID
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Student
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Course
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Amount
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 body-sm-medium text-primary-500 font-medium">
                  {order.orderNumber}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={order.student.avatarUrl}
                        alt={order.student.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="body-sm-medium text-primary-500 font-medium truncate max-w-[120px]">
                      {order.student.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 body-sm-regular text-primary-400">
                  {order.course}
                </td>
                <td className="py-3.5 body-sm-medium font-semibold text-primary-500">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="py-3.5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3.5 body-sm-regular text-primary-300 whitespace-nowrap">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
