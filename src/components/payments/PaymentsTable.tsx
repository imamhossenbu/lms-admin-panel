"use client";

import React from "react";
import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { Avatar } from "@/components/ui/Avatar";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { OrderItem } from "@/types/order";
import { PaymentMethodBadge, PaymentStatusBadge } from "@/components/commerce/CommerceBadges";
import { courseTitle, transactionCode, transactionHash } from "@/lib/orderView";
import { formatCurrency, formatOrderDate, formatOrderTime } from "@/components/orders/orderFormat";

interface PaymentsTableProps {
  orders: OrderItem[];
  onViewDetails: (order: OrderItem) => void;
  getMenuItems: (order: OrderItem) => DropdownActionItem[];
  /** Rendered inside the table card, under the rows (pagination). */
  footer?: React.ReactNode;
}

/** One row per payment attempt (payments are derived from orders). */
export function PaymentsTable({ orders, onViewDetails, getMenuItems, footer }: PaymentsTableProps) {
  const columns: ColumnDef<OrderItem>[] = [
    {
      key: "transaction",
      header: "Transaction ID",
      render: (row) => (
        <div className="whitespace-nowrap">
          <p className="body-sm-medium text-blue">{transactionCode(row)}</p>
          <p className="body-xsm-regular text-primary-300">{transactionHash(row)}</p>
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
      key: "order",
      header: "Order ID",
      render: (row) => (
        <Link
          href={`/orders/${row.id}`}
          onClick={(e) => e.stopPropagation()}
          className="body-sm-medium text-blue hover:underline whitespace-nowrap"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      key: "courses",
      header: "Course(s)",
      render: (row) => (
        <div className="min-w-44">
          <p className="body-sm-regular text-primary-500 truncate">{courseTitle(row)}</p>
          <p className="body-xsm-regular text-primary-300">
            {row.courses.length} {row.courses.length === 1 ? "Course" : "Courses"}
          </p>
        </div>
      ),
    },
    {
      key: "method",
      header: "Payment Method",
      render: (row) => <PaymentMethodBadge method={row.paymentMethod} />,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span className="body-sm-medium text-primary-500">{formatCurrency(row.amount)}</span>,
    },
    {
      key: "status",
      header: "Payment Status",
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Payment Date",
      render: (row) => {
        const date = row.paidAt ?? row.createdAt;
        return (
          <div className="whitespace-nowrap">
            <p className="body-sm-regular text-primary-500">{formatOrderDate(date)}</p>
            <p className="body-xsm-regular text-primary-300">{formatOrderTime(date)}</p>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "76px",
      render: (row) => <RowMoreMenu label={`Actions for ${transactionCode(row)}`} items={getMenuItems(row)} />,
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
          emptyMessage="No payments match your filters."
        />
      </div>
      {footer}
    </div>
  );
}

export default PaymentsTable;
