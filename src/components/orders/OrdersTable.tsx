"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { Avatar } from "@/components/ui/Avatar";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { OrderItem } from "@/types/order";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { CourseThumbnail } from "@/components/commerce/PurchasedCoursesCard";
import { courseSummary, courseTitle } from "@/lib/orderView";
import { formatCurrency, formatOrderDate, formatOrderTime } from "./orderFormat";

interface OrdersTableProps {
  orders: OrderItem[];
  onViewDetails: (order: OrderItem) => void;
  getMenuItems: (order: OrderItem) => DropdownActionItem[];
  /** Rendered inside the table card, under the rows (pagination). */
  footer?: React.ReactNode;
}

export function OrdersTable({ orders, onViewDetails, getMenuItems, footer }: OrdersTableProps) {
  const columns: ColumnDef<OrderItem>[] = [
    {
      key: "orderNumber",
      header: "Order ID",
      render: (row) => (
        <div className="whitespace-nowrap">
          <p className="body-sm-medium text-primary-500">{row.orderNumber}</p>
          <p className="body-xsm-regular text-primary-300">{row.reference}</p>
        </div>
      ),
    },
    {
      key: "student",
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-48">
          <Avatar src={row.student.avatarUrl} name={row.student.name} size={40} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate">{row.student.name}</p>
            <p className="body-xsm-regular text-primary-300 truncate">{row.student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "courses",
      header: "Course(s)",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-56">
          <CourseThumbnail course={row.courses[0]} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate">{courseTitle(row)}</p>
            <p className="body-xsm-regular text-primary-300">{courseSummary(row)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span className="body-sm-medium text-primary-500">{formatCurrency(row.amount)}</span>,
    },
    {
      key: "payment",
      header: "Payment Status",
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "status",
      header: "Order Status",
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Order Date",
      render: (row) => (
        <div className="whitespace-nowrap">
          <p className="body-sm-regular text-primary-500">{formatOrderDate(row.createdAt)}</p>
          <p className="body-xsm-regular text-primary-300">{formatOrderTime(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "76px",
      render: (row) => <RowMoreMenu label={`Actions for ${row.orderNumber}`} items={getMenuItems(row)} />,
    },
  ];

  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={orders}
          rowKey={(row) => row.id}
          onRowClick={onViewDetails}
          verticalBorders
          containerClassName="border-0 rounded-none"
          headerClassName="bg-slate-50 border-b border-dash"
          thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
          cellClassName="px-3.5 py-3"
          emptyMessage="No orders match your filters."
        />
      </div>
      {footer}
    </div>
  );
}

export default OrdersTable;
